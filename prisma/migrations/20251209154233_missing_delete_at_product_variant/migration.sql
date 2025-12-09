/*
  Warnings:

  - You are about to drop the column `deltetedAt` on the `productvariant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `orderitem` ADD COLUMN `codes` TEXT NULL;

-- AlterTable
ALTER TABLE `productvariant` DROP COLUMN `deltetedAt`,
    ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `refreshtoken` MODIFY `token` TEXT NOT NULL;
