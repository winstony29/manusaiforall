CREATE TABLE `calendar_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`month` varchar(20) NOT NULL,
	`date` varchar(50) NOT NULL,
	`event` varchar(200) NOT NULL,
	`type` enum('Public Holiday','Cultural','Commercial','Custom') NOT NULL DEFAULT 'Custom',
	`priority` int NOT NULL DEFAULT 2,
	`campaign` varchar(200),
	`isDefault` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `calendar_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `weekly_schedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`day` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
	`instagram` text,
	`tiktok` text,
	`facebook` text,
	`isDefault` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `weekly_schedules_id` PRIMARY KEY(`id`)
);
