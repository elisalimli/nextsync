CREATE TEXT SEARCH CONFIGURATION turkish (COPY = pg_catalog.simple);

CREATE EXTENSION IF NOT EXISTS unaccent;


ALTER TEXT SEARCH CONFIGURATION turkish ALTER MAPPING FOR asciiword,
asciihword,
hword_asciipart,
word,
hword,
hword_part WITH unaccent,
turkish_stem;

CREATE FUNCTION custom_to_tsvector (text)
	RETURNS tsvector
	AS $$
	SELECT
		to_tsvector('turkish', unaccent ($1))
$$
LANGUAGE SQL
IMMUTABLE;

ALTER TABLE
    posts
ADD
    search tsvector GENERATED ALWAYS AS (
        setweight(
            custom_to_tsvector (COALESCE(title, '')),
            'A'
        ) || ' ' || setweight(custom_to_tsvector (COALESCE(description, '')), 'B') || ' ' || setweight(custom_to_tsvector (COALESCE(html_content, '')), 'C') :: tsvector
    ) stored;

CREATE INDEX idx_search ON posts USING GIN (search);