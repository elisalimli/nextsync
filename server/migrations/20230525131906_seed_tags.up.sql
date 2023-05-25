-- Inserting tags
INSERT INTO
    tags (name, code, catalog_id)
VALUES
    (
        '1-ci qrup',
        'BLOK1',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'type'
        )
    ),
    (
        '2-ci qrup',
        'BLOK2',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'type'
        )
    ),
    (
        '3-cü qrup',
        'BLOK3',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'type'
        )
    ),
    (
        '4-cü qrup',
        'BLOK4',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'type'
        )
    ),
    (
        'Buraxılış',
        'BURAXILIS',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'type'
        )
    ),
    (
        'MIQ',
        'MIQ',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'type'
        )
    ),
    (
        'A',
        'A',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'variant'
        )
    ),
    (
        'B',
        'B',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'variant'
        )
    ),
    (
        'C',
        'C',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'variant'
        )
    ),
    (
        'D',
        'D',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'variant'
        )
    ),
    (
        'E',
        'E',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'variant'
        )
    ),
    (
        'Azərbaycan dili',
        'primary_language_AZE',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'primary_language'
        )
    ),
    (
        'İngilis dili',
        'primary_language_ENG',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'primary_language'
        )
    ),
    (
        'Rus dili',
        'primary_language_RU',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'primary_language'
        )
    ),
    (
        'Azərbaycan',
        'second_language_AZE',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'second_language'
        )
    ),
    (
        'İngilis',
        'second_language_ENG',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'second_language'
        )
    ),
    (
        'Rus',
        'second_language_RU',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'second_language'
        )
    ),
    (
        '11',
        'grade_11',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'grade'
        )
    ),
    (
        '10',
        'grade_10',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'grade'
        )
    ),
    (
        '9',
        'grade_9',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'grade'
        )
    ),
    (
        '8',
        'grade_8',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'grade'
        )
    ),
    (
        '7',
        'grade_7',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'grade'
        )
    ),
    (
        '6',
        'grade_6',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'grade'
        )
    ),
    (
        '5',
        'grade_5',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'grade'
        )
    ),
    (
        '4',
        'grade_4',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'grade'
        )
    ),
    (
        '3',
        'grade_3',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'grade'
        )
    ),
    (
        '2',
        'grade_2',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'grade'
        )
    ),
    (
        '1',
        'grade_1',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'grade'
        )
    );