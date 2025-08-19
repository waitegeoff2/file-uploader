/*
  Warnings:

  - Added the required column `filepath` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filetype` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."File" ADD COLUMN     "filepath" TEXT NOT NULL,
ADD COLUMN     "filetype" TEXT NOT NULL;
