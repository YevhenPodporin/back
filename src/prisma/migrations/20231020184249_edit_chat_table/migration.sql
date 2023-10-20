/*
  Warnings:

  - You are about to drop the column `last_message` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `unread_messages` on the `chats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `chats` DROP COLUMN `last_message`,
    DROP COLUMN `unread_messages`;
