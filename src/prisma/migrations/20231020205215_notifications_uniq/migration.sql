/*
  Warnings:

  - A unique constraint covering the columns `[to_chat_id,to_user_id]` on the table `notifications` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `notifications_to_chat_id_to_user_id_key` ON `notifications`(`to_chat_id`, `to_user_id`);
