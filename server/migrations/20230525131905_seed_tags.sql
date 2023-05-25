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
                name = 'type'
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
                name = 'type'
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
                name = 'type'
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
                name = 'type'
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
                name = 'type'
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
                name = 'variant'
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
                name = 'variant'
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
                name = 'variant'
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
                name = 'variant'
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
                name = 'variant'
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
                name = 'primary_language'
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
                name = 'primary_language'
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
                name = 'primary_language'
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
                name = 'second_language'
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
                name = 'second_language'
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
                name = 'second_language'
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
                name = 'grade'
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
                name = 'grade'
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
                name = 'grade'
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
                name = 'grade'
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
                name = 'grade'
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
                name = 'grade'
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
                name = 'grade'
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
                name = 'grade'
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
                name = 'grade'
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
                name = 'grade'
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
                name = 'grade'
        )
    );