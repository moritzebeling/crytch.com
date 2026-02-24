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

type TopStyleCombination = {
  key: string;
  styleBackground: string;
  styleColor: string;
  styleStroke: number;
  total: number;
};

async function getStats() {
  // Legacy imports may have milliseconds, while new rows use seconds.
  const createdAtEpoch = sql<number>`(case when ${messages.createdAt} > 20000000000 then ${messages.createdAt} / 1000 else ${messages.createdAt} end)`;
  const yearValue = sql<number>`cast(strftime('%Y', ${createdAtEpoch}, 'unixepoch') as integer)`;
  const yearKeyLabel = sql<string>`cast(${yearValue} as text)`;
  const yearKey = sql<string>`strftime('%Y', ${createdAtEpoch}, 'unixepoch')`;
  const styleBackgroundValue = sql<string>`coalesce(${messages.styleBackground}, '#ffffff')`;
  const styleColorValue = sql<string>`coalesce(${messages.styleColor}, '#000000')`;
  const styleStrokeValue = sql<number>`coalesce(${messages.styleStroke}, 2)`;
  const styleKeyLabel = sql<string>`${styleBackgroundValue} || '|' || ${styleColorValue} || '|' || cast(${styleStrokeValue} as text)`;

  const [
    totalMessagesResult,
    messagesLast6MonthsResult,
    viewsLast6MonthsResult,
    monthlyActivity,
    messagesByVersion,
    messagesByLanguage,
    languageByYear,
    totalViewsResult,
    topViewedMessages,
    messagesByWeekday,
    messagesByHour,
    topStyleCombinations,
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
        total: sql<number>`coalesce(sum(coalesce(${messages.viewCount}, 0)), 0)`,
      })
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
        key: styleKeyLabel,
        styleBackground: styleBackgroundValue,
        styleColor: styleColorValue,
        styleStroke: styleStrokeValue,
        total: count(),
      })
      .from(messages)
      .groupBy(styleBackgroundValue, styleColorValue, styleStrokeValue)
      .orderBy(
        desc(count()),
        asc(styleBackgroundValue),
        asc(styleColorValue),
        asc(styleStrokeValue)
      )
      .limit(6),
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
  const languageTotals = new Map<string, number>();
  for (const row of languageByYear as AnnualLanguageStats[]) {
    languageTotals.set(
      row.language,
      (languageTotals.get(row.language) ?? 0) + row.total
    );
    const rows = languageByYearMap.get(row.year) ?? [];
    rows.push({ key: row.language, total: row.total });
    languageByYearMap.set(row.year, rows);
  }

  const languageRank = new Map(
    Array.from(languageTotals.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([language], index) => [language, index])
  );

  const languageByYearOrdered = Array.from(languageByYearMap.entries()).map(
    ([year, rows]) =>
      [
        year,
        rows.sort(
          (a, b) =>
            (languageRank.get(a.key) ?? Number.MAX_SAFE_INTEGER) -
              (languageRank.get(b.key) ?? Number.MAX_SAFE_INTEGER) ||
            b.total - a.total ||
            a.key.localeCompare(b.key)
        ),
      ] as [string, GroupedCount[]]
  );

  return {
    totalMessages: totalMessagesResult[0]?.total ?? 0,
    messagesLast6Months: messagesLast6MonthsResult[0]?.total ?? 0,
    viewsLast6Months: viewsLast6MonthsResult[0]?.total ?? 0,
    totalViews: totalViewsResult[0]?.total ?? 0,
    messagesByMonth: monthlyActivity as MonthStats[],
    messagesByVersion: messagesByVersion as GroupedCount[],
    messagesByLanguage: messagesByLanguage as GroupedCount[],
    messagesByWeekday: messagesByWeekday as GroupedCount[],
    messagesByHour: messagesByHour as GroupedCount[],
    languageByYear: languageByYearOrdered,
    topViewedMessages: topViewedMessages as TopViewedMessage[],
    topStyleCombinations: topStyleCombinations as TopStyleCombination[],
    canvasWidthBuckets: canvasWidthBuckets as GroupedCount[],
  };
}

export default async function StatsPage() {
  const stats = await getStats();
  const safeTotalMessages = stats.totalMessages || 1;
  const pct = (value: number) => ((value / safeTotalMessages) * 100).toFixed(1);
  const topStyleCells = Array.from(
    { length: 6 },
    (_, index) => stats.topStyleCombinations[index] ?? null
  );
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
  const maxYearViews = Math.max(
    ...stats.messagesByMonth.map((item) => item.views),
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

      <main className="p-6 space-y-16">
        <section className="space-y-4">
          <h2 className="text-xl">Recent activity</h2>

          <div className="border flex">
            <div className="flex-1 px-4 py-2 border-r">
              <p className="text-4xl mb-24">{stats.messagesLast6Months}</p>
              <p>New messages in last 6 months</p>
            </div>
            <div className="flex-1 px-4 py-2">
              <p className="text-4xl mb-24">{stats.viewsLast6Months}</p>
              <p>Views in last 6 months</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl">Messages created</h2>

          <div className="border flex">
            <div className="flex-1 px-4 py-2">
              <p className="text-4xl mb-24">{stats.totalMessages}</p>
              <p>Total messages</p>
            </div>
          </div>

          {stats.messagesByMonth.length > 0 && (
            <figure className="border border-black">
              <ul className="flex border-b w-full h-120 items-end">
                {stats.messagesByMonth.map((item) => {
                  const percent = ((item.total / maxYearCount) * 100).toFixed(
                    1
                  );
                  return (
                    <li
                      key={item.key}
                      className="border-r last:border-r-0 overflow-hidden min-w-4 flex-1 h-full"
                    >
                      <div className="relative h-full">
                        <div
                          className={`absolute bg-black/5 inset-x-0 bottom-0${percent === "100.0" ? "" : " border-t"}`}
                          style={{ height: `${percent}%` }}
                        />
                        <p className="px-4 py-2 flex flex-col font-size-6 relative z-10">
                          <span>{item.key}</span>
                          <span>{item.total}</span>
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <figcaption className="px-4 py-2">Messages per year</figcaption>
            </figure>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl">Messages viewed</h2>

          <div className="border flex">
            <div className="flex-1 px-4 py-2 border-r">
              <p className="text-4xl mb-24">{stats.totalViews}</p>
              <p>Total views</p>
            </div>
            <div className="flex-1 px-4 py-2">
              <p className="text-4xl mb-24">
                {(stats.totalViews / safeTotalMessages).toFixed(1)}
              </p>
              <p>Average views per message</p>
            </div>
          </div>

          {stats.messagesByMonth.length > 0 && (
            <figure className="border border-black">
              <ul className="flex border-b w-full h-120 items-end">
                {stats.messagesByMonth.map((item) => {
                  const percent = ((item.views / maxYearViews) * 100).toFixed(
                    1
                  );
                  const avgViewsPerMessage =
                    item.total > 0 ? (item.views / item.total).toFixed(1) : "0";
                  return (
                    <li
                      key={`views-${item.key}`}
                      className="border-r last:border-r-0 overflow-hidden min-w-4 flex-1 h-full"
                    >
                      <div className="relative h-full">
                        <div
                          className={`absolute bg-black/5 inset-x-0 bottom-0${percent === "100.0" ? "" : " border-t"}`}
                          style={{ height: `${percent}%` }}
                        />
                        <p className="px-4 py-2 flex flex-col font-size-6 relative z-10">
                          <span>{item.key}</span>
                          <span>{item.views}</span>
                          <span>{avgViewsPerMessage}</span>
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <figcaption className="px-4 py-2">Views per year</figcaption>
            </figure>
          )}

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
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl">Usage time</h2>

          {orderedWeekdayItems.length > 0 && (
            <figure className="border border-black">
              <ul className="flex border-b w-full h-72 items-end">
                {orderedWeekdayItems.map((item) => {
                  const percent = (
                    (item.total / maxWeekdayCount) *
                    100
                  ).toFixed(1);
                  return (
                    <li
                      key={item.key}
                      className="border-r last:border-r-0 overflow-hidden min-w-4 flex-1 h-full"
                    >
                      <div className="relative h-full">
                        <div
                          className={`absolute bg-black/5 inset-x-0 bottom-0${percent === "100.0" ? "" : " border-t"}`}
                          style={{ height: `${percent}%` }}
                        />
                        <p className="px-4 py-2 flex flex-col h-full relative z-10">
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
                  const percent = ((item.total / maxHourCount) * 100).toFixed(
                    1
                  );
                  return (
                    <li
                      key={item.key}
                      className="border-r last:border-r-0 overflow-hidden min-w-4 flex-1 h-full"
                    >
                      <div className="relative h-full">
                        <div
                          className={`absolute bg-black/5 inset-x-0 bottom-0 ${percent === "100.0" ? "" : " border-t"}`}
                          style={{ height: `${percent}%` }}
                        />
                        <p className="p-2 text-center flex flex-col h-full relative z-10">
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
        </section>

        <section className="space-y-4">
          <h2 className="text-xl">Language</h2>

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
              <figcaption className="px-4 py-2">
                Messages by language
              </figcaption>
            </figure>
          )}

          {stats.languageByYear.length > 0 && (
            <figure className="border border-black">
              <div className="flex w-full border-b items-stretch">
                {stats.languageByYear.map(([year, rows]) => {
                  const yearTotal =
                    rows.reduce((sum, row) => sum + row.total, 0) || 1;
                  const largestLanguageByYear =
                    rows.reduce((largest, row) =>
                      row.total > largest.total ? row : largest
                    ).key ?? "";
                  return (
                    <div key={year} className="flex-1 border-r last:border-r-0">
                      <ul className="flex flex-col h-120">
                        {rows.map((row) => {
                          const percent = (
                            (row.total / yearTotal) *
                            100
                          ).toFixed(1);
                          return (
                            <li
                              key={`${year}-${row.key}`}
                              className="px-4 py-2 border-b last:border-b-0 flex flex-col overflow-hidden min-h-4 hover:min-h-[60px]"
                              style={{
                                height: `${percent}%`,
                              }}
                            >
                              {row.key === largestLanguageByYear && (
                                <span>{year}</span>
                              )}
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
              <figcaption className="px-4 py-2">Languages by year</figcaption>
            </figure>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl">Display</h2>

          {stats.topStyleCombinations.length > 0 && (
            <div className="border border-black">
              <p className="px-4 py-2 border-b">Top style combinations</p>
              <ul className="grid grid-cols-3">
                {topStyleCells.map((item, index) => (
                  <li
                    key={item?.key ?? `style-cell-${index}`}
                    className={`relative aspect-square border-black ${
                      index % 3 === 2 ? "" : "border-r"
                    } ${index < 3 ? "border-b" : ""}`}
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
                          {pct(item.total)}%
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
                              {["Crytch".slice(index, index + 1)]}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {stats.canvasWidthBuckets.length > 0 && (
            <figure className="border border-black">
              <ul className="flex w-full border-b">
                {stats.canvasWidthBuckets.map((item) => {
                  const percent = Number(pct(item.total));
                  return (
                    <li
                      key={item.key}
                      className="border-r last:border-r-0 overflow-hidden min-w-4 hover:min-w-[100px]"
                      style={{ width: `${percent}%` }}
                    >
                      <p className="px-4 py-2 flex flex-col whitespace-nowrap break-keep">
                        <span>{item.key}</span>
                        <span>{item.total}</span>
                        <span>{pct(item.total)}%</span>
                      </p>
                    </li>
                  );
                })}
              </ul>
              <figcaption className="px-4 py-2">
                Messages by screen size
              </figcaption>
            </figure>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl">Version</h2>

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
        </section>
      </main>
    </>
  );
}
