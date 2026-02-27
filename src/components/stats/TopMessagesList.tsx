import type { TopViewedMessage } from "./types";

type TopMessagesListProps = {
  messages: TopViewedMessage[];
};

export function TopMessagesList({ messages }: TopMessagesListProps) {
  return (
    <div className="border border-black">
      <p className="px-4 py-2 border-b">Top {messages.length} viewed messages</p>
      <ul>
        {messages.map((item) => (
          <li key={item.url} className="border-b last:border-b-0">
            <a
              href={`/m/${item.url}`}
              className="px-4 py-2 flex gap-8 no-underline hover:no-underline hover:text-gray-500"
              target="_blank"
            >
              <span className="w-24">{item.views} views</span>
              <span className="flex-1">{item.url}</span>
              <span>{item.date}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
