export type StyleStrokeWidthItem = {
  key: string;
  label: string;
  total: number;
  percent: string;
};

type StyleStrokeWidthProps = {
  items: StyleStrokeWidthItem[];
  caption: string;
};

export function StyleStrokeWidth({ items, caption }: StyleStrokeWidthProps) {
  return (
    <figure className="border border-black">
      <ul className="flex w-full border-b">
        {items.map((item) => (
          <li
            key={item.key}
            className="h-42 relative border-r last:border-r-0 overflow-hidden min-w-4 hover:min-w-[80px]"
            style={{ width: `${item.percent}%` }}
          >
            <div
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-black"
              style={{ height: `${item.key}px` }}
            />
            <p className="px-4 py-2 flex flex-col relative z-10">
              <span>{item.label}</span>
              <span>{item.total}</span>
            </p>
          </li>
        ))}
      </ul>
      <figcaption className="px-4 py-2">{caption}</figcaption>
    </figure>
  );
}
