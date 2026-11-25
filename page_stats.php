<?php
require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/_/stats.php';
require_once __DIR__ . '/ui/stats.php';

try {
    $stats = loadMessageStats();
} catch (PDOException $error) {
    error_log('Crytch stats: ' . $error->getMessage());
    http_response_code(503);
    $stats = null;
}

header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-cache');
$pageTitle = 'Stats - Crytch';
$pageDescription = 'Message statistics for Crytch.';
$loadEditorScripts = false;
include __DIR__ . '/ui/header.php';
?>
    <link rel="stylesheet" href="/ui/stats.css">
    <script defer src="/v/2/characters.js"></script>
    <script defer src="/ui/stats.js"></script>
</head>
<body class="page stats">
<div class="wrapper">
    <header class="text center">
        <h1><a href="/"><?= PAGETITLE ?></a></h1>
        <h2>Stats</h2>
    </header>

    <main>
        <?php if ($stats === null): ?>
            <p>Statistics are temporarily unavailable.</p>
        <?php else:
            $summary = $stats['summary'];
            $total = (int) $summary['messages'];
            $messagesByYear = [];
            $viewsByYear = [];
            $averages = [];
            foreach ($stats['annual'] as $year => $counts) {
                $messagesByYear[$year] = $counts['messages'];
                $viewsByYear[$year] = $counts['views'];
                $averages[$year] = number_format($counts['views'] / $counts['messages'], 1, '.', '');
            }
            ?>
            <section>
                <h2>Recent activity</h2>
                <?php statsNumbers([
                    ['New messages in last 6 months', $summary['recent_messages']],
                    ['Views of messages created in the last 6 months', $summary['recent_views']],
                ]); ?>
            </section>

            <section>
                <h2>Messages created</h2>
                <?php
                statsNumbers([['Total messages', $total]]);
                statsBarChart('Messages per year', $messagesByYear, 'annual');
                statsCumulativeChart($stats['months']);
                ?>
            </section>

            <section>
                <h2>Messages viewed</h2>
                <?php
                statsNumbers([
                    ['Total views', $summary['views']],
                    ['Average views per message', number_format($summary['views'] / max(1, $total), 1, '.', '')],
                ]);
                statsBarChart('Views by creation year', $viewsByYear, 'annual', $averages);
                ?>
                <?php if ($stats['topViews']): ?>
                    <figure class="stats-ranking">
                        <figcaption>Top <?= count($stats['topViews']) ?> viewed messages</figcaption>
                        <ol>
                            <?php foreach ($stats['topViews'] as $index => $views): ?>
                                <li><span>#<?= $index + 1 ?></span><span><?= (int) $views ?> views</span></li>
                            <?php endforeach; ?>
                        </ol>
                    </figure>
                <?php endif; ?>
            </section>

            <?php if ($stats['months']): ?>
                <section>
                    <h2>Usage time</h2>
                    <?php
                    $weekdays = [];
                    foreach (['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as $index => $label) {
                        $weekdays[$label] = $stats['weekdays'][($index + 1) % 7];
                    }
                    $hours = [];
                    foreach ($stats['hours'] as $hour => $count) {
                        $hours[sprintf('%02d', $hour)] = $count;
                    }
                    statsBarChart('Messages by weekday', $weekdays, 'weekdays');
                    statsBarChart('Messages by hour', $hours, 'hours');
                    ?>
                </section>
            <?php endif; ?>

            <?php if ($total): ?>
                <section>
                    <h2>Language</h2>
                    <?php
                    statsSegmentBar('Messages by language', $stats['languages'], $total);
                    statsStackedChart($stats['annualLanguages']);
                    ?>
                </section>

                <section>
                    <h2>Display</h2>
                    <?php
                    statsSwatches($stats['styles'], $total);
                    statsSegmentBar('Most used stroke widths', $stats['strokes'], $total, 'stats-strokes');
                    statsSegmentBar('Messages by screen size', $stats['widths'], $total, 'stats-widths');
                    ?>
                </section>

                <section>
                    <h2>Version</h2>
                    <?php statsSegmentBar('Messages by version', $stats['versions'], $total, 'stats-versions'); ?>
                </section>
            <?php else: ?>
                <p>No messages have been recorded yet.</p>
            <?php endif; ?>
        <?php endif; ?>
    </main>

    <footer class="text center">
        <p>
            <?php if (!empty($stats['summary']['latest_date'])): ?>
                Last included message: <?= statsEscape($stats['summary']['latest_date']) ?><br>
            <?php endif; ?>
            Page generated: <?= gmdate('Y-m-d') ?>
        </p>
    </footer>
</div>
<?php include __DIR__ . '/ui/footer.php'; ?>
