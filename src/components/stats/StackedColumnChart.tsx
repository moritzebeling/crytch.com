import type { GroupedCount } from "./types";

export type StackedColumn = {
  key: string;
  rows: GroupedCount[];
};

type StackedColumnChartProps = {
  columns: StackedColumn[];
  caption: string;
  height?: string;
};

export function StackedColumnChart({
  columns,
  caption,
  height = "h-120",
}: StackedColumnChartProps) {
  return (
    <figure className="border border-black">
      <div className="flex w-full border-b items-stretch">
        {columns.map(({ key, rows }) => {
          const columnTotal = rows.reduce((sum, row) => sum + row.total, 0) || 1;
          const largestKey =
            rows.reduce((largest, row) =>
              row.total > largest.total ? row : largest
            ).key ?? "";

          return (
            <div key={key} className="flex-1 border-r last:border-r-0">
              <ul className={`flex flex-col ${height}`}>
                {rows.map((row) => {
                  const percent = ((row.total / columnTotal) * 100).toFixed(1);
                  return (
                    <li
                      key={`${key}-${row.key}`}
                      className="px-4 py-2 border-b last:border-b-0 flex flex-col overflow-hidden min-h-4 hover:min-h-[60px]"
                      style={{ height: `${percent}%` }}
                    >
                      {row.key === largestKey && <span>{key}</span>}
                      <span>{row.key}</span>
                      <span>{row.total}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      <figcaption className="px-4 py-2">{caption}</figcaption>
    </figure>
  );
}
