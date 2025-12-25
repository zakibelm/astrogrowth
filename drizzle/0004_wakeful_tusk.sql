CREATE TABLE `user_agents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`agentId` varchar(100) NOT NULL,
	`enabled` boolean NOT NULL DEFAULT false,
	`llmModel` varchar(50) NOT NULL DEFAULT 'gemini-2.0-flash',
	`systemPrompt` text,
	`ragDocuments` json DEFAULT ('[]'),
	`config` json DEFAULT ('{}'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_agents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_workflows` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`workflowId` int NOT NULL,
	`active` boolean NOT NULL DEFAULT true,
	`activatedAt` timestamp NOT NULL DEFAULT (now()),
	`deactivatedAt` timestamp,
	CONSTRAINT `user_workflows_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workflows` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workflowId` varchar(100) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`icon` varchar(10) NOT NULL,
	`targetSector` varchar(100) NOT NULL,
	`agentIds` json NOT NULL,
	`estimatedTimeSaved` varchar(50),
	`estimatedROI` varchar(50),
	`monthlyPrice` int,
	`isActive` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workflows_id` PRIMARY KEY(`id`),
	CONSTRAINT `workflows_workflowId_unique` UNIQUE(`workflowId`)
);
