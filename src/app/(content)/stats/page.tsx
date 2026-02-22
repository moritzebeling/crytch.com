import { PageHeader } from "@/components/layout";
import { db, messages } from "@/lib/db";
import { asc, count, desc, sql } from "drizzle-orm";

export const metadata = {
  title: "Stats - Crytch",
  description: "Simple message statistics for Crytch.",
};

type GroupedCount = {
  key: string;
  total: number;
};

type MonthStats = {
  key: string;
  total: number;
  views: number;
};

type AnnualLanguageStats = {
  year: string;
  language: string;
  total: number;
};

type TopViewedMessage = {
  url: string;
  views: number;
  date: string;
};

async function getStats() {
  // Legacy imports may have milliseconds, while new rows use seconds.
  const createdAtEpoch = sql<number>`(case when ${messages.createdAt} > 20000000000 then ${messages.createdAt} / 1000 else ${messages.createdAt} end)`;
  const yearValue = sql<number>`cast(strftime('%Y', ${createdAtEpoch}, 'unixepoch') as integer)`;
  const yearKeyLabel = sql<string>`cast(${yearValue} as text)`;
  const yearKey = sql<string>`strftime('%Y', ${createdAtEpoch}, 'unixepoch')`;

  const [
    totalMessagesResult,
    messagesLast6MonthsResult,
    monthlyActivity,
    messagesByVersion,
    messagesByLanguage,
    languageByYear,
    totalViewsResult,
    topViewedMessages,
    messagesByWeekday,
    messagesByHour,
    topStyleColors,
    topStyleBackgrounds,
    topStyleStrokes,
    canvasWidthBuckets,
  ] = await Promise.all([
    db.select({ total: count() }).from(messages),
    db
      .select({ total: count() })
      .from(messages)
      .where(
        sql`${createdAtEpoch} >= cast(strftime('%s', 'now', '-6 months') as integer)`
      ),
    db
      .select({
        key: yearKeyLabel,
        total: count(),
        views: sql<number>`coalesce(sum(coalesce(${messages.viewCount}, 0)), 0)`,
      })
      .from(messages)
      .groupBy(yearValue)
      .orderBy(asc(yearValue)),
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
    db
      .select({
        year: yearKey,
        language: sql<string>`coalesce(${messages.language}, 'unknown')`,
        total: count(),
      })
      .from(messages)
      .groupBy(yearKey, sql`coalesce(${messages.language}, 'unknown')`)
      .orderBy(
        asc(yearKey),
        asc(sql`coalesce(${messages.language}, 'unknown')`)
      ),
    db
      .select({
        total: sql<number>`coalesce(sum(coalesce(${messages.viewCount}, 0)), 0)`,
      })
      .from(messages),
    db
      .select({
        url: messages.messageUrl,
        views: sql<number>`coalesce(${messages.viewCount}, 0)`,
        date: sql<string>`strftime('%Y-%m-%d', ${createdAtEpoch}, 'unixepoch')`,
      })
      .from(messages)
      .orderBy(
        desc(sql`coalesce(${messages.viewCount}, 0)`),
        asc(messages.messageUrl)
      )
      .limit(15),
    db
      .select({
        key: sql<string>`strftime('%w', ${createdAtEpoch}, 'unixepoch')`,
        total: count(),
      })
      .from(messages)
      .groupBy(sql`strftime('%w', ${createdAtEpoch}, 'unixepoch')`)
      .orderBy(asc(sql`strftime('%w', ${createdAtEpoch}, 'unixepoch')`)),
    db
      .select({
        key: sql<string>`strftime('%H', ${createdAtEpoch}, 'unixepoch')`,
        total: count(),
      })
      .from(messages)
      .groupBy(sql`strftime('%H', ${createdAtEpoch}, 'unixepoch')`)
      .orderBy(asc(sql`strftime('%H', ${createdAtEpoch}, 'unixepoch')`)),
    db
      .select({
        key: sql<string>`coalesce(${messages.styleColor}, 'unknown')`,
        total: count(),
      })
      .from(messages)
      .groupBy(sql`coalesce(${messages.styleColor}, 'unknown')`)
      .orderBy(
        desc(count()),
        asc(sql`coalesce(${messages.styleColor}, 'unknown')`)
      )
      .limit(5),
    db
      .select({
        key: sql<string>`coalesce(${messages.styleBackground}, 'unknown')`,
        total: count(),
      })
      .from(messages)
      .groupBy(sql`coalesce(${messages.styleBackground}, 'unknown')`)
      .orderBy(
        desc(count()),
        asc(sql`coalesce(${messages.styleBackground}, 'unknown')`)
      )
      .limit(5),
    db
      .select({
        key: sql<string>`coalesce(cast(${messages.styleStroke} as text), 'unknown')`,
        total: count(),
      })
      .from(messages)
      .groupBy(sql`coalesce(cast(${messages.styleStroke} as text), 'unknown')`)
      .orderBy(
        desc(count()),
        asc(sql`coalesce(cast(${messages.styleStroke} as text), 'unknown')`)
      )
      .limit(5),
    db
      .select({
        key: sql<string>`
          case
            when ${messages.windowWidth} is null then 'unknown'
            when ${messages.windowWidth} < 640 then '<640'
            when ${messages.windowWidth} < 1024 then '640-1023'
            when ${messages.windowWidth} < 1440 then '1024-1439'
            else '>=1440'
          end
        `,
        total: count(),
      })
      .from(messages)
      .groupBy(
        sql`
        case
          when ${messages.windowWidth} is null then 'unknown'
          when ${messages.windowWidth} < 640 then '<640'
          when ${messages.windowWidth} < 1024 then '640-1023'
          when ${messages.windowWidth} < 1440 then '1024-1439'
          else '>=1440'
        end
      `
      )
      .orderBy(desc(count())),
  ]);

  const languageByYearMap = new Map<string, GroupedCount[]>();
  for (const row of languageByYear as AnnualLanguageStats[]) {
    const rows = languageByYearMap.get(row.year) ?? [];
    rows.push({ key: row.language, total: row.total });
    languageByYearMap.set(row.year, rows);
  }

  return {
    totalMessages: totalMessagesResult[0]?.total ?? 0,
    messagesLast6Months: messagesLast6MonthsResult[0]?.total ?? 0,
    totalViews: totalViewsResult[0]?.total ?? 0,
    messagesByMonth: monthlyActivity as MonthStats[],
    messagesByVersion: messagesByVersion as GroupedCount[],
    messagesByLanguage: messagesByLanguage as GroupedCount[],
    messagesByWeekday: messagesByWeekday as GroupedCount[],
    messagesByHour: messagesByHour as GroupedCount[],
    languageByYear: Array.from(languageByYearMap.entries()),
    topViewedMessages: topViewedMessages as TopViewedMessage[],
    topStyleColors: topStyleColors as GroupedCount[],
    topStyleBackgrounds: topStyleBackgrounds as GroupedCount[],
    topStyleStrokes: topStyleStrokes as GroupedCount[],
    canvasWidthBuckets: canvasWidthBuckets as GroupedCount[],
  };
}

export default async function StatsPage() {
  const stats = await getStats();
  const safeTotalMessages = stats.totalMessages || 1;
  const pct = (value: number) => ((value / safeTotalMessages) * 100).toFixed(1);
  const weekdayOrder = ["1", "2", "3", "4", "5", "6", "0"];
  const weekdayMap = new Map(
    stats.messagesByWeekday.map((item) => [item.key, item.total])
  );
  const orderedWeekdayItems = weekdayOrder.map((key) => ({
    key,
    total: weekdayMap.get(key) ?? 0,
  }));
  const maxWeekdayCount = Math.max(
    ...orderedWeekdayItems.map((item) => item.total),
    1
  );
  const maxHourCount = Math.max(
    ...stats.messagesByHour.map((item) => item.total),
    1
  );
  const maxYearCount = Math.max(
    ...stats.messagesByMonth.map((item) => item.total),
    1
  );
  const weekdayLabels: Record<string, string> = {
    "0": "Sun",
    "1": "Mon",
    "2": "Tue",
    "3": "Wed",
    "4": "Thu",
    "5": "Fri",
    "6": "Sat",
  };

  return (
    <>
      <PageHeader title="Crytch" subtitle="Stats" />

      <main className="p-6 space-y-6">
        <h2 className="text-xl mt-16 mb-4">Messages created</h2>

        <div className="border flex">
          <div className="flex-1 px-4 py-2 border-r">
            <p className="text-4xl mb-24">{stats.totalMessages}</p>
            <p>Total messages</p>
          </div>
          <div className="flex-1 px-4 py-2">
            <p className="text-4xl mb-24">{stats.messagesLast6Months}</p>
            <p>In last 6 months</p>
          </div>
        </div>

        {stats.messagesByMonth.length === 0 ? (
          <p>No data.</p>
        ) : (
          <figure className="border border-black">
            <ul className="flex border-b w-full h-120 items-end">
              {stats.messagesByMonth.map((item) => {
                const percent = ((item.total / maxYearCount) * 100).toFixed(1);
                return (
                  <li
                    key={item.key}
                    className="border-r last:border-r-0 overflow-hidden min-w-4 flex-1 h-full"
                  >
                    <div className="relative h-full">
                      <div
                        className={`absolute inset-x-0 bottom-0${percent === "100.0" ? "" : " border-t"}`}
                        style={{ height: `${percent}%` }}
                      />
                      <p className="px-4 py-2 flex flex-col font-size-6 relative z-10">
                        <span>{item.key}</span>
                        <span>{item.total}</span>
                        {/* <span>{item.views} views</span> */}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <figcaption className="px-4 py-2">Messages per year</figcaption>
          </figure>
        )}

        <h2 className="text-xl mt-16 mb-4">Messages viewed</h2>

        <div className="border flex">
          <div className="flex-1 px-4 py-2 border-r">
            <p className="text-4xl mb-24">{stats.totalViews}</p>
            <p>Total views</p>
          </div>
          <div className="flex-1 px-4 py-2">
            <p className="text-4xl mb-24">
              {(stats.totalViews / safeTotalMessages).toFixed(2)}
            </p>
            <p>Average views per message</p>
          </div>
        </div>

        {stats.topViewedMessages.length > 0 && (
          <div className="border border-black">
            <p className="px-4 py-2 border-b">
              Top {stats.topViewedMessages.length} viewed messages
            </p>
            <ul>
              {stats.topViewedMessages.map((item) => (
                <li key={item.url} className="border-b last:border-b-0">
                  <a
                    href={`/m/${item.url}`}
                    className="px-4 py-2 flex gap-8"
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
        )}

        <h2 className="text-xl mt-16 mb-4">Usage time</h2>

        {orderedWeekdayItems.length > 0 && (
          <figure className="border border-black mb-4">
            <ul className="flex border-b w-full h-72 items-end">
              {orderedWeekdayItems.map((item) => {
                const percent = ((item.total / maxWeekdayCount) * 100).toFixed(
                  1
                );
                return (
                  <li
                    key={item.key}
                    className="border-r last:border-r-0 overflow-hidden min-w-4 flex-1 h-full"
                  >
                    <div className="relative h-full">
                      <div
                        className={`absolute inset-x-0 bottom-0${percent === "100.0" ? "" : " border-t"}`}
                        style={{ height: `${percent}%` }}
                      />
                      <p className="px-4 py-2 flex flex-col justify-end h-full relative z-10">
                        <span>{weekdayLabels[item.key] ?? item.key}</span>
                        <span>{item.total}</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <figcaption className="px-4 py-2">Messages by weekday</figcaption>
          </figure>
        )}

        {stats.messagesByHour.length > 0 && (
          <figure className="border border-black">
            <ul className="flex border-b w-full h-72 items-end">
              {stats.messagesByHour.map((item) => {
                const percent = ((item.total / maxHourCount) * 100).toFixed(1);
                return (
                  <li
                    key={item.key}
                    className="border-r last:border-r-0 overflow-hidden min-w-4 flex-1 h-full"
                  >
                    <div className="relative h-full">
                      <div
                        className={`absolute inset-x-0 bottom-0 ${percent === "100.0" ? "" : " border-t"}`}
                        style={{ height: `${percent}%` }}
                      />
                      <p className="p-2 text-center flex flex-col justify-end h-full relative z-10">
                        <span>{item.key}</span>
                        <span>{item.total}</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <figcaption className="px-4 py-2">Messages by hour</figcaption>
          </figure>
        )}

        <h2 className="text-xl mt-16 mb-4">Language</h2>

        {stats.messagesByLanguage.length > 0 && (
          <figure className="border border-black">
            <ul className="flex border-b w-full">
              {stats.messagesByLanguage.map((item) => {
                const percent = Number(pct(item.total));
                return (
                  <li
                    key={item.key}
                    className="border-r last:border-r-0 overflow-hidden min-w-4 hover:min-w-[80px]"
                    style={{ width: `${percent}%` }}
                  >
                    <p className="px-4 py-2 flex flex-col">
                      <span>{item.key}</span>
                      <span>{item.total}</span>
                      <span>{pct(item.total)}%</span>
                    </p>
                  </li>
                );
              })}
            </ul>
            <figcaption className="px-4 py-2">Messages by language</figcaption>
          </figure>
        )}

        {stats.languageByYear.length > 0 && (
          <figure className="border border-black">
            <div className="flex w-full border-b items-stretch">
              {stats.languageByYear.map(([year, rows]) => {
                const yearTotal =
                  rows.reduce((sum, row) => sum + row.total, 0) || 1;
                return (
                  <div key={year} className="flex-1 border-r last:border-r-0">
                    <p className="px-4 py-2 border-b">{year}</p>
                    <ul className="flex flex-col h-120">
                      {rows.map((row) => {
                        const percent = ((row.total / yearTotal) * 100).toFixed(
                          1
                        );
                        return (
                          <li
                            key={`${year}-${row.key}`}
                            className="px-4 py-2 border-b last:border-b-0 flex flex-col overflow-hidden min-h-4 hover:min-h-[60px]"
                            style={{
                              height: `${percent}%`,
                            }}
                          >
                            <span>{row.key}</span>
                            <span>{row.total}</span>
                            {/* <span>{percent}%</span> */}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
            <figcaption className="px-4 py-2">Languages by year</figcaption>
          </figure>
        )}

        <section>
          <h2 className="text-lg mb-2">Canvas/style usage</h2>

          <h3 className="mb-1">Top 5 stroke colors</h3>
          {stats.topStyleColors.length === 0 ? (
            <p>No data.</p>
          ) : (
            <ul className="space-y-1 mb-3">
              {stats.topStyleColors.map((item) => (
                <li key={item.key}>
                  {item.key}: {item.total} ({pct(item.total)}%)
                </li>
              ))}
            </ul>
          )}

          <h3 className="mb-1">Top 5 background colors</h3>
          {stats.topStyleBackgrounds.length === 0 ? (
            <p>No data.</p>
          ) : (
            <ul className="space-y-1 mb-3">
              {stats.topStyleBackgrounds.map((item) => (
                <li key={item.key}>
                  {item.key}: {item.total} ({pct(item.total)}%)
                </li>
              ))}
            </ul>
          )}

          <h3 className="mb-1">Top 5 stroke widths</h3>
          {stats.topStyleStrokes.length === 0 ? (
            <p>No data.</p>
          ) : (
            <ul className="space-y-1 mb-3">
              {stats.topStyleStrokes.map((item) => (
                <li key={item.key}>
                  {item.key}: {item.total} ({pct(item.total)}%)
                </li>
              ))}
            </ul>
          )}

          <h3 className="mb-1">Canvas width buckets</h3>
          {stats.canvasWidthBuckets.length === 0 ? (
            <p>No data.</p>
          ) : (
            <ul className="space-y-1">
              {stats.canvasWidthBuckets.map((item) => (
                <li key={item.key}>
                  {item.key}: {item.total} ({pct(item.total)}%)
                </li>
              ))}
            </ul>
          )}
        </section>

        <h2 className="text-xl mt-16 mb-4">Version</h2>

        {stats.messagesByVersion.length > 0 && (
          <figure className="border border-black">
            <ul className="flex w-full border-b">
              {stats.messagesByVersion.map((item) => {
                const percent = Number(pct(item.total));
                return (
                  <li
                    key={item.key}
                    className="border-r last:border-r-0 overflow-hidden min-w-4 hover:min-w-[80px]"
                    style={{ width: `${percent}%` }}
                  >
                    <p className="px-4 py-2 flex flex-col">
                      <span>v{item.key}</span>
                      <span>{item.total}</span>
                      <span>{pct(item.total)}%</span>
                    </p>
                  </li>
                );
              })}
            </ul>
            <figcaption className="px-4 py-2">Messages by version</figcaption>
          </figure>
        )}
      </main>
    </>
  );
}
