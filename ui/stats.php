<?php

function statsEscape($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function statsPercent(int $value, int $total): string
{
    return number_format(100 * $value / max(1, $total), 1, '.', '');
}

function statsNumbers(array $items): void
{
    ?>
    <dl class="stats-numbers">
        <?php foreach ($items as [$label, $value]): ?>
            <div>
                <dt><?= statsEscape($label) ?></dt>
                <dd><?= statsEscape($value) ?></dd>
            </div>
        <?php endforeach; ?>
    </dl>
    <?php
}

function statsBarChart(string $caption, array $counts, string $size, array $averages = []): void
{
    if (!$counts) {
        return;
    }
    $max = max($counts);
    ?>
    <figure>
        <div class="stats-scroll">
            <ul class="stats-bars stats-<?= $size ?>">
                <?php foreach ($counts as $label => $count): ?>
                    <li>
                        <?php if ($count > 0): ?>
                            <span class="stats-fill" aria-hidden="true" style="height:<?= statsPercent($count, $max) ?>%"></span>
                        <?php endif; ?>
                        <div class="stats-label">
                            <span><?= statsEscape($label) ?></span>
                            <span><?= (int) $count ?></span>
                            <?php if (isset($averages[$label])): ?>
                                <span title="Average views per message">
                                    <span class="stats-visually-hidden">Average views per message </span><?= $averages[$label] ?>
                                </span>
                            <?php endif; ?>
                        </div>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
        <figcaption><?= statsEscape($caption) ?></figcaption>
    </figure>
    <?php
}

function statsCumulativeChart(array $months): void
{
    if (!$months) {
        return;
    }
    $monthIndex = static function (string $month): int {
        return (int) substr($month, 0, 4) * 12 + (int) substr($month, 5);
    };
    $first = array_key_first($months);
    $last = array_key_last($months);
    $start = $monthIndex($first);
    $length = $monthIndex($last) - $start;
    $total = array_sum(array_column($months, 'messages'));
    $points = $length === 0 ? ['0,100'] : [];
    $running = 0;
    $month = new DateTimeImmutable($first . '-01', new DateTimeZone('UTC'));
    for ($i = 0; $i <= $length; $i++) {
        $running += (int) ($months[$month->format('Y-m')]['messages'] ?? 0);
        $x = $length === 0 ? 100 : $i / $length * 100;
        $points[] = sprintf('%.4F,%.4F', $x, 100 - $running / $total * 100);
        $month = $month->modify('+1 month');
    }
    ?>
    <figure>
        <svg class="stats-line stats-tall" viewBox="0 0 100 100" preserveAspectRatio="none" role="img"
            aria-label="<?= statsEscape("$total messages from $first to $last") ?>">
            <polyline points="<?= implode(' ', $points) ?>" fill="none" stroke="currentColor" vector-effect="non-scaling-stroke"/>
        </svg>
        <figcaption>Cumulative messages all time</figcaption>
    </figure>
    <?php
}

function statsSegmentBar(string $caption, array $counts, int $total, string $kind = ''): void
{
    if (!$counts) {
        return;
    }
    ?>
    <figure>
        <div class="stats-scroll">
            <ul class="stats-segments <?= $kind ?>">
                <?php foreach ($counts as $label => $count):
                    $percent = statsPercent($count, $total);
                    $name = $kind === 'stats-versions' ? 'v' . $label : $label;
                    $detail = "$name, $count messages, $percent%";
                    ?>
                    <li tabindex="0" title="<?= statsEscape($detail) ?>" style="flex-basis:<?= $percent ?>%">
                        <?php if ($kind === 'stats-strokes'): ?>
                            <span class="stats-stroke" aria-hidden="true" style="height:<?= (int) $label ?>px"></span>
                        <?php endif; ?>
                        <div class="stats-label">
                            <span><?= statsEscape($name) ?></span>
                            <span><?= (int) $count ?></span>
                            <?php if ($kind !== 'stats-strokes'): ?><span><?= $percent ?>%</span><?php endif; ?>
                        </div>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
        <figcaption><?= statsEscape($caption) ?></figcaption>
    </figure>
    <?php
}

function statsStackedChart(array $years): void
{
    if (!$years) {
        return;
    }
    ?>
    <figure>
        <div class="stats-scroll">
            <div class="stats-stacks">
                <?php foreach ($years as $year => $counts):
                    $total = array_sum($counts);
                    $largest = array_search(max($counts), $counts, true);
                    ?>
                    <ul class="stats-tall" aria-label="<?= (int) $year ?>">
                        <?php foreach ($counts as $language => $count): ?>
                            <li tabindex="0" title="<?= statsEscape("$year, $language, $count messages") ?>"
                                style="flex-basis:<?= statsPercent($count, $total) ?>%">
                                <div class="stats-label">
                                    <?php if ($language === $largest): ?><span><?= (int) $year ?></span><?php endif; ?>
                                    <span><?= statsEscape($language) ?></span>
                                    <span><?= (int) $count ?></span>
                                </div>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                <?php endforeach; ?>
            </div>
        </div>
        <figcaption>Languages by year</figcaption>
    </figure>
    <?php
}

function statsSwatches(array $styles, int $total): void
{
    if (!$styles) {
        return;
    }
    $styles = array_values(array_slice($styles, 0, 6));
    ?>
    <figure class="stats-swatches">
        <figcaption>Top style combinations</figcaption>
        <ul>
            <?php foreach (str_split('Crytch') as $index => $letter): ?>
                <?php if (isset($styles[$index])):
                    ['background' => $background, 'color' => $color, 'stroke' => $stroke, 'total' => $count] = $styles[$index];
                    $percent = statsPercent($count, $total);
                    $labelColor = $background === $color ? ($background === '#000000' ? '#ffffff' : '#000000') : $color;
                    ?>
                    <li style="background:<?= $background ?>;color:<?= $labelColor ?>"
                        title="<?= "$color on $background, {$stroke}px stroke, $count messages" ?>">
                        <svg viewBox="0 0 18 18" data-stats-letter="<?= $letter ?>" aria-hidden="true">
                            <polyline fill="none" stroke="<?= $color ?>" stroke-width="<?= $stroke ?>"
                                vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="stats-label"><?= $percent ?>%</span>
                    </li>
                <?php else: ?>
                    <li aria-hidden="true"></li>
                <?php endif; ?>
            <?php endforeach; ?>
        </ul>
    </figure>
    <?php
}
