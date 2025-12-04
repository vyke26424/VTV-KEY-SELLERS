/*
  Warnings:

  - A unique constraint covering the columns `[tokenId]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tokenId` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `RefreshToken_token_key` ON `refreshtoken`;

-- AlterTable
ALTER TABLE `refreshtoken` ADD COLUMN `tokenId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `RefreshToken_tokenId_key` ON `RefreshToken`(`tokenId`);
