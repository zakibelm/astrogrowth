CREATE TABLE `campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`targetIndustry` varchar(100) NOT NULL,
	`targetLocation` text NOT NULL,
	`status` enum('draft','running','completed','error') NOT NULL DEFAULT 'draft',
	`totalLeads` int NOT NULL DEFAULT 0,
	`totalContent` int NOT NULL DEFAULT 0,
	`totalPublished` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`completedAt` timestamp,
	CONSTRAINT `campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`campaignId` int NOT NULL,
	`userId` int NOT NULL,
	`textContent` text NOT NULL,
	`imageUrl` text,
	`imageS3Key` text,
	`hashtags` text,
	`qualityScore` int NOT NULL,
	`status` enum('pending','approved','rejected','published') NOT NULL DEFAULT 'pending',
	`approvedAt` timestamp,
	`rejectedAt` timestamp,
	`publishedAt` timestamp,
	`linkedinPostId` text,
	`linkedinPostUrl` text,
	`likes` int DEFAULT 0,
	`comments` int DEFAULT 0,
	`shares` int DEFAULT 0,
	`impressions` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`userId` int NOT NULL,
	`businessName` varchar(255) NOT NULL,
	`businessType` varchar(100),
	`address` text,
	`city` varchar(100),
	`province` varchar(100),
	`postalCode` varchar(20),
	`phone` varchar(50),
	`email` varchar(320),
	`website` text,
	`googleMapsUrl` text,
	`googleRating` decimal(2,1),
	`googleReviews` int,
	`leadScore` int NOT NULL,
	`enriched` boolean NOT NULL DEFAULT false,
	`enrichmentError` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('campaign_created','leads_ready','content_generated','post_published','system_error') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`read` boolean NOT NULL DEFAULT false,
	`readAt` timestamp,
	`campaignId` int,
	`leadId` int,
	`contentId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rateLimits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`postsToday` int NOT NULL DEFAULT 0,
	`lastPostAt` timestamp,
	`lastResetAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rateLimits_id` PRIMARY KEY(`id`),
	CONSTRAINT `rateLimits_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `businessName` text;--> statement-breakpoint
ALTER TABLE `users` ADD `businessType` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `businessLocation` text;--> statement-breakpoint
ALTER TABLE `users` ADD `businessPhone` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `businessWebsite` text;--> statement-breakpoint
ALTER TABLE `users` ADD `linkedinAccessToken` text;--> statement-breakpoint
ALTER TABLE `users` ADD `linkedinRefreshToken` text;--> statement-breakpoint
ALTER TABLE `users` ADD `linkedinTokenExpiry` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `linkedinConnected` boolean DEFAULT false NOT NULL;