-- Inserting tags
INSERT INTO
    tags (name, code, catalog_id)
VALUES
    (
        'Xəbər',
        'NEWS',
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
        'I Qrup',
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
        'II Qrup',
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
        'III Qrup',
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
        'IV Qrup',
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
        'Azərbaycan',
        'section_AZE',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'section'
        )
    ),
    (
        'İngilis',
        'section_ENG',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'section'
        )
    ),
    (
        'Rus',
        'section_RU',
        (
            SELECT
                id
            FROM
                catalogs
            WHERE
                code = 'section'
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