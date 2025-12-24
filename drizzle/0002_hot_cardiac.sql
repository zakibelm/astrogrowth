CREATE TABLE `api_credits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`total_credits` decimal(10,2) NOT NULL DEFAULT '100.00',
	`used_credits` decimal(10,2) NOT NULL DEFAULT '0.00',
	`remaining_credits` decimal(10,2) NOT NULL DEFAULT '100.00',
	`monthly_limit` decimal(10,2) DEFAULT '50.00',
	`current_month_usage` decimal(10,2) DEFAULT '0.00',
	`low_credit_threshold` decimal(10,2) DEFAULT '10.00',
	`alert_sent` timestamp,
	`last_reset_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `api_credits_id` PRIMARY KEY(`id`),
	CONSTRAINT `api_credits_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `api_usage` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`provider` varchar(50) NOT NULL,
	`category` enum('llm','image','scraping','other') NOT NULL,
	`request_count` int NOT NULL DEFAULT 1,
	`tokens_used` int DEFAULT 0,
	`credits_used` decimal(10,4) DEFAULT '0',
	`cost` decimal(10,4) DEFAULT '0',
	`campaign_id` int,
	`lead_id` int,
	`content_id` int,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`date` varchar(10) NOT NULL,
	CONSTRAINT `api_usage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `llm_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`request_id` varchar(100) NOT NULL,
	`provider` enum('openrouter','huggingface','ollama') NOT NULL,
	`model` varchar(100) NOT NULL,
	`prompt` text NOT NULL,
	`response` text,
	`prompt_tokens` int DEFAULT 0,
	`completion_tokens` int DEFAULT 0,
	`total_tokens` int DEFAULT 0,
	`cost` decimal(10,6) DEFAULT '0',
	`duration` int DEFAULT 0,
	`status` enum('success','error','fallback') NOT NULL,
	`error_message` text,
	`fallback_tier` int,
	`campaign_id` int,
	`lead_id` int,
	`content_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `llm_requests_id` PRIMARY KEY(`id`),
	CONSTRAINT `llm_requests_request_id_unique` UNIQUE(`request_id`)
);
--> statement-breakpoint
CREATE TABLE `platform_connections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`provider` varchar(50) NOT NULL,
	`category` enum('social','media','scraping','llm') NOT NULL,
	`api_key` text,
	`api_secret` text,
	`access_token` text,
	`refresh_token` text,
	`config` json,
	`status` enum('connected','disconnected','error') NOT NULL DEFAULT 'disconnected',
	`last_error` text,
	`connected_at` timestamp,
	`last_used_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `platform_connections_id` PRIMARY KEY(`id`)
);
