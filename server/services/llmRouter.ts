import axios from 'axios';
import { logger, logOperation, logError } from '../config/logger';
import { circuitBreakerManager } from './circuitBreaker';
import { semanticCache } from './semanticCache';
import { captureError } from '../config/sentry';
import pLimit from 'p-limit';

/**
 * LLM Router - Production Ready Multi-Provider System
 *
 * Features:
 * - Multi-provider support (OpenRouter, Hugging Face, Ollama)
 * - Intelligent failover (3 tiers)
 * - Circuit breaker pattern
 * - Semantic caching (80%+ cost reduction)
 * - Task-based routing
 * - Cost optimization
 * - Performance tracking
 */

export enum LLMProvider {
  OPENROUTER = 'openrouter',
  HUGGINGFACE = 'huggingface',
  OLLAMA = 'ollama',
}

export enum TaskType {
  QUALIFICATION = 'qualification', // Lead scoring
  CONTENT_GENERATION = 'content_generation', // Posts, emails
  VERIFICATION = 'verification', // Quality checks
  ANALYSIS = 'analysis', // Analytics, insights
  SIMPLE = 'simple', // Basic tasks
}

// OpenRouter models
export const OpenRouterModels = {
  GEMINI_FLASH: 'google/gemini-2.0-flash-exp:free',
  CLAUDE_SONNET_4: 'anthropic/claude-sonnet-4',
  LLAMA_70B: 'meta-llama/llama-3.3-70b-instruct:free',
  GPT4O_MINI: 'openai/gpt-4o-mini',
} as const;

// Hugging Face models
export const HuggingFaceModels = {
  MISTRAL_7B: 'mistralai/Mistral-7B-Instruct-v0.2',
  ZEPHYR_7B: 'HuggingFaceH4/zephyr-7b-beta',
  MIXTRAL_8X7B: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
} as const;

// Ollama models
export const OllamaModels = {
  LLAMA_3B: 'llama3.2:3b',
  PHI3_MINI: 'phi3:mini',
} as const;

type ModelName =
  | (typeof OpenRouterModels)[keyof typeof OpenRouterModels]
  | (typeof HuggingFaceModels)[keyof typeof HuggingFaceModels]
  | (typeof OllamaModels)[keyof typeof OllamaModels];

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  model: string;
  provider: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  metadata: {
    taskType: TaskType;
    latencyMs: number;
    cached: boolean;
    fallbackAttempts: number;
    timestamp: string;
  };
}

export interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  bypassCache?: boolean;
  forceProvider?: LLMProvider;
  forceModel?: ModelName;
}

/**
 * Routing strategy per task type
 * Order matters: first working provider wins
 */
const ROUTING_STRATEGY: Record<TaskType, Array<{ provider: LLMProvider; model: ModelName }>> = {
  [TaskType.QUALIFICATION]: [
    { provider: LLMProvider.OPENROUTER, model: OpenRouterModels.GEMINI_FLASH }, // FREE, fast
    { provider: LLMProvider.OPENROUTER, model: OpenRouterModels.LLAMA_70B }, // FREE fallback
    { provider: LLMProvider.HUGGINGFACE, model: HuggingFaceModels.MISTRAL_7B }, // FREE backup
    { provider: LLMProvider.OLLAMA, model: OllamaModels.LLAMA_3B }, // Local emergency
  ],
  [TaskType.CONTENT_GENERATION]: [
    { provider: LLMProvider.OPENROUTER, model: OpenRouterModels.CLAUDE_SONNET_4 }, // Premium quality
    { provider: LLMProvider.OPENROUTER, model: OpenRouterModels.GPT4O_MINI }, // Good fallback
    { provider: LLMProvider.HUGGINGFACE, model: HuggingFaceModels.MIXTRAL_8X7B }, // FREE backup
    { provider: LLMProvider.OLLAMA, model: OllamaModels.LLAMA_3B }, // Local emergency
  ],
  [TaskType.VERIFICATION]: [
    { provider: LLMProvider.OPENROUTER, model: OpenRouterModels.GEMINI_FLASH }, // FREE sufficient
    { provider: LLMProvider.OPENROUTER, model: OpenRouterModels.LLAMA_70B }, // FREE fallback
    { provider: LLMProvider.HUGGINGFACE, model: HuggingFaceModels.ZEPHYR_7B }, // FREE backup
    { provider: LLMProvider.OLLAMA, model: OllamaModels.PHI3_MINI }, // Local emergency
  ],
  [TaskType.ANALYSIS]: [
    { provider: LLMProvider.OPENROUTER, model: OpenRouterModels.GEMINI_FLASH }, // FREE, capable
    { provider: LLMProvider.OPENROUTER, model: OpenRouterModels.GPT4O_MINI }, // Paid fallback
    { provider: LLMProvider.HUGGINGFACE, model: HuggingFaceModels.MIXTRAL_8X7B }, // FREE backup
    { provider: LLMProvider.OLLAMA, model: OllamaModels.LLAMA_3B }, // Local emergency
  ],
  [TaskType.SIMPLE]: [
    { provider: LLMProvider.OPENROUTER, model: OpenRouterModels.LLAMA_70B }, // FREE
    { provider: LLMProvider.HUGGINGFACE, model: HuggingFaceModels.MISTRAL_7B }, // FREE
    { provider: LLMProvider.OLLAMA, model: OllamaModels.PHI3_MINI }, // Local
  ],
};

export class LLMRouter {
  private readonly openrouterApiKey: string;
  private readonly huggingfaceToken: string;
  private readonly ollamaUrl: string;

  constructor() {
    this.openrouterApiKey = process.env.OPENROUTER_API_KEY || '';
    this.huggingfaceToken = process.env.HUGGINGFACE_TOKEN || '';
    this.ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';

    if (!this.openrouterApiKey) {
      logger.warn('[LLMRouter] OPENROUTER_API_KEY not set');
    }
    if (!this.huggingfaceToken) {
      logger.warn('[LLMRouter] HUGGINGFACE_TOKEN not set');
    }
  }

  /**
   * Call OpenRouter API
   */
  private async callOpenRouter(
    model: ModelName,
    messages: LLMMessage[],
    options: LLMOptions = {}
  ): Promise<any> {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 1000,
        top_p: options.topP ?? 0.9,
      },
      {
        headers: {
          Authorization: `Bearer ${this.openrouterApiKey}`,
          'HTTP-Referer': 'https://astrogrowth.ca',
          'X-Title': 'AstroGrowth',
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    return response.data;
  }

  /**
   * Call Hugging Face Inference API
   */
  private async callHuggingFace(
    model: ModelName,
    messages: LLMMessage[],
    options: LLMOptions = {}
  ): Promise<any> {
    // Convert to HF format
    const prompt = messages.map((msg) => `${msg.role}: ${msg.content}`).join('\n');

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: options.maxTokens ?? 1000,
          temperature: options.temperature ?? 0.7,
          top_p: options.topP ?? 0.9,
          return_full_text: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${this.huggingfaceToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    // Convert HF response to OpenAI format
    const generatedText = response.data[0]?.generated_text || response.data.generated_text || '';

    return {
      choices: [
        {
          message: {
            role: 'assistant',
            content: generatedText,
          },
        },
      ],
      usage: {
        total_tokens: prompt.length + generatedText.length,
      },
    };
  }

  /**
   * Call Ollama local instance
   */
  private async callOllama(
    model: ModelName,
    messages: LLMMessage[],
    options: LLMOptions = {}
  ): Promise<any> {
    const response = await axios.post(
      `${this.ollamaUrl}/api/chat`,
      {
        model,
        messages,
        stream: false,
        options: {
          temperature: options.temperature ?? 0.7,
          num_predict: options.maxTokens ?? 1000,
        },
      },
      {
        timeout: 120000, // Longer timeout for local
      }
    );

    // Convert Ollama response to OpenAI format
    return {
      choices: [
        {
          message: {
            role: 'assistant',
            content: response.data.message.content,
          },
        },
      ],
      usage: {
        total_tokens: response.data.eval_count || 0,
      },
    };
  }

  /**
   * Complete with intelligent routing and failover
   */
  async complete(
    taskType: TaskType,
    messages: LLMMessage[],
    options: LLMOptions = {}
  ): Promise<LLMResponse> {
    const startTime = Date.now();

    // Check cache first (unless bypassed)
    if (!options.bypassCache) {
      const cached = await semanticCache.get(messages, taskType);
      if (cached) {
        return {
          ...cached,
          metadata: {
            ...cached.metadata,
            cached: true,
            latencyMs: Date.now() - startTime,
          },
        };
      }
    }

    // Get routing strategy
    let strategy = ROUTING_STRATEGY[taskType];

    // Override if forced
    if (options.forceProvider && options.forceModel) {
      strategy = [{ provider: options.forceProvider, model: options.forceModel }];
    }

    const errors: Array<{ provider: string; model: string; error: string }> = [];

    // Try each provider in order
    for (const { provider, model } of strategy) {
      try {
        // Get circuit breaker for this provider
        const breaker = circuitBreakerManager.getBreaker(provider);

        // Check if circuit is available
        if (!breaker.isAvailable()) {
          errors.push({
            provider,
            model,
            error: 'Circuit breaker OPEN',
          });
          continue;
        }

        logOperation('LLMRouter', `Trying ${provider}/${model}`);

        // Execute with circuit breaker protection
        const result = await breaker.execute(async () => {
          switch (provider) {
            case LLMProvider.OPENROUTER:
              return await this.callOpenRouter(model, messages, options);
            case LLMProvider.HUGGINGFACE:
              return await this.callHuggingFace(model, messages, options);
            case LLMProvider.OLLAMA:
              return await this.callOllama(model, messages, options);
            default:
              throw new Error(`Unknown provider: ${provider}`);
          }
        });

        // Success!
        const latencyMs = Date.now() - startTime;

        const response: LLMResponse = {
          content: result.choices[0].message.content,
          model,
          provider,
          usage: result.usage,
          metadata: {
            taskType,
            latencyMs,
            cached: false,
            fallbackAttempts: errors.length,
            timestamp: new Date().toISOString(),
          },
        };

        // Cache successful response
        await semanticCache.set(messages, response, taskType, model);

        logger.info(`[LLMRouter] Success with ${provider}/${model}`, {
          latencyMs,
          fallbackAttempts: errors.length,
        });

        return response;
      } catch (error: any) {
        const errorMsg = error.response?.data?.error?.message || error.message || 'Unknown error';

        logError('LLMRouter', `${provider}/${model}`, error, {
          status: error.response?.status,
        });

        errors.push({
          provider,
          model,
          error: errorMsg,
        });

        // Continue to next provider
        continue;
      }
    }

    // All providers failed
    const errorSummary = errors.map((e) => `${e.provider}/${e.model}: ${e.error}`).join('; ');

    captureError(new Error(`All LLM providers failed for ${taskType}`), {
      tags: { task_type: taskType },
      extra: { errors },
    });

    throw new Error(`All LLM providers failed for task ${taskType}. Errors: ${errorSummary}`);
  }

  /**
   * Batch complete with concurrency control
   */
  async batchComplete(
    requests: Array<{
      taskType: TaskType;
      messages: LLMMessage[];
      options?: LLMOptions;
    }>,
    concurrency: number = 5
  ): Promise<LLMResponse[]> {
    const limit = pLimit(concurrency);

    const promises = requests.map((req) =>
      limit(() => this.complete(req.taskType, req.messages, req.options))
    );

    return Promise.all(promises);
  }
}

// Global LLM router instance
export const llmRouter = new LLMRouter();

export default LLMRouter;
