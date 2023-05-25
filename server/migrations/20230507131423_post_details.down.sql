ALTER TABLE
    public.post_files DROP CONSTRAINT non_negative_file_size;

-- Remove the new columns
ALTER TABLE
    public.posts DROP COLUMN file_size;

ALTER TABLE
    public.post_files DROP COLUMN file_size;