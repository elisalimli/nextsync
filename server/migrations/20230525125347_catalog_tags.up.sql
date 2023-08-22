CREATE TABLE catalogs (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name TEXT,
    code TEXT NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE tags (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "catalog_id" uuid NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("catalog_id") REFERENCES catalogs ("id")
);

CREATE TABLE post_tags (
    "post_id" uuid NOT NULL,
    "tag_id" uuid NOT NULL,
    PRIMARY KEY ("post_id", "tag_id"),
    FOREIGN KEY ("post_id") REFERENCES "public"."posts" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
    FOREIGN KEY ("tag_id") REFERENCES tags ("id")
);