for (const sample of document.querySelectorAll('[data-stats-letter]')) {
    const { span, points } = letters[sample.dataset.statsLetter];
    const minX = Math.min(...points.map(([x]) => x));
    const left = (18 - span) / 2 - minX;
    sample.querySelector('polyline').setAttribute(
        'points',
        points.map(([x, y]) => `${x + left},${y + 4.5}`).join(' ')
    );
}
