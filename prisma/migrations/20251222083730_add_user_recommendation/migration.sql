/*
  Warnings:

  - The values [LIKE,SHARE] on the enum `UserInteraction_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `userinteraction` MODIFY `type` ENUM('VIEW', 'ADD_TO_CART', 'PURCHASE', 'READ_MORE') NOT NULL;

-- CreateTable
CREATE TABLE `UserRecommendation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `productId` INTEGER NOT NULL,
    `score` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `UserRecommendation_userId_score_idx`(`userId`, `score`),
    UNIQUE INDEX `UserRecommendation_userId_productId_key`(`userId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserRecommendation` ADD CONSTRAINT `UserRecommendation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRecommendation` ADD CONSTRAINT `UserRecommendation_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
