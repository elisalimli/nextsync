-- Drop "post_files" table
DROP TABLE IF EXISTS "public"."post_files";

-- Drop "posts" table
DROP TABLE IF EXISTS "public"."posts";

-- Drop "users" table
DROP TABLE IF EXISTS "public"."users";

-- Drop "public" schema
DROP SCHEMA IF EXISTS "public" CASCADE;

INSERT INTO
    "posts" (
        "id",
        "title",
        "description",
        "variant",
        "type",
        "language",
        "second_language",
        "grade",
        "user_id",
        "created_at",
        "updated_at"
    )
VALUES
    (
        DEFAULT,
        'Sınaq ',
        'Tarix sınaq (test)',
        '',
        'UNKNOWN',
        '',
        '',
        0,
        'da10d823-ea9a-4e93-9464-7b75b7d3f959',
        DEFAULT,
        DEFAULT
    ) RETURNING "id",
    "created_at",
    "updated_at"
INSERT INTO
    "post_files" (
        "id",
        "post_id",
        "url",
        "file_size",
        "content_type"
    )
VALUES
    (
        DEFAULT,
        '7c251007-e3fe-42dc-b3f1-ee14ddf5653f',
        'https://azepdfserver.s3.eu-central-1.amazonaws.com/cf7605a8-3e50-4910-a92e-42a0c558056e.pdf',
        231788,
        'application/pdf'
    ) RETURNING "id"