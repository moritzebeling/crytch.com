export type SegmentBarItem = {
  key: string;
  label: string;
  total: number;
  percent: string;
};

type SegmentBarProps = {
  items: SegmentBarItem[];
  caption: string;
  hoverMinWidth?: "80px" | "100px";
  contentClassName?: string;
};

export function SegmentBar({
  items,
  caption,
  hoverMinWidth = "80px",
  contentClassName,
}: SegmentBarProps) {
  const hoverClass =
    hoverMinWidth === "100px" ? "hover:min-w-[100px]" : "hover:min-w-[80px]";

  return (
    <figure className="border border-black">
      <ul className="flex w-full border-b">
        {items.map((item) => (
          <li
            key={item.key}
            className={`border-r last:border-r-0 overflow-hidden min-w-4 ${hoverClass}`}
            style={{ width: `${item.percent}%` }}
          >
            <p
              className={`px-4 py-2 flex flex-col${contentClassName ? ` ${contentClassName}` : ""}`}
            >
              <span>{item.label}</span>
              <span>{item.total}</span>
              <span>{item.percent}%</span>
            </p>
          </li>
        ))}
      </ul>
      <figcaption className="px-4 py-2">{caption}</figcaption>
    </figure>
  );
}
