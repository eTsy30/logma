-- Migration to make watchDate nullable
-- Generated manually

ALTER TABLE "movies" ALTER COLUMN "watch_date" DROP NOT NULL;
