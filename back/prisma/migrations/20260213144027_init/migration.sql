/*
  Warnings:

  - You are about to drop the column `note` on the `movies` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `movies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "movies" DROP COLUMN "note",
DROP COLUMN "rating",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'want_to_watch',
ADD COLUMN     "user_comment" TEXT,
ADD COLUMN     "user_rating" DOUBLE PRECISION NOT NULL DEFAULT 0;
