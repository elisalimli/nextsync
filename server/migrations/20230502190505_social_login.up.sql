CREATE TYPE "SocialProvider" AS ENUM ('Traditional', 'Google');

ALTER TABLE
    "public"."users"
ADD
    COLUMN "social_login" boolean NULL DEFAULT false,
ADD
    COLUMN "social_provider" "SocialProvider" NOT NULL DEFAULT 'Traditional';