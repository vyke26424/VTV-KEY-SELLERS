-- CreateTable
CREATE TABLE `SystemConfig` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maintenanceMode` BOOLEAN NOT NULL DEFAULT false,
    `emailNotification` BOOLEAN NOT NULL DEFAULT true,
    `bankInfo` TEXT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
