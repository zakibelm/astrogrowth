import { invokeLLM } from "./_core/llm";
import { AGENTS_DATA } from "../shared/agents-data";
import { getWorkflowById, listCustomWorkflows } from "./db-agents";

/**
 * Workflow Orchestrator
 * 
 * Coordinates the execution of workflows by:
 * 1. Reading workflow mission and agent sequence
 * 2. Executing agents sequentially with personalized prompts
 * 3. Validating outputs between steps
 * 4. Handling errors and retries
 * 5. Logging execution progress
 */

interface AgentExecution {
  agentId: string;
  position: number;
  status: "pending" | "running" | "completed" | "failed";
  input?: string;
  output?: string;
  error?: string;
  attempts: number;
  startedAt?: Date;
  completedAt?: Date;
}

interface WorkflowExecution {
  workflowId: number;
  userId: number;
  mission: string;
  agents: AgentExecution[];
  status: "pending" | "running" | "completed" | "failed";
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

export class WorkflowOrchestrator {
  private execution: WorkflowExecution | null = null;
  private maxRetries = 3;

  /**
   * Execute a workflow (template or custom)
   */
  async executeWorkflow(
    workflowId: number,
    userId: number,
    config: {
      businessInfo?: any;
      marketingGoals?: any;
      agentPreferences?: any;
    }
  ): Promise<WorkflowExecution> {
    console.log(`[Orchestrator] Starting workflow ${workflowId} for user ${userId}`);

    // 1. Load workflow details
    const workflow = await this.loadWorkflow(workflowId, userId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    // 2. Initialize execution
    this.execution = {
      workflowId,
      userId,
      mission: workflow.mission,
      agents: workflow.agentIds.map((agentId: string, index: number) => ({
        agentId,
        position: index,
        status: "pending",
        attempts: 0,
      })),
      status: "running",
      startedAt: new Date(),
    };

    console.log(`[Orchestrator] Workflow mission: ${workflow.mission}`);
    console.log(`[Orchestrator] Agents sequence: ${workflow.agentIds.join(" → ")}`);

    // 3. Execute agents sequentially
    for (let i = 0; i < this.execution.agents.length; i++) {
      const agentExecution = this.execution.agents[i];
      const previousOutput = i > 0 ? this.execution.agents[i - 1].output : undefined;

      try {
        await this.executeAgent(agentExecution, workflow.mission, config, previousOutput);
      } catch (error) {
        console.error(`[Orchestrator] Agent ${agentExecution.agentId} failed:`, error);
        this.execution.status = "failed";
        this.execution.error = `Agent ${agentExecution.agentId} failed after ${agentExecution.attempts} attempts`;
        this.execution.completedAt = new Date();
        throw error;
      }
    }

    // 4. Mark workflow as completed
    this.execution.status = "completed";
    this.execution.completedAt = new Date();

    console.log(`[Orchestrator] Workflow ${workflowId} completed successfully`);
    return this.execution;
  }

  /**
   * Execute a single agent with retry logic
   */
  private async executeAgent(
    agentExecution: AgentExecution,
    workflowMission: string,
    config: any,
    previousOutput?: string
  ): Promise<void> {
    const agentData = AGENTS_DATA[agentExecution.agentId];
    if (!agentData) {
      throw new Error(`Agent ${agentExecution.agentId} not found in AGENTS_DATA`);
    }

    agentExecution.status = "running";
    agentExecution.startedAt = new Date();

    console.log(`[Orchestrator] Executing agent ${agentData.name} (${agentExecution.agentId})`);

    // Build agent prompt with context
    const agentPrompt = this.buildAgentPrompt(
      agentData,
      workflowMission,
      config,
      previousOutput
    );

    // Retry loop
    while (agentExecution.attempts < this.maxRetries) {
      agentExecution.attempts++;

      try {
        console.log(`[Orchestrator] Agent ${agentData.name} attempt ${agentExecution.attempts}/${this.maxRetries}`);

        // Call LLM with agent prompt
        const response = await invokeLLM({
          messages: [
            { role: "system", content: agentPrompt },
            { role: "user", content: previousOutput || "Commencez votre travail selon votre mission." },
          ],
        });

        const content = response.choices[0]?.message?.content;
        const output = typeof content === 'string' ? content : JSON.stringify(content);
        
        // Validate output
        if (!output || output.length < 50) {
          throw new Error("Output too short or empty");
        }

        // Success
        agentExecution.output = output;
        agentExecution.status = "completed";
        agentExecution.completedAt = new Date();

        console.log(`[Orchestrator] Agent ${agentData.name} completed successfully`);
        console.log(`[Orchestrator] Output preview: ${output.substring(0, 100)}...`);

        return;
      } catch (error) {
        console.error(`[Orchestrator] Agent ${agentData.name} attempt ${agentExecution.attempts} failed:`, error);
        agentExecution.error = (error as Error).message;

        if (agentExecution.attempts >= this.maxRetries) {
          agentExecution.status = "failed";
          throw new Error(`Agent ${agentData.name} failed after ${this.maxRetries} attempts`);
        }

        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * agentExecution.attempts));
      }
    }
  }

  /**
   * Build personalized prompt for agent
   */
  private buildAgentPrompt(
    agentData: any,
    workflowMission: string,
    config: any,
    previousOutput?: string
  ): string {
    const businessInfo = config.businessInfo || {};
    const marketingGoals = config.marketingGoals || {};

    let prompt = `# MISSION DU WORKFLOW\n${workflowMission}\n\n`;
    prompt += `# TON RÔLE\nTu es ${agentData.name}, ${agentData.role}.\n\n`;
    prompt += `# TA MISSION SPÉCIFIQUE\n${agentData.mission}\n\n`;

    // Add business context
    if (businessInfo.businessName) {
      prompt += `# CONTEXTE BUSINESS\n`;
      prompt += `- Entreprise: ${businessInfo.businessName}\n`;
      if (businessInfo.sector) prompt += `- Secteur: ${businessInfo.sector}\n`;
      if (businessInfo.website) prompt += `- Site web: ${businessInfo.website}\n`;
      if (businessInfo.address) prompt += `- Localisation: ${businessInfo.address}\n`;
      prompt += `\n`;
    }

    // Add marketing goals
    if (marketingGoals.primaryGoal) {
      prompt += `# OBJECTIFS MARKETING\n`;
      prompt += `- Objectif principal: ${marketingGoals.primaryGoal}\n`;
      if (marketingGoals.leadsGoal) prompt += `- Leads cible: ${marketingGoals.leadsGoal}/mois\n`;
      if (marketingGoals.budget) prompt += `- Budget: ${marketingGoals.budget} USD/mois\n`;
      prompt += `\n`;
    }

    // Add previous agent output
    if (previousOutput) {
      prompt += `# TRAVAIL DE L'AGENT PRÉCÉDENT\n${previousOutput}\n\n`;
      prompt += `Utilise ce travail comme point de départ pour accomplir ta mission.\n\n`;
    }

    prompt += `# INSTRUCTIONS\n`;
    prompt += `1. Accomplis ta mission en respectant les bonnes pratiques de ton domaine\n`;
    prompt += `2. Produis un résultat de haute qualité, actionnable et professionnel\n`;
    prompt += `3. Sois précis, concret et orienté résultats\n`;
    prompt += `4. Si tu utilises des données, assure-toi qu'elles sont réalistes et pertinentes\n\n`;

    prompt += `Commence maintenant.`;

    return prompt;
  }

  /**
   * Load workflow details (template or custom)
   */
  private async loadWorkflow(workflowId: number, userId: number): Promise<any> {
    // Try loading as template workflow
    const templateWorkflow = await getWorkflowById(workflowId);
    if (templateWorkflow) {
      return {
        id: templateWorkflow.id,
        name: templateWorkflow.name,
        mission: templateWorkflow.description, // Use description as mission for templates
        agentIds: templateWorkflow.agentIds as string[],
      };
    }

    // Try loading as custom workflow
    const customWorkflows = await listCustomWorkflows(userId);
    const customWorkflow = customWorkflows.find((w: any) => w.id === workflowId);
    
    if (customWorkflow) {
      return {
        id: customWorkflow.id,
        name: customWorkflow.name,
        mission: customWorkflow.mission,
        agentIds: customWorkflow.agents.sort((a: any, b: any) => a.position - b.position).map((a: any) => a.id),
      };
    }

    return null;
  }

  /**
   * Get current execution status
   */
  getExecutionStatus(): WorkflowExecution | null {
    return this.execution;
  }
}

// Export singleton instance
export const orchestrator = new WorkflowOrchestrator();
