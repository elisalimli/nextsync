DROP TEXT SEARCH CONFIGURATION IF EXISTS turkish;

DROP EXTENSION IF EXISTS unaccent;

drop index idx_search;

ALTER TABLE
    posts DROP search;

DROP FUNCTION if EXISTS custom_to_tsvector;