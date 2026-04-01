PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE d1_migrations(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE `classes` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`role` text NOT NULL,
	`subjects` text DEFAULT '[]',
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
, `class_ids` text DEFAULT '[]');
CREATE TABLE `subjects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
CREATE TABLE `topics` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`grade` integer NOT NULL,
	`subject_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `exams` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`creator_id` text,
	`is_public` integer DEFAULT false NOT NULL,
	`subject_id` text,
	`topic_id` text,
	`parent_id` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL, `grade` integer DEFAULT -1 NOT NULL,
	FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE no action
);
CREATE TABLE `exam_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`exam_id` text NOT NULL,
	`class_id` text NOT NULL,
	`description` text NOT NULL,
	`start_time` integer NOT NULL,
	`end_time` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL, `creator_id` text NOT NULL REFERENCES users(id),
	FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE no action
);
CREATE TABLE `questions` (
	`id` text PRIMARY KEY NOT NULL,
	`exam_id` text NOT NULL,
	`question` text NOT NULL,
	`answers` text NOT NULL,
	`correct_index` integer NOT NULL,
	`variation` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL, `attachment_key` text,
	FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE IF NOT EXISTS "students" (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`class_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `proctor_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text,
	`student_id` text,
	`event_type` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `exam_sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
CREATE TABLE `student_answers` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text,
	`session_id` text,
	`exam_id` text,
	`question_id` text,
	`answer_index` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`session_id`) REFERENCES `exam_sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
CREATE TABLE `student_session_status` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`student_id` text NOT NULL,
	`is_started` integer DEFAULT false NOT NULL,
	`is_finished` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `exam_sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(1,'0000_low_randall.sql','2026-03-28 16:18:12');
INSERT INTO "classes" ("id","name","created_at","updated_at") VALUES('091b6891-9667-40e3-a2a9-372c116dfc38','Borgotsoinuud',1774960960192,1774960960192);
INSERT INTO "classes" ("id","name","created_at","updated_at") VALUES('a448b8a3-2d11-4056-8bcd-f58876d532e1','12A',1774970034960,1774970034960);
INSERT INTO "users" ("id","name","last_name","email","username","password","role","subjects","created_at","updated_at","class_ids") VALUES('4d138b16-4ac9-48b2-bcba-f200a871e056','Ariuntuguldur','Khurelbaatar','ariuntuguldur3@gmail.com','akhurelbaatar604','zWm8Sk4a','manager','[]',1774792119000,1774792119000,'[]');
INSERT INTO "users" ("id","name","last_name","email","username","password","role","subjects","created_at","updated_at","class_ids") VALUES('cdf7bd9b-969a-4434-859f-46e6f607a57e','Bulgaa','Buuk','bulgantuyadorjpalam@gmail.com','pinequest262279781','9781','manager','[]',1774793084000,1774793084000,'[]');
INSERT INTO "users" ("id","name","last_name","email","username","password","role","subjects","created_at","updated_at","class_ids") VALUES('b7aaeac6-5404-4cda-a06a-d1b317cd54fb','Temuujin','Dambadarjaa','ttemuujin.124@gmail.com','pinequest262275862','5862','teacher','["pe"]',1774793552000,1774793552000,'[]');
INSERT INTO "users" ("id","name","last_name","email","username","password","role","subjects","created_at","updated_at","class_ids") VALUES('864a45d2-3735-4b5d-9be3-6f5eab5e3ce5','urantogos👩‍💻','_uka','ourantogos65@gmail.com','uka123','1880','manager','[]',1774797733000,1774797733000,'[]');
INSERT INTO "users" ("id","name","last_name","email","username","password","role","subjects","created_at","updated_at","class_ids") VALUES('4fa05222-1696-4d25-b9c9-1f0e981f4ff1','Munkhtuya','Munkhbaatar','m.munkhtuya@erdmiinsan.edu.mn','pinequest262275626','5626','teacher','["english"]',1774969246000,1774969246000,'[]');
INSERT INTO "subjects" ("id","name","created_at","updated_at") VALUES('28393977-60a4-4807-a1c9-d1a175104c5c','English',1774961362000,1774961362000);
INSERT INTO "topics" ("id","name","grade","subject_id","created_at","updated_at") VALUES('b4b70e69-0bf5-49f9-bbdd-cc67530ef978','Others',0,'28393977-60a4-4807-a1c9-d1a175104c5c',1774961362000,1774961362000);
INSERT INTO "exams" ("id","name","creator_id","is_public","subject_id","topic_id","parent_id","created_at","updated_at","grade") VALUES('75529510-cccd-4c92-af62-82408b087019','Muugii bagshiin test','4d138b16-4ac9-48b2-bcba-f200a871e056',1,'28393977-60a4-4807-a1c9-d1a175104c5c','b4b70e69-0bf5-49f9-bbdd-cc67530ef978',NULL,1774961464000,1774971920054,-1);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('14e469ab-42cd-47b0-8ddb-361ce9fe33a6','75529510-cccd-4c92-af62-82408b087019','The nurse brought her round _________ after the surgery.','["more gently","gentle","gentler","gently","more gentle"]',3,'A',1774961464000,1774971920782,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('f52af112-9197-4aa0-b286-2027afc05e79','75529510-cccd-4c92-af62-82408b087019','James _________ up early in the morning then he _________ cold water every day','["get/drinks","get/drink","got/drank","gets/drinks","gets/drank"]',3,'A',1774961464000,1774971921497,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('98e6aee9-02e2-4e96-9e04-f14f2c8b4768','75529510-cccd-4c92-af62-82408b087019','The police discovered vital evidence _________ led to arrest of the thief.','["which","where","when","that","who"]',0,'A',1774961464000,1774971922211,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('960d067e-a029-4b65-9fa6-1dcca14d59ef','75529510-cccd-4c92-af62-82408b087019','My baby ________ by a loud noise in the room last night.','["had woken","were woken","woken","have woken","was woken"]',4,'A',1774961464000,1774971922930,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('be4f507c-f2fc-479e-ba2e-9bdb851de287','75529510-cccd-4c92-af62-82408b087019','I am so grateful to the person _______ saved my life.','["which","whom","whose","who","what"]',3,'A',1774961464000,1774971923564,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('2a6c731e-62d1-4f75-8709-098deaf49b96','75529510-cccd-4c92-af62-82408b087019','Your friends live far from you. You would like them to live nearer to you. You say: I wish my friends _____________________nearer to me.','["would live","was living","had lived","lived","have lived"]',3,'A',1774961464000,1774971924360,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('c856e02a-34af-436e-81e1-cb1b8e9a2cff','75529510-cccd-4c92-af62-82408b087019','During her stay in Mongolia, Susan tried almost all the local foods her friends ______.','["had recommended","would recommend","have recommended","were recommending","are recommending"]',0,'A',1774961464000,1774971925080,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('ae5fde61-dabd-4123-bbf7-37140e6a0cfe','75529510-cccd-4c92-af62-82408b087019','Direct speech: “You play the guitar very well, Chimgee,” the teacher said. Reported speech: The teacher told Chimgee (that) _______________________.','["she is playing the guitar very well","she plays the guitar very well","you played the guitar very well","she played the guitar very well","you play the guitar very well"]',1,'A',1774961464000,1774971925895,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('1181e0c9-27e7-403d-85d7-0ed345dd769b','75529510-cccd-4c92-af62-82408b087019','My brother is _______ at swimming than I am..','["the better","good","well","much better","the best"]',3,'A',1774961464000,1774971926613,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('50122ba3-ad69-4a4f-bf01-f2db1cb14def','75529510-cccd-4c92-af62-82408b087019','The boys ________________________by the police on their way home.','["have stopped","stopped","were stopped","was stopped","had stopped"]',2,'A',1774961464000,1774971927434,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('bd1f411f-11a1-4ad9-904b-b598f65ece5f','75529510-cccd-4c92-af62-82408b087019','Yesterday Lisa went to the hairdresser’s. She_________________________ .','["had her hair cut","is cutting her hair","cut her hair","was cutting her hair","cuts her hair"]',0,'A',1774961464000,1774971928153,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('1b85c793-8023-4fc2-91a1-1b3531260fd9','75529510-cccd-4c92-af62-82408b087019','Chimgee earns two times ______________ much ______________ I do.','["both/and","as/if","like/as","as/as","alike/as"]',3,'A',1774961465000,1774971928865,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('63bddfa9-9ba8-4c69-8020-586d6e92b71d','75529510-cccd-4c92-af62-82408b087019','I took a vest with me ___________________________I wouldn’t get cold.','["in order to","so that","to","so as","as if"]',1,'A',1774961465000,1774971929590,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('48315679-8e3f-4fef-ba71-713f554a0140','75529510-cccd-4c92-af62-82408b087019','The buildings are often destroyed by _________ after violent movement of the ground.','["forest fire","flood","snowstorm","earthquake","hurricane"]',3,'A',1774961465000,1774971930296,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('6423ccdc-025d-4ad4-a386-670f49c135b3','75529510-cccd-4c92-af62-82408b087019','The more he looked at her, _______________________________embarrassed she was.','["more","the most","the more","mostly","much"]',2,'A',1774961465000,1774971930915,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('e0ff42e1-ed65-4647-8a89-ed2867d93fd2','75529510-cccd-4c92-af62-82408b087019','John is ____________________________and needs help when asked to sign papers.','["literate","illiterate","literacy","illiteracy","literally"]',1,'A',1774961465000,1774971931633,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('1f735db3-a7f3-443c-8660-0275b19c5a78','75529510-cccd-4c92-af62-82408b087019','When you go to the town, could you please buy a ____________ of jam for me?','["bar","can","bag","jar","carton"]',3,'A',1774961465000,1774971932348,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('9e00c96e-36b6-4807-9280-0a47c1752e21','75529510-cccd-4c92-af62-82408b087019','My boss __________this language course to me.','["recommended","persuaded","influenced","criticized","maintained"]',0,'A',1774961465000,1774971933065,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('91cf4fda-15de-434a-bc9b-0ca4c08a17d0','75529510-cccd-4c92-af62-82408b087019','Teaching English in a lively interesting way increases students’ ___________to learn.','["volunteering","tolerance","diversity","motivation","automation"]',3,'A',1774961465000,1774971933778,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('c6c742c9-9528-44df-90a5-ee3c5ea2c61f','75529510-cccd-4c92-af62-82408b087019','The forecast is for dry, sunny weather with no _____________________expected.','["degradation","desertification","precipitation","protection","permission"]',2,'A',1774961465000,1774971934497,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('4484eea6-1ef7-43eb-a4f4-ded6723e9979','75529510-cccd-4c92-af62-82408b087019','My ______________is that you’re not getting enough work done.','["concentration","concern","occupation","action","attachment"]',1,'A',1774961465000,1774971935113,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('f7ab4eab-1425-4e0a-8849-f7ea386710d9','75529510-cccd-4c92-af62-82408b087019','The two countries have ____________close ties for centuries.','["confused","distracted","debated","maintained","ignored"]',3,'A',1774961465000,1774971935825,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('01ed8e3c-108d-44b2-9335-f9cb7165e239','75529510-cccd-4c92-af62-82408b087019','Ken: Do you fancy eating some pieces of pizza? Bob:  ________.','["I’d love to go to the cinema","I’d rather have some pasta","Oh, I do apologize","Yes, pleased to see you.","That’s awful"]',1,'A',1774961465000,1774971936447,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('c993c452-8791-41f7-a1b5-5ab31eb83974','75529510-cccd-4c92-af62-82408b087019','Ken: Thank you very much for watering my plants. Bob: ________.','["Pretty good","It’s excellent","Don’t mention it","Congratulations","No, not at all"]',2,'A',1774961465000,1774971937088,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('af8ea22b-0118-48af-a38a-03a6d3308303','75529510-cccd-4c92-af62-82408b087019','Someone asked ________? You said “There’s something wrong with this computer”.','["How do you find the CD player","Would you like to do this evening.","Do you agree this computer is expensive","Can you tell me how to get to the shop","What is the problem exactly"]',4,'A',1774961465000,1774971937697,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('c8f396fd-0ffe-4d16-93ce-d0c1fa41e73f','75529510-cccd-4c92-af62-82408b087019','She is very sensible. She’d never do anything stupid. In other words, she’s very practical and down-to-earth.   What is informed of the sentence?','["Intellectual ability","Height","Weight","Personality","Relationships"]',3,'A',1774961465000,1774971938497,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('212b88ac-237a-4077-8e19-753511848c87','75529510-cccd-4c92-af62-82408b087019','Woman: It’s dark in the front hall. Man: The bulb’s burned out. What does the woman imply?','["The ball is in the front hall.","She can smell something burning.","She turned the light off.","The light doesn’t work.","The woman has to light a candle."]',3,'A',1774961465000,1774971939208,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('f532523d-1fcd-4c5f-a4e9-81b654e30fe8','75529510-cccd-4c92-af62-82408b087019','What is true about the seminar?','["It is mainly for sales staff.","It is held biannually.","It is held annually.","It will be held off-site.","It is a three day event."]',3,'A',1774961465000,1774971940033,'exams/75529510-cccd-4c92-af62-82408b087019/6ef59f5e-2591-493a-9971-8e0f2e2ec29c.png');
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('fb9068e5-abdf-49f4-adc3-85170d8d732c','75529510-cccd-4c92-af62-82408b087019','The word “overseeing” in paragraph 3, line 1, is closest in meaning to.','["supervising","excusing","neglecting","recording","rejecting"]',0,'A',1774961465000,1774971940637,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('e8a82142-07b6-403f-b18c-ec198ffb1015','75529510-cccd-4c92-af62-82408b087019','Where is Wholefoods’ main factory?','["In Hamiltons","In Auckland","In Henderson","In Cambridge","In Convention"]',2,'A',1774961465000,1774971941358,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('a60b20f3-1acd-492b-95bf-47ab71b6d06a','75529510-cccd-4c92-af62-82408b087019','Sarah: Would you like to go for a walk? Tom: ________.','["I''d prefer to stay home and read.","Yes, I love walking.","I''m busy right now.","That sounds like a great idea!","I''m not feeling well."]',0,'B',1774970252000,1774970252000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('abe47167-9975-422d-ba26-5921f8c71cb2','75529510-cccd-4c92-af62-82408b087019','She sings _______ than her sister.','["worse","bad","badly","the worst","much bad"]',0,'B',1774970253000,1774970253000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('2dde039a-c19a-461d-9409-1d52a257e861','75529510-cccd-4c92-af62-82408b087019','He drives _________ on busy roads.','["carefully","careful","more careful","carefuller","most careful"]',0,'B',1774970253000,1774970253000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('37582f03-264e-4cc4-8fbc-f22282e2ad9d','75529510-cccd-4c92-af62-82408b087019','This new car costs three times _______ _______ that old model.','["as/as","both/and","like/as","as/if","alike/as"]',0,'B',1774970253000,1774970253000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('f2e8e044-7b9b-4a16-b7e3-136312d189b9','75529510-cccd-4c92-af62-82408b087019','Could you get me a _________ of milk from the shop?','["carton","bar","can","jar","bag"]',0,'B',1774970254000,1774970254000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('bb9c4671-6f45-46ca-a157-96a10c7134ae','75529510-cccd-4c92-af62-82408b087019','Student: I can''t find my textbook. Teacher: Did you check your locker? What does the teacher imply?','["The student might have left the textbook in the locker.","The teacher knows where the textbook is.","The student should buy a new textbook.","The locker is broken.","The student should ask a friend."]',0,'B',1774970254000,1774970254000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('d9b4f88b-4b05-4e6f-91fe-8b93899e2327','75529510-cccd-4c92-af62-82408b087019','You don''t have a car. You say: I wish I _________ a car.','["had","have","would have","was having","had had"]',0,'B',1774970254000,1774970254000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('20ec00ae-2e81-489d-8cb2-df1a0dd7dbce','75529510-cccd-4c92-af62-82408b087019','The main _________ of the meeting was the new budget.','["focus","distraction","hesitation","excitement","annoyance"]',0,'B',1774970254000,1774970254000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('c74de450-2086-4441-a2e5-4ae4d6820f04','75529510-cccd-4c92-af62-82408b087019','Many coastal towns were devastated by the _________ that followed the underwater earthquake.','["tsunami","volcano","blizzard","drought","landslide"]',0,'B',1774970255000,1774970255000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('f54d7c05-235b-4d44-bec7-7ed0be72ec0d','75529510-cccd-4c92-af62-82408b087019','The new bridge _________ last year.','["was built","built","has built","is built","had built"]',0,'B',1774970255000,1774970255000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('fd7b6af0-e221-4c25-a749-928478164572','75529510-cccd-4c92-af62-82408b087019','She studied hard _________ she could pass the exam.','["so that","in order to","to","so as","as if"]',0,'B',1774970255000,1774970255000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('d71eec30-3712-454e-b68d-9eace5612e5d','75529510-cccd-4c92-af62-82408b087019','The harder you work, _________ _________ you achieve.','["the more","more","most","the most","much"]',0,'B',1774970255000,1774970255000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('08d00928-2894-41b4-bac9-e7bb6d281b34','75529510-cccd-4c92-af62-82408b087019','Lack of clear goals can reduce employee _________.','["motivation","confusion","tolerance","diversity","automation"]',0,'B',1774970256000,1774970256000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('686cc3cd-b3d2-4823-9a8f-2f90b0a52c3b','75529510-cccd-4c92-af62-82408b087019','The ancient city _________ by archaeologists last century.','["was discovered","had discovered","discovered","were discovered","have discovered"]',0,'B',1774970256000,1774970256000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('bf11cd8e-9fa5-432b-bac2-e8b3c0e31164','75529510-cccd-4c92-af62-82408b087019','I read a book _________ was written by a famous author.','["which","who","where","when","whom"]',0,'B',1774970256000,1774970256000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('2f6f17d3-219e-4b78-980d-286c427fa6a5','75529510-cccd-4c92-af62-82408b087019','The doctor _________ that I get more rest.','["advised","persuaded","influenced","criticized","maintained"]',0,'B',1774970256000,1774970256000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('6c535420-2250-4f4b-9e51-ec13c1186bb9','75529510-cccd-4c92-af62-82408b087019','Direct speech: ''I am going to the park,'' said John. Reported speech: John said (that) _________.','["he was going to the park","I am going to the park","he is going to the park","I was going to the park","he goes to the park"]',0,'B',1774970257000,1774970257000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('5d031cd0-69e9-47f6-a210-62cbc767de1b','75529510-cccd-4c92-af62-82408b087019','Someone asked ________? You said ''It''s about 5 kilometers from here''.','["How far is it?","What time is it?","Who is it?","Where are you going?","How are you?"]',0,'B',1774970257000,1774970257000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('e263200c-75b3-4551-bbc9-c4aae2c844b1','75529510-cccd-4c92-af62-82408b087019','I need to _________ my car _________.','["have/repaired","cut/hair","am/cutting","was/cutting","cuts/hair"]',0,'B',1774970257000,1774970257000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('ee00a9db-526a-4ac9-8acb-8afb564b82f4','75529510-cccd-4c92-af62-82408b087019','The woman _______ lives next door is a doctor.','["who","which","whom","whose","what"]',0,'B',1774970257000,1774970257000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('58b75378-7752-43bb-b8ab-36c3b22c3cef','75529510-cccd-4c92-af62-82408b087019','The sudden drop in temperature caused a heavy _________.','["snowfall","drought","hurricane","earthquake","desertification"]',0,'B',1774970258000,1774970258000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('b8f1c8b7-cdf0-4584-a083-4d24bec8ca80','75529510-cccd-4c92-af62-82408b087019','By the time I arrived, they _________ dinner.','["had finished","would finish","have finished","were finishing","are finishing"]',0,'B',1774970258000,1774970258000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('a86d77d1-9c74-4c80-a952-49f7bfb6054e','75529510-cccd-4c92-af62-82408b087019','He always helps others and is kind to everyone. What does this sentence describe about him?','["Personality","Intellectual ability","Height","Weight","Relationships"]',0,'B',1774970258000,1774970258000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('df8a55d3-01a9-4795-bc0f-d5cd275a5236','75529510-cccd-4c92-af62-82408b087019','A: I really appreciate your help. B: ________.','["You''re welcome.","Pretty good.","It''s excellent.","Congratulations.","No, not at all."]',0,'B',1774970259000,1774970259000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('4d3cb2d6-67e0-4735-b16a-2c027e3a60e8','75529510-cccd-4c92-af62-82408b087019','She is very _________ and can speak five languages.','["multilingual","illiterate","literacy","illiteracy","literally"]',0,'B',1774970259000,1774970259000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('d7c70656-d051-4238-abcd-f8c1cf026df8','75529510-cccd-4c92-af62-82408b087019','According to the brochure, what is the opening time of the new museum?','["9 AM to 5 PM","In the city center","Every Tuesday","Free admission","For all ages"]',0,'B',1774970259000,1774970259000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('b430b8d8-172d-4d14-98ae-22dfcf7812e8','75529510-cccd-4c92-af62-82408b087019','My sister usually _________ to work and _________ coffee before she starts.','["walks/drinks","walk/drink","walked/drank","gets/drank","get/drinks"]',0,'B',1774970259000,1774970259000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('ee1f7267-5675-4a91-a1d4-a863138eeba1','75529510-cccd-4c92-af62-82408b087019','Based on the announcement, how long will the workshop last?','["Two days","It is for beginners.","It will be held online.","It starts next month.","The fee is $50."]',0,'B',1774970260000,1774970260000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('bfb24060-1797-4c93-bd90-115aedd6243b','75529510-cccd-4c92-af62-82408b087019','The company aims to _________ customer satisfaction.','["maintain","confuse","distract","debate","ignore"]',0,'B',1774970260000,1774970260000,NULL);
INSERT INTO "questions" ("id","exam_id","question","answers","correct_index","variation","created_at","updated_at","attachment_key") VALUES('4af607be-d35f-4933-9357-23ef9b8da6a1','75529510-cccd-4c92-af62-82408b087019','The word ''crucial'' in the text is closest in meaning to.','["vital","minor","unimportant","optional","secondary"]',0,'B',1774970260000,1774970260000,NULL);
INSERT INTO "students" ("id","name","email","phone","class_id","created_at","updated_at") VALUES('2abcaa0d-3d5b-491a-8700-b45a7806e2a9','Temuujin','ttemuujin.1224@gmail.com','99119911','091b6891-9667-40e3-a2a9-372c116dfc38',1774961065000,1774961065000);
INSERT INTO "students" ("id","name","email","phone","class_id","created_at","updated_at") VALUES('fb910712-db0d-4642-85dc-38c88257cf84','Urantogos','ourantogos65@gmail.com','12345678','091b6891-9667-40e3-a2a9-372c116dfc38',1774961153000,1774961153000);
INSERT INTO "students" ("id","name","email","phone","class_id","created_at","updated_at") VALUES('060acc2b-32e8-4679-9753-1b192f8aedbd','Ariuntuguldur','ariuntuguldur20@gmail.com','85798080','091b6891-9667-40e3-a2a9-372c116dfc38',1774961175000,1774961175000);
INSERT INTO "students" ("id","name","email","phone","class_id","created_at","updated_at") VALUES('d626df0d-bbc7-4288-9fc5-557e4b03992f','Bulgaa','bulgantuyadorjpalam@','87654321','091b6891-9667-40e3-a2a9-372c116dfc38',1774961207000,1774961207000);
INSERT INTO "students" ("id","name","email","phone","class_id","created_at","updated_at") VALUES('ad5674e7-5e90-4e1f-a923-17f1ba4d25dd','Deegii','ddegii953yahoo@gmail.com','89121123','091b6891-9667-40e3-a2a9-372c116dfc38',1774961281000,1774961281000);
INSERT INTO "students" ("id","name","email","phone","class_id","created_at","updated_at") VALUES('5e459819-b686-4833-953f-76f55e50e609','Nomin-Erdene','nmin.rdn777@gmail.com','12345679','a448b8a3-2d11-4056-8bcd-f58876d532e1',1774970161000,1774970161000);
INSERT INTO "students" ("id","name","email","phone","class_id","created_at","updated_at") VALUES('2a8bbdba-c251-46f3-93b0-0ebd99db3296','Bold-Erdene','khuyagboldoo@gmail.com','12345610','a448b8a3-2d11-4056-8bcd-f58876d532e1',1774970181000,1774970181000);
INSERT INTO "students" ("id","name","email","phone","class_id","created_at","updated_at") VALUES('e059bdc3-b902-4ac9-9a1d-3351cec8b5e7','Temuulen','b.temuulen1213@gmail.com','12345611','a448b8a3-2d11-4056-8bcd-f58876d532e1',1774970229000,1774970229000);
INSERT INTO "exam_sessions" ("id","exam_id","class_id","description","start_time","end_time","created_at","updated_at","creator_id") VALUES('9690fa19-57c1-4f81-a7e9-0ae0c47f1eb8','75529510-cccd-4c92-af62-82408b087019','091b6891-9667-40e3-a2a9-372c116dfc38','2026-оны анги дэвших шалгалт',1774961520000,1774965120000,1774961489000,1774961489000,'4d138b16-4ac9-48b2-bcba-f200a871e056');
INSERT INTO "exam_sessions" ("id","exam_id","class_id","description","start_time","end_time","created_at","updated_at","creator_id") VALUES('b8d2b131-1023-4fff-b1ae-ac72908935a8','75529510-cccd-4c92-af62-82408b087019','091b6891-9667-40e3-a2a9-372c116dfc38','Progress test',1775028600,1775031000,1774970190000,1774970190000,'4fa05222-1696-4d25-b9c9-1f0e981f4ff1');
INSERT INTO "exam_sessions" ("id","exam_id","class_id","description","start_time","end_time","created_at","updated_at","creator_id") VALUES('4bd60de0-ddef-405b-b940-78522885bed2','75529510-cccd-4c92-af62-82408b087019','091b6891-9667-40e3-a2a9-372c116dfc38','PROGRESS TEST',1775028600,1775032200,1774971348000,1774971348000,'4fa05222-1696-4d25-b9c9-1f0e981f4ff1');
INSERT INTO "student_session_status" ("id","session_id","student_id","is_started","is_finished","created_at","updated_at") VALUES('cdc5bbed-fdbc-498a-861a-5aceadb5bf66','9690fa19-57c1-4f81-a7e9-0ae0c47f1eb8','2abcaa0d-3d5b-491a-8700-b45a7806e2a9',1,0,1774961490000,1774961512501);
INSERT INTO "student_session_status" ("id","session_id","student_id","is_started","is_finished","created_at","updated_at") VALUES('edb65fbb-a312-42f8-b428-92ba250a5118','9690fa19-57c1-4f81-a7e9-0ae0c47f1eb8','fb910712-db0d-4642-85dc-38c88257cf84',1,1,1774961490000,1774966887046);
INSERT INTO "student_session_status" ("id","session_id","student_id","is_started","is_finished","created_at","updated_at") VALUES('997f191c-8227-4cc9-92cd-fb422855267f','9690fa19-57c1-4f81-a7e9-0ae0c47f1eb8','060acc2b-32e8-4679-9753-1b192f8aedbd',1,0,1774961490000,1774962036707);
INSERT INTO "student_session_status" ("id","session_id","student_id","is_started","is_finished","created_at","updated_at") VALUES('e2cee048-881d-480c-8c0d-af059c3e2d01','9690fa19-57c1-4f81-a7e9-0ae0c47f1eb8','d626df0d-bbc7-4288-9fc5-557e4b03992f',0,0,1774961490000,1774961490000);
INSERT INTO "student_session_status" ("id","session_id","student_id","is_started","is_finished","created_at","updated_at") VALUES('d8300f2f-f5f2-4873-9d2e-f739d7592236','9690fa19-57c1-4f81-a7e9-0ae0c47f1eb8','ad5674e7-5e90-4e1f-a923-17f1ba4d25dd',1,0,1774961490000,1774961545100);
INSERT INTO "student_session_status" ("id","session_id","student_id","is_started","is_finished","created_at","updated_at") VALUES('f1c8ce0c-0525-4cb1-8d7e-6eaa76fdb7fc','b8d2b131-1023-4fff-b1ae-ac72908935a8','2abcaa0d-3d5b-491a-8700-b45a7806e2a9',0,0,1774970191000,1774970191000);
INSERT INTO "student_session_status" ("id","session_id","student_id","is_started","is_finished","created_at","updated_at") VALUES('baa88847-7c6b-4ac0-8e6b-fced7b40b8c6','b8d2b131-1023-4fff-b1ae-ac72908935a8','fb910712-db0d-4642-85dc-38c88257cf84',0,0,1774970191000,1774970191000);
INSERT INTO "student_session_status" ("id","session_id","student_id","is_started","is_finished","created_at","updated_at") VALUES('ef78c7d4-d6e3-4319-9727-c98c5e9044a6','b8d2b131-1023-4fff-b1ae-ac72908935a8','060acc2b-32e8-4679-9753-1b192f8aedbd',0,0,1774970191000,1774970191000);
INSERT INTO "student_session_status" ("id","session_id","student_id","is_started","is_finished","created_at","updated_at") VALUES('efae16b6-df28-4b09-90ff-02cb89d8aeb5','b8d2b131-1023-4fff-b1ae-ac72908935a8','d626df0d-bbc7-4288-9fc5-557e4b03992f',0,0,1774970191000,1774970191000);
INSERT INTO "student_session_status" ("id","session_id","student_id","is_started","is_finished","created_at","updated_at") VALUES('c2f87230-f958-45e2-a098-eb386663ec15','b8d2b131-1023-4fff-b1ae-ac72908935a8','ad5674e7-5e90-4e1f-a923-17f1ba4d25dd',0,0,1774970191000,1774970191000);
INSERT INTO "student_session_status" ("id","session_id","student_id","is_started","is_finished","created_at","updated_at") VALUES('a681b214-dde2-46e7-943f-992103b3fceb','4bd60de0-ddef-405b-b940-78522885bed2','2abcaa0d-3d5b-491a-8700-b45a7806e2a9',0,0,1774971348000,1774971348000);
INSERT INTO "student_session_status" ("id","session_id","student_id","is_started","is_finished","created_at","updated_at") VALUES('66847f9c-a3a9-4bad-9587-a5d3b81abd69','4bd60de0-ddef-405b-b940-78522885bed2','fb910712-db0d-4642-85dc-38c88257cf84',0,0,1774971348000,1774971348000);
INSERT INTO "student_session_status" ("id","session_id","student_id","is_started","is_finished","created_at","updated_at") VALUES('005646d9-3fbc-427f-b99e-4cd6dd0730bb','4bd60de0-ddef-405b-b940-78522885bed2','060acc2b-32e8-4679-9753-1b192f8aedbd',0,0,1774971348000,1774971348000);
INSERT INTO "student_session_status" ("id","session_id","student_id","is_started","is_finished","created_at","updated_at") VALUES('019b2225-45f5-405a-8474-341edd1bd253','4bd60de0-ddef-405b-b940-78522885bed2','d626df0d-bbc7-4288-9fc5-557e4b03992f',0,0,1774971348000,1774971348000);
INSERT INTO "student_session_status" ("id","session_id","student_id","is_started","is_finished","created_at","updated_at") VALUES('a231541b-99e9-4ce9-b596-8ccf681bc1c9','4bd60de0-ddef-405b-b940-78522885bed2','ad5674e7-5e90-4e1f-a923-17f1ba4d25dd',0,0,1774971348000,1774971348000);
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('d1_migrations',1);
CREATE UNIQUE INDEX `subjects_name_unique` ON `subjects` (`name`);
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);
CREATE UNIQUE INDEX `students_email_unique` ON `students` (`email`);
CREATE UNIQUE INDEX `students_phone_unique` ON `students` (`phone`);
