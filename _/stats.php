<?php

function loadMessageStats(): array
{
    $db = openDatabase(true);
    $db->beginTransaction();

    // The database stores creation times and lifetime view counts per message.
    $summary = $db->query("
        SELECT COUNT(*) AS messages, COALESCE(SUM(opened), 0) AS views,
               COUNT(CASE WHEN datetime(created) >= datetime('now', '-6 months') THEN 1 END) AS recent_messages,
               COALESCE(SUM(CASE WHEN datetime(created) >= datetime('now', '-6 months') THEN opened END), 0) AS recent_views,
               MAX(date(created)) AS latest_date
        FROM Messages
    ")->fetch();

    $months = $db->query("
        SELECT strftime('%Y-%m', created) AS month, COUNT(*) AS messages, SUM(opened) AS views
        FROM Messages
        GROUP BY month HAVING month IS NOT NULL ORDER BY month
    ")->fetchAll(PDO::FETCH_UNIQUE | PDO::FETCH_ASSOC);
    $annual = [];
    foreach ($months as $month => $counts) {
        $year = substr($month, 0, 4);
        $annual[$year]['messages'] = ($annual[$year]['messages'] ?? 0) + $counts['messages'];
        $annual[$year]['views'] = ($annual[$year]['views'] ?? 0) + $counts['views'];
    }

    $hours = array_fill(0, 24, 0);
    $weekdays = array_fill(0, 7, 0);
    foreach ($db->query("
        SELECT strftime('%w', created) AS weekday, strftime('%H', created) AS hour, COUNT(*) AS total
        FROM Messages GROUP BY weekday, hour HAVING weekday IS NOT NULL
    ") as $row) {
        $hours[(int) $row['hour']] += $row['total'];
        $weekdays[(int) $row['weekday']] += $row['total'];
    }

    $languages = [];
    $annualLanguages = [];
    foreach ($db->query("
        SELECT strftime('%Y', created) AS year, COALESCE(NULLIF(TRIM(language), ''), 'unknown') AS lang,
               COUNT(*) AS total
        FROM Messages GROUP BY year, lang ORDER BY year, lang
    ") as $row) {
        $language = $row['lang'];
        $languages[$language] = ($languages[$language] ?? 0) + $row['total'];
        if ($row['year'] !== null) {
            $annualLanguages[$row['year']][$language] = (int) $row['total'];
        }
    }
    ksort($languages);
    $languageOrder = $languages;
    arsort($languageOrder, SORT_NUMERIC);
    foreach ($annualLanguages as &$counts) {
        $counts = array_replace(array_intersect_key($languageOrder, $counts), $counts);
    }
    unset($counts);

    $styles = [];
    $strokes = [];
    foreach ($db->query("
        SELECT style_background, style_color, style_stroke, COUNT(*) AS total
        FROM Messages GROUP BY style_background, style_color, style_stroke
    ") as $row) {
        $background = statsColor($row['style_background'], '#ffffff');
        $color = statsColor($row['style_color'], '#000000');
        $stroke = (int) $row['style_stroke'];
        $stroke = $stroke > 0 && $stroke <= 99 ? $stroke : 2;
        $key = "$background|$color|$stroke";
        $styles[$key] ??= ['background' => $background, 'color' => $color, 'stroke' => $stroke, 'total' => 0];
        $styles[$key]['total'] += $row['total'];
        $strokes[$stroke] = ($strokes[$stroke] ?? 0) + $row['total'];
    }
    ksort($styles);
    uasort($styles, static function ($a, $b) {
        return $b['total'] <=> $a['total'];
    });
    ksort($strokes, SORT_NUMERIC);

    $widths = $db->query("
        SELECT CASE
            WHEN CAST(window_width AS INTEGER) <= 0 OR window_width IS NULL THEN 'unknown'
            WHEN CAST(window_width AS INTEGER) < 640 THEN '<640'
            WHEN CAST(window_width AS INTEGER) < 1024 THEN '640-1023'
            WHEN CAST(window_width AS INTEGER) < 1440 THEN '1024-1439'
            ELSE '>=1440'
        END AS bucket, COUNT(*) AS total
        FROM Messages GROUP BY bucket ORDER BY total DESC, bucket
    ")->fetchAll(PDO::FETCH_KEY_PAIR);
    $versions = $db->query("
        SELECT version, COUNT(*) FROM Messages GROUP BY version ORDER BY version
    ")->fetchAll(PDO::FETCH_KEY_PAIR);
    $topViews = $db->query("
        SELECT opened FROM Messages WHERE opened > 0 ORDER BY opened DESC LIMIT 10
    ")->fetchAll(PDO::FETCH_COLUMN);

    $db->commit();
    return compact(
        'summary', 'months', 'annual', 'hours', 'weekdays', 'languages', 'annualLanguages',
        'styles', 'strokes', 'widths', 'versions', 'topViews'
    );
}

function statsColor(?string $value, string $fallback): string
{
    $value = strtolower(trim($value ?? ''));
    $names = [
        'black' => '#000000', 'white' => '#ffffff', 'red' => '#ff0000',
        'blue' => '#0000ff', 'green' => '#008000', 'yellow' => '#ffff00',
    ];
    if (isset($names[$value])) {
        return $names[$value];
    }
    if (preg_match('/^#?([0-9a-f]{6})$/D', $value, $hex)) {
        return '#' . $hex[1];
    }
    if (preg_match('/^#([0-9a-f])([0-9a-f])([0-9a-f])$/D', $value, $hex)) {
        return '#' . $hex[1] . $hex[1] . $hex[2] . $hex[2] . $hex[3] . $hex[3];
    }
    if (preg_match('/^rgb\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\s*\)$/D', $value, $rgb)
        && max(array_slice($rgb, 1)) <= 255) {
        return sprintf('#%02x%02x%02x', $rgb[1], $rgb[2], $rgb[3]);
    }
    return $fallback;
}
