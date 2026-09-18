/**
 * Safe parsing for the date strings the MythStride API hands the website.
 *
 * ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
 *
 * The run history endpoint currently projects `DataFim.ToString("yyyy-MM-dd")`,
 * so a plain calendar date is what arrives today. The dashboard relied on that
 * by building `new Date(`${value}T00:00:00`)`, which is correct for that one
 * shape and silently catastrophic for any other: a full ISO timestamp becomes
 * `2026-09-18T00:00:00.000ZT00:00:00`, `Date` yields `Invalid Date`, and
 * `Intl.DateTimeFormat.format` throws a `RangeError` that takes the whole page
 * down with it — there is no error boundary between it and the route.
 *
 * ── THE TWO SHAPES, AND WHY THEY ARE READ DIFFERENTLY ───────────────────────
 *
 * `YYYY-MM-DD` is a calendar date, not an instant. Handing it to `new Date()`
 * makes it UTC midnight, which renders as the *previous* day for anyone west
 * of Greenwich. It is built from its parts instead, giving local midnight, so
 * the day the API named is the day the reader sees. This is exactly what the
 * old `T00:00:00` suffix achieved, so nothing already on screen moves.
 *
 * A full ISO timestamp *is* an instant, so it is parsed as one and rendered in
 * the reader's own timezone, which is the ordinary convention.
 */

/** `YYYY-MM-DD` and nothing else — anchored so `2026-09-18T10:00Z` misses. */
const CALENDAR_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Turns an API date string into a `Date`, or `null` when it cannot be trusted.
 *
 * Returning `null` rather than an `Invalid Date` is the point: every caller has
 * to decide what to show, and none of them can accidentally pass a broken date
 * to a formatter that throws.
 */
export function parseApiDate(value: string | null | undefined): Date | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (trimmed === "") return null;

  const calendarDate = CALENDAR_DATE.exec(trimmed);

  if (calendarDate) {
    const year = Number(calendarDate[1]);
    const month = Number(calendarDate[2]);
    const day = Number(calendarDate[3]);

    // `new Date(2026, 12, 32)` rolls over instead of failing, so the parts are
    // checked against what came back rather than trusted.
    const date = new Date(year, month - 1, day);
    const roundTrips =
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day;

    return roundTrips ? date : null;
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
