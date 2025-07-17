/*
  Warnings:

  - Added the required column `strategiesCount` to the `Stats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stats" ADD COLUMN     "strategiesCount" INTEGER NOT NULL;
