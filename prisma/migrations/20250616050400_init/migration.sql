/*
  Warnings:

  - Made the column `displayName` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `displayName` VARCHAR(191) NOT NULL;
