export type StyleStrokeWidthItem = {
  key: string;
  label: string;
  total: number;
  percent: string;
};

type StyleStrokeWidthProps = {
  items: StyleStrokeWidthItem[];
  caption: string;
  hoverMinWidth?: '80px' | '100px';
  contentClassName?: string;
};

export function StyleStrokeWidth({
  items,
  caption,
  hoverMinWidth = '80px',
  contentClassName,
}: StyleStrokeWidthProps) {
  const hoverClass =
    hoverMinWidth === '100px' ? 'hover:min-w-[100px]' : 'hover:min-w-[80px]';

  return (
    <figure className="border border-black">
      <ul className="flex w-full border-b">
        {items.map((item) => (
          <li
            key={item.key}
            className={`h-42 relative border-r last:border-r-0 overflow-hidden min-w-4 ${hoverClass}`}
            style={{ width: `${item.percent}%` }}
          >
            <div
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-black"
              style={{ height: `${item.key}px` }}
            />
            <p
              className={`px-4 py-2 flex flex-col relative z-10${contentClassName ? ` ${contentClassName}` : ''}`}
            >
              <span>{item.label}</span>
              <span>{item.total}</span>
              {/* <span>{item.percent}%</span> */}
            </p>
          </li>
        ))}
      </ul>
      <figcaption className="px-4 py-2">{caption}</figcaption>
    </figure>
  );
}
