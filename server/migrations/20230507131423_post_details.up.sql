-- Define the new columns
ALTER TABLE
    public.posts
ADD
    COLUMN language VARCHAR(50);

-- Add the file_size column
ALTER TABLE
    public.post_files
ADD
    COLUMN file_size BIGINT NOT NULL DEFAULT 0;

ALTER TABLE
    public.posts
ADD
    COLUMN type VARCHAR(50);

ALTER TABLE
    public.posts
ADD
    COLUMN variant CHAR(1);

ALTER TABLE
    public.posts
ADD
    COLUMN second_language CHAR(50);

ALTER TABLE
    public.posts
ADD
    COLUMN grade SMALLINT;

-- Set default values for the new columns
UPDATE
    public.posts
SET
    language = 'ENG';

UPDATE
    public.posts
SET
    second_language = 'ENG';

UPDATE
    public.posts
SET
    grade = '11';

UPDATE
    public.posts
SET
    type = 'BLOK1';

-- Set default values for the new column
UPDATE
    public.post_files
SET
    file_size = 0;

UPDATE
    public.posts
SET
    variant = 'A';

-- Add check constraints to ensure valid values for language and type
ALTER TABLE
    public.posts
ADD
    CONSTRAINT valid_type CHECK (
        type IN ('BURAXILIS', 'BLOK1', 'BLOK2', 'BLOK3', 'BLOK4')
    );

-- Add a check constraint to ensure non-negative values for file_size
ALTER TABLE
    public.post_files
ADD
    CONSTRAINT non_negative_file_size CHECK (file_size >= 0);

-- Add a check constraint to ensure non-negative values for grade
ALTER TABLE
    public.posts
ADD
    CONSTRAINT non_negative_grade CHECK (grade >= 0);