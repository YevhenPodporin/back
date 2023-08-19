/*
  Warnings:

  - You are about to alter the column `date_of_birth` on the `profile` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `profile` MODIFY `date_of_birth` DATETIME(3) NULL;
