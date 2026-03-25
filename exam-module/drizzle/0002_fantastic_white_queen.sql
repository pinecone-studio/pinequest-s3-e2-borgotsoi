PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_proctor_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`exam_id` text,
	`student_id` text NOT NULL,
	`event_type` text NOT NULL,
	`timestamp` integer,
	FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_proctor_logs`("id", "exam_id", "student_id", "event_type", "timestamp") SELECT "id", "exam_id", "student_id", "event_type", "timestamp" FROM `proctor_logs`;--> statement-breakpoint
DROP TABLE `proctor_logs`;--> statement-breakpoint
ALTER TABLE `__new_proctor_logs` RENAME TO `proctor_logs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_students` (
	`id` text PRIMARY KEY NOT NULL,
	`class_id` text,
	`name` text NOT NULL,
	`email` text,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_students`("id", "class_id", "name", "email") SELECT "id", "class_id", "name", "email" FROM `students`;--> statement-breakpoint
DROP TABLE `students`;--> statement-breakpoint
ALTER TABLE `__new_students` RENAME TO `students`;--> statement-breakpoint
CREATE UNIQUE INDEX `students_email_unique` ON `students` (`email`);--> statement-breakpoint
ALTER TABLE `classes` ADD `description` text;--> statement-breakpoint
ALTER TABLE `classes` DROP COLUMN `created_at`;