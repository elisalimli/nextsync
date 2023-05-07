-- Remove the check constraints
ALTER TABLE
    public.posts DROP CONSTRAINT valid_language;

ALTER TABLE
    public.posts DROP CONSTRAINT valid_type;

ALTER TABLE
    public.post_files DROP CONSTRAINT non_negative_file_size;

-- Remove the new columns
ALTER TABLE
    public.posts DROP COLUMN file_size;

ALTER TABLE
    public.posts DROP COLUMN language;

ALTER TABLE
    public.posts DROP COLUMN type;

ALTER TABLE
    public.posts DROP COLUMN variant;

ALTER TABLE
    public.post_files DROP COLUMN file_size;