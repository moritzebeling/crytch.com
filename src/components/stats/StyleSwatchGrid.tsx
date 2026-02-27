import type { TopStyleCombination } from './types';

type StyleSwatchGridProps = {
  cells: Array<TopStyleCombination | null>;
  pct: (value: number) => string;
};

export function StyleSwatchGrid({ cells, pct }: StyleSwatchGridProps) {
  return (
    <div className="border border-black">
      <p className="px-4 py-2 border-b">Top style combinations</p>
      <ul className="grid grid-cols-3">
        {cells.map((item, index) => (
          <li
            key={item?.key ?? `style-cell-${index}`}
            className={`relative aspect-square border-black ${
              index % 3 === 2 ? '' : 'border-r'
            } ${index < 3 ? 'border-b' : ''}`}
            style={
              item
                ? {
                    backgroundColor: item.styleBackground,
                    color: item.styleColor,
                  }
                : undefined
            }
          >
            {item ? (
              <>
                <span className="absolute top-0 left-0 px-4 py-2">
                  {pct(item.total)}%{item.styleStroke}
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="size-16 flex items-center justify-center rounded-md border-solid"
                    style={{
                      borderColor: item.styleColor,
                      borderWidth: `${item.styleStroke}px`,
                    }}
                  >
                    <span className="text-2xl">
                      {['Crytchdotcom'.slice(index, index + 1)]}
                    </span>
                  </div>
                </div>
              </>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
