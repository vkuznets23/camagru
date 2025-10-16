/*
  Warnings:

  - You are about to drop the column `description` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `ChatParticipant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "description",
DROP COLUMN "image",
DROP COLUMN "name",
DROP COLUMN "type";

-- AlterTable
ALTER TABLE "ChatParticipant" DROP COLUMN "role";

-- DropEnum
DROP TYPE "ChatRole";

-- DropEnum
DROP TYPE "ChatType";
