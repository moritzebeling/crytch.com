export type BarChartItem = {
  key: string;
  percent: string;
  lines: string[];
};

type BarChartProps = {
  items: BarChartItem[];
  height: string;
  caption: string;
  labelClassName?: string;
};

export function BarChart({
  items,
  height,
  caption,
  labelClassName = "px-4 py-2 flex flex-col relative z-10",
}: BarChartProps) {
  return (
    <figure className="border border-black">
      <ul className={`flex border-b w-full ${height} items-end`}>
        {items.map((item) => (
          <li
            key={item.key}
            className="border-r last:border-r-0 overflow-hidden min-w-4 flex-1 h-full"
          >
            <div className="relative h-full">
              <div
                className={`absolute bg-black/5 inset-x-0 bottom-0${item.percent === "100.0" ? "" : " border-t"}`}
                style={{ height: `${item.percent}%` }}
              />
              <p className={labelClassName}>
                {item.lines.map((line, i) => (
                  <span key={i}>{line}</span>
                ))}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <figcaption className="px-4 py-2">{caption}</figcaption>
    </figure>
  );
}
