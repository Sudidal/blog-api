/*
  Warnings:

  - You are about to drop the column `Likes` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "Likes",
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;
