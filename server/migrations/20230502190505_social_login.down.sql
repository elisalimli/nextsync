ALTER TABLE
    "public"."users" DROP COLUMN IF EXISTS "social_login",
    DROP COLUMN IF EXISTS "social_provider";

DROP TYPE IF EXISTS "public"."SocialProvider";