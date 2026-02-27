export type GroupedCount = {
  key: string;
  total: number;
};

export type MonthStats = {
  key: string;
  total: number;
  views: number;
};

export type AnnualLanguageStats = {
  year: string;
  language: string;
  total: number;
};

export type MessageDetails = {
  url: string;
  views: number;
  date: string;
};

export type TopStyleCombination = {
  key: string;
  styleBackground: string;
  styleColor: string;
  styleStroke: number;
  total: number;
};

export type StatsData = {
  totalMessages: number;
  messagesLast6Months: number;
  viewsLast6Months: number;
  totalViews: number;
  messagesByMonth: MonthStats[];
  messagesByVersion: GroupedCount[];
  messagesByLanguage: GroupedCount[];
  messagesByWeekday: GroupedCount[];
  messagesByHour: GroupedCount[];
  languageByYear: Array<[string, GroupedCount[]]>;
  topViewedMessages: MessageDetails[];
  topStyleCombinations: TopStyleCombination[];
  canvasWidthBuckets: GroupedCount[];
  strokeWidths: GroupedCount[];
  recentMessages: MessageDetails[];
};
