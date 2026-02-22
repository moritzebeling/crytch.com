import { PageHeader } from "@/components/layout";
import { db, messages } from "@/lib/db";
import { asc, count, sql } from "drizzle-orm";

export const metadata = {
  title: "Stats - Crytch",
  description: "Simple message statistics for Crytch.",
};

type GroupedCount = {
  key: string;
  total: number;
};

async function getStats() {
  const [totalMessagesResult, messagesByMonth, messagesByVersion, messagesByLanguage] =
    await Promise.all([
      db.select({ total: count() }).from(messages),
      db
        .select({
          key: sql<string>`strftime('%Y-%m', ${messages.createdAt}, 'unixepoch')`,
          total: count(),
        })
        .from(messages)
        .groupBy(sql`strftime('%Y-%m', ${messages.createdAt}, 'unixepoch')`)
        .orderBy(asc(sql`strftime('%Y-%m', ${messages.createdAt}, 'unixepoch')`)),
      db
        .select({
          key: sql<string>`${messages.version}`,
          total: count(),
        })
        .from(messages)
        .groupBy(messages.version)
        .orderBy(asc(messages.version)),
      db
        .select({
          key: sql<string>`coalesce(${messages.language}, 'unknown')`,
          total: count(),
        })
        .from(messages)
        .groupBy(sql`coalesce(${messages.language}, 'unknown')`)
        .orderBy(asc(sql`coalesce(${messages.language}, 'unknown')`)),
    ]);

  return {
    totalMessages: totalMessagesResult[0]?.total ?? 0,
    messagesByMonth: messagesByMonth as GroupedCount[],
    messagesByVersion: messagesByVersion as GroupedCount[],
    messagesByLanguage: messagesByLanguage as GroupedCount[],
  };
}

export default async function StatsPage() {
  const stats = await getStats();

  return (
    <>
      <PageHeader title="Crytch" subtitle="Stats" />

      <main className="p-6 space-y-6">
        <section>
          <h1 className="text-xl mb-2">Stats</h1>
          <p>Total messages: {stats.totalMessages}</p>
        </section>

        <section>
          <h2 className="text-lg mb-2">Messages per month</h2>
          {stats.messagesByMonth.length === 0 ? (
            <p>No data.</p>
          ) : (
            <ul className="space-y-1">
              {stats.messagesByMonth.map((item) => (
                <li key={item.key}>
                  {item.key}: {item.total}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="text-lg mb-2">Messages by version</h2>
          {stats.messagesByVersion.length === 0 ? (
            <p>No data.</p>
          ) : (
            <ul className="space-y-1">
              {stats.messagesByVersion.map((item) => (
                <li key={item.key}>
                  v{item.key}: {item.total}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="text-lg mb-2">Messages by language</h2>
          {stats.messagesByLanguage.length === 0 ? (
            <p>No data.</p>
          ) : (
            <ul className="space-y-1">
              {stats.messagesByLanguage.map((item) => (
                <li key={item.key}>
                  {item.key}: {item.total}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
