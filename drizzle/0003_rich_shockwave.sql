CREATE TABLE `agent_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agentId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileUrl` text NOT NULL,
	`fileKey` text NOT NULL,
	`fileSize` int NOT NULL,
	`mimeType` varchar(100) NOT NULL,
	`processed` boolean NOT NULL DEFAULT false,
	`vectorized` boolean NOT NULL DEFAULT false,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `agent_documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `agents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('lead_scraper','content_generator','publisher','analyzer') NOT NULL,
	`description` text,
	`model` varchar(100) NOT NULL DEFAULT 'gemini-2.0-flash',
	`systemPrompt` text NOT NULL,
	`temperature` int DEFAULT 70,
	`maxTokens` int DEFAULT 2000,
	`enabled` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agents_id` PRIMARY KEY(`id`)
);
