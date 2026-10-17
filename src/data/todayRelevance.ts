// Today previews include ongoing items and starts through 30 Manila dates ahead.
// The Calendar retains its unrestricted future view.
export const todayUpcomingDays = 30;

export const startsWithinTodayWindow = (value: string, now = new Date()) => {
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
  const horizon = Date.parse(today + 'T00:00:00Z') + todayUpcomingDays * 86400000;
  return Date.parse(value.slice(0, 10) + 'T00:00:00Z') <= horizon;
};

export const latestSubstantiveBrief = <T extends {
  publishedAt: string; periodEnd: string; recordIds: string[];
}>(briefs: readonly T[], now = new Date()): T | null =>
  briefs.filter(brief =>
    Array.isArray(brief.recordIds) && brief.recordIds.length > 0 &&
    Number.isFinite(Date.parse(brief.periodEnd)) &&
    Number.isFinite(Date.parse(brief.publishedAt)) &&
    Date.parse(brief.publishedAt) <= now.getTime()
  ).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))[0] ?? null;
