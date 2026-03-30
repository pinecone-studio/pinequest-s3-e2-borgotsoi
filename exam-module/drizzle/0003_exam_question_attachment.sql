-- Optional PDF (or other) attachment stored in R2; key is the object path in the bucket.
ALTER TABLE `questions` ADD `attachment_key` text;
