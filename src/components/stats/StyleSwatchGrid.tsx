import type { TopStyleCombination } from './types';
import { TypefaceLetterCanvas } from '@/components/canvas/TypefaceLetterCanvas';

const LETTERS = ['C', 'r', 'y', 't', 'c', 'h'] as const;

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
                  }
                : undefined
            }
          >
            {item ? (
              <>
                <span className="absolute top-0 left-0 px-4 py-2" style={{ color: item.styleColor }}>
                  {pct(item.total)}%
                </span>
                <TypefaceLetterCanvas
                  char={LETTERS[index]}
                  color={item.styleColor}
                  strokeWidth={item.styleStroke}
                  className="absolute inset-0 w-full h-full"
                />
              </>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
