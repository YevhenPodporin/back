-- AlterTable
ALTER TABLE `users` ADD COLUMN `google_id` INTEGER NULL,
    MODIFY `password` VARCHAR(191) NULL;
