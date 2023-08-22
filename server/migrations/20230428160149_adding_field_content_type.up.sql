ALTER TABLE
    "public"."post_files"
ADD
    COLUMN IF NOT EXISTS content_type varchar NOT NULL;