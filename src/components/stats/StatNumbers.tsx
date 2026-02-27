type StatNumberItem = {
  value: string | number;
  label: string;
};

type StatNumbersProps = {
  items: StatNumberItem[];
};

export function StatNumbers({ items }: StatNumbersProps) {
  return (
    <div className="border flex">
      {items.map((item, index) => (
        <div
          key={index}
          className={`flex-1 px-4 py-2${index < items.length - 1 ? " border-r" : ""}`}
        >
          <p className="text-4xl mb-24">{item.value}</p>
          <p>{item.label}</p>
        </div>
      ))}
    </div>
  );
}
