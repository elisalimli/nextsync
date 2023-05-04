CREATE TYPE "SocialProvider" AS ENUM ('Traditional', 'Google');

ALTER TABLE
    "public"."users"
ADD
    COLUMN "socialLogin" boolean NULL DEFAULT false,
ADD
    COLUMN "socialProvider" "SocialProvider" NOT NULL DEFAULT 'Traditional';