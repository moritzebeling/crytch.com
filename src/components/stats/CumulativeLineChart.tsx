export type CumulativeLineChartItem = {
  key: string;
  cumulative: number;
};

type CumulativeLineChartProps = {
  items: CumulativeLineChartItem[];
  height: string;
  caption: string;
};

export function CumulativeLineChart({
  items,
  height,
  caption,
}: CumulativeLineChartProps) {
  if (items.length === 0) return null;

  const max = items[items.length - 1]?.cumulative ?? 1;
  const n = items.length;

  const points = items
    .map((item, i) => {
      const x = n > 1 ? (i / (n - 1)) * 100 : 0;
      const y = 100 - (item.cumulative / max) * 100;
      return `${x.toFixed(4)},${y.toFixed(4)}`;
    })
    .join(' ');

  return (
    <figure className="border border-black">
      <div className={`${height} w-full`}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full block"
          aria-hidden="true"
        >
          <polyline
            points={points}
            fill="none"
            stroke="black"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      <figcaption className="px-4 py-2 border-t border-black">
        {caption}
      </figcaption>
    </figure>
  );
}
