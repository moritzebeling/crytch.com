CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`version` integer DEFAULT 2 NOT NULL,
	`message_url` text NOT NULL,
	`message` text NOT NULL,
	`grid_size` integer DEFAULT 15,
	`grid_width` integer,
	`grid_height` integer,
	`window_width` integer,
	`window_height` integer,
	`style_color` text DEFAULT '#000000',
	`style_background` text DEFAULT '#ffffff',
	`style_stroke` integer DEFAULT 2,
	`language` text DEFAULT 'en',
	`settings` text,
	`created_at` integer NOT NULL,
	`view_count` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `messages_message_url_unique` ON `messages` (`message_url`);