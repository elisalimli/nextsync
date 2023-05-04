ALTER TABLE
    "public"."users" DROP COLUMN IF EXISTS "socialLogin",
    DROP COLUMN IF EXISTS "socialProvider";

DROP TYPE IF EXISTS "public"."SocialProvider";