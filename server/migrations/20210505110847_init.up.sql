-- Add new schema named "public"
CREATE SCHEMA IF NOT EXISTS "public";

-- Create "users" table
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create "users" table
CREATE TABLE "public"."users" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "username" character varying(100) NOT NULL,
    "email" character varying(100) NOT NULL,
    "password" character varying(100) NOT NULL,
    "verified" boolean NULL DEFAULT false,
    "phone_number" character varying(15) NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

-- Create index "idx_users_email" to table: "users"
CREATE UNIQUE INDEX "idx_users_email" ON "public"."users" ("email");

-- Create index "idx_users_phone_number" to table: "users"
CREATE UNIQUE INDEX "idx_users_phone_number" ON "public"."users" ("phone_number");

-- Create index "idx_users_username" to table: "users"
CREATE UNIQUE INDEX "idx_users_username" ON "public"."users" ("username");

-- Create "posts" table
CREATE TABLE "public"."posts" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "title" character varying(1000) NOT NULL,
    "description" character varying(65535),
    "user_id" uuid NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id"),
    CONSTRAINT "fk_users_posts" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Create "post_files" table
CREATE TABLE "public"."post_files" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "post_id" uuid NOT NULL,
    "url" text NOT NULL,
    "file_name" text NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "fk_posts_files" FOREIGN KEY ("post_id") REFERENCES "public"."posts" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);