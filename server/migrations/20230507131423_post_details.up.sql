ALTER TABLE
    public.post_files
ADD
    COLUMN file_size BIGINT NOT NULL DEFAULT 0;

-- Set default values for the new column
UPDATE
    public.post_files
SET
    file_size = 0;

-- Add a check constraint to ensure non-negative values for file_size
ALTER TABLE
    public.post_files
ADD
    CONSTRAINT non_negative_file_size CHECK (file_size >= 0);