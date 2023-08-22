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