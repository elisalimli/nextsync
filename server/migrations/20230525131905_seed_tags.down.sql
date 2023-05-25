-- Deleting tags
DELETE FROM
    tags
WHERE
    catalog_id IN (
        SELECT
            id
        FROM
            catalogs
        WHERE
            name IN (
                'type',
                'variant',
                'primary_language',
                'second_language',
                'grade'
            )
    );

-- Deleting catalogs
DELETE FROM
    catalogs
WHERE
    name IN (
        'type',
        'variant',
        'primary_language',
        'second_language',
        'grade'
    );

-- Inserting catalogs with code
INSERT INTO
    catalogs (name, code)
VALUES
    ('Variant', 'variant'),
    ('Xarici dil', 'second_language'),
    ('Sinif', 'grade');

-- Inserting catalogs
INSERT INTO
    catalogs (code)
VALUES
    ('type'),
    ('primary_language');