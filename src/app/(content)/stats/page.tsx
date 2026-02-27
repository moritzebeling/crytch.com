import { PageHeader } from '@/components/layout';
import {
  BarChart,
  SegmentBar,
  StackedColumnChart,
  StatNumbers,
  StatSection,
  StyleSwatchGrid,
  MessagesList,
  type AnnualLanguageStats,
  type GroupedCount,
  type MonthStats,
  type StatsData,
  type TopStyleCombination,
  type MessageDetails,
} from '@/components/stats';
import { db, messages } from '@/lib/db';
import { asc, count, desc, sql } from 'drizzle-orm';

export const metadata = {
  title: 'Stats - Crytch',
  description: 'Simple message statistics for Crytch.',
};

async function getStats(): Promise<StatsData> {
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
    recentMessages,
  ] = await Promise.all([
    db.select({ total: count() }).from(messages),
    db
      .select({ total: count() })
      .from(messages)
      .where(
        sql`${createdAtEpoch} >= cast(strftime('%s', 'now', '-6 months') as integer)`,
      ),
    db
      .select({
        total: sql<number>`coalesce(sum(coalesce(${messages.viewCount}, 0)), 0)`,
      })
      .from(messages)
      .where(
        sql`${createdAtEpoch} >= cast(strftime('%s', 'now', '-6 months') as integer)`,
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
        asc(sql`coalesce(${messages.language}, 'unknown')`),
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
        asc(messages.messageUrl),
      )
      .limit(10),
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
        asc(styleStrokeValue),
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
      `,
      )
      .orderBy(desc(count())),
    process.env.NODE_ENV === 'development'
      ? db
          .select({
            url: messages.messageUrl,
            views: sql<number>`coalesce(${messages.viewCount}, 0)`,
            date: sql<string>`strftime('%Y-%m-%d', ${createdAtEpoch}, 'unixepoch')`,
          })
          .from(messages)
          .orderBy(desc(createdAtEpoch))
          .limit(10)
      : Promise.resolve([]),
  ]);

  const languageByYearMap = new Map<string, GroupedCount[]>();
  const languageTotals = new Map<string, number>();
  for (const row of languageByYear as AnnualLanguageStats[]) {
    languageTotals.set(
      row.language,
      (languageTotals.get(row.language) ?? 0) + row.total,
    );
    const rows = languageByYearMap.get(row.year) ?? [];
    rows.push({ key: row.language, total: row.total });
    languageByYearMap.set(row.year, rows);
  }

  const languageRank = new Map(
    Array.from(languageTotals.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([language], index) => [language, index]),
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
            a.key.localeCompare(b.key),
        ),
      ] as [string, GroupedCount[]],
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
    topViewedMessages: topViewedMessages as MessageDetails[],
    topStyleCombinations: topStyleCombinations as TopStyleCombination[],
    canvasWidthBuckets: canvasWidthBuckets as GroupedCount[],
    recentMessages: recentMessages as MessageDetails[],
  };
}

export default async function StatsPage() {
  const stats = await getStats();
  const safeTotalMessages = stats.totalMessages || 1;
  const pct = (value: number) => ((value / safeTotalMessages) * 100).toFixed(1);

  const topStyleCells = Array.from(
    { length: 6 },
    (_, i) => stats.topStyleCombinations[i] ?? null,
  );

  const weekdayOrder = ['1', '2', '3', '4', '5', '6', '0'];
  const weekdayLabels: Record<string, string> = {
    '0': 'Sun',
    '1': 'Mon',
    '2': 'Tue',
    '3': 'Wed',
    '4': 'Thu',
    '5': 'Fri',
    '6': 'Sat',
  };
  const weekdayMap = new Map(
    stats.messagesByWeekday.map((item) => [item.key, item.total]),
  );
  const orderedWeekdays = weekdayOrder.map((key) => ({
    key,
    total: weekdayMap.get(key) ?? 0,
  }));

  const maxYearCount = Math.max(
    ...stats.messagesByMonth.map((i) => i.total),
    1,
  );
  const maxYearViews = Math.max(
    ...stats.messagesByMonth.map((i) => i.views),
    1,
  );
  const maxWeekdayCount = Math.max(...orderedWeekdays.map((i) => i.total), 1);
  const maxHourCount = Math.max(...stats.messagesByHour.map((i) => i.total), 1);

  return (
    <>
      <PageHeader title="Crytch" subtitle="Stats" />

      <main className="p-6 space-y-16">
        <StatSection title="Recent activity">
          <StatNumbers
            items={[
              {
                value: stats.messagesLast6Months,
                label: 'New messages in last 6 months',
              },
              {
                value: stats.viewsLast6Months,
                label: 'Views in last 6 months',
              },
            ]}
          />
        </StatSection>

        <StatSection title="Messages created">
          <StatNumbers
            items={[{ value: stats.totalMessages, label: 'Total messages' }]}
          />
          {stats.messagesByMonth.length > 0 && (
            <BarChart
              items={stats.messagesByMonth.map((item) => ({
                key: item.key,
                percent: ((item.total / maxYearCount) * 100).toFixed(1),
                lines: [item.key, String(item.total)],
              }))}
              height="h-120"
              caption="Messages per year"
              labelClassName="px-4 py-2 flex flex-col font-size-6 relative z-10"
            />
          )}
          {process.env.NODE_ENV === 'development' &&
            stats.recentMessages.length > 0 && (
              <MessagesList
                label={`Last ${stats.recentMessages.length} created messages`}
                messages={stats.recentMessages}
              />
            )}
        </StatSection>

        <StatSection title="Messages viewed">
          <StatNumbers
            items={[
              { value: stats.totalViews, label: 'Total views' },
              {
                value: (stats.totalViews / safeTotalMessages).toFixed(1),
                label: 'Average views per message',
              },
            ]}
          />
          {stats.messagesByMonth.length > 0 && (
            <BarChart
              items={stats.messagesByMonth.map((item) => ({
                key: item.key,
                percent: ((item.views / maxYearViews) * 100).toFixed(1),
                lines: [
                  item.key,
                  String(item.views),
                  item.total > 0 ? (item.views / item.total).toFixed(1) : '0',
                ],
              }))}
              height="h-120"
              caption="Views per year"
              labelClassName="px-4 py-2 flex flex-col font-size-6 relative z-10"
            />
          )}
          {stats.topViewedMessages.length > 0 && (
            <MessagesList
              label={`Top ${stats.topViewedMessages.length} viewed messages`}
              messages={stats.topViewedMessages}
            />
          )}
        </StatSection>

        <StatSection title="Usage time">
          {orderedWeekdays.length > 0 && (
            <BarChart
              items={orderedWeekdays.map((item) => ({
                key: item.key,
                percent: ((item.total / maxWeekdayCount) * 100).toFixed(1),
                lines: [
                  weekdayLabels[item.key] ?? item.key,
                  String(item.total),
                ],
              }))}
              height="h-72"
              caption="Messages by weekday"
              labelClassName="px-4 py-2 flex flex-col h-full relative z-10"
            />
          )}
          {stats.messagesByHour.length > 0 && (
            <BarChart
              items={stats.messagesByHour.map((item) => ({
                key: item.key,
                percent: ((item.total / maxHourCount) * 100).toFixed(1),
                lines: [item.key, String(item.total)],
              }))}
              height="h-72"
              caption="Messages by hour"
              labelClassName="p-2 text-center flex flex-col h-full relative z-10"
            />
          )}
        </StatSection>

        <StatSection title="Language">
          {stats.messagesByLanguage.length > 0 && (
            <SegmentBar
              items={stats.messagesByLanguage.map((item) => ({
                key: item.key,
                label: item.key,
                total: item.total,
                percent: pct(item.total),
              }))}
              caption="Messages by language"
            />
          )}
          {stats.languageByYear.length > 0 && (
            <StackedColumnChart
              columns={stats.languageByYear.map(([year, rows]) => ({
                key: year,
                rows,
              }))}
              caption="Languages by year"
            />
          )}
        </StatSection>

        <StatSection title="Display">
          {stats.topStyleCombinations.length > 0 && (
            <StyleSwatchGrid cells={topStyleCells} pct={pct} />
          )}
          {stats.canvasWidthBuckets.length > 0 && (
            <SegmentBar
              items={stats.canvasWidthBuckets.map((item) => ({
                key: item.key,
                label: item.key,
                total: item.total,
                percent: pct(item.total),
              }))}
              caption="Messages by screen size"
              hoverMinWidth="100px"
              contentClassName="whitespace-nowrap break-keep"
            />
          )}
        </StatSection>

        <StatSection title="Version">
          {stats.messagesByVersion.length > 0 && (
            <SegmentBar
              items={stats.messagesByVersion.map((item) => ({
                key: item.key,
                label: `v${item.key}`,
                total: item.total,
                percent: pct(item.total),
              }))}
              caption="Messages by version"
            />
          )}
        </StatSection>
      </main>
    </>
  );
}
