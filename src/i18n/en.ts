/**
 * The English catalogue, and the source of truth for what keys exist: `de` is
 * typed as a total map over these, so a missing translation is a build error
 * rather than a key echoed at the user.
 *
 * Conventions
 * - `{name}` placeholders interpolate; `one|other` picks on `n`.
 * - Keys read screen-first (`week.bestDay`), except `common.*`, which is for
 *   wording that genuinely appears on more than one screen. Duplicating a
 *   string is better than a shared key two screens later disagree about.
 */

export const en = {
  /* ------------------------------------------------------------ common */

  /** The unit the whole app counts in. */
  "common.kinds": "{n} kind|{n} kinds",
  "common.ofKinds": "of {n} kinds",
  "common.newToYou": "new to you",
  "common.logPlant": "Log a plant",
  "common.mostDays": "Most days",
  "common.undo": "Undo",
  /** `{day}` arrives already cased for mid-sentence use. */
  "common.addTo": "Add to {day}",

  /* -------------------------------------------------------------- tabs */

  "tab.today": "Today",
  "tab.week": "Week",
  "tab.history": "History",
  "tab.plants": "Plants",

  /* ------------------------------------------------------------ sheets */

  "sheet.targets": "Targets",
  "sheet.close": "Close",

  /* ------------------------------------------------------------- today */

  "today.title": "Today",
  "today.openTargets": "Targets",
  "today.thisWeek": "this week",
  "today.dayStreak": "day streak",
  "today.nudge": "{n} more kind to reach today's target.|{n} more kinds to reach today's target.",
  "today.reached": "Daily variety reached. Every extra kind still counts for the week.",
  "today.oneTap": "One tap",
  "today.listTitle": "Today's list",
  "today.empty": "Nothing logged yet today.",
  "today.startGreen": "Start with something green",
  "today.weekPeek": "{n} / {max} different plants",

  /* -------------------------------------------------------------- week */

  "week.prev": "Previous week",
  "week.next": "Next week",
  "week.weeksAgo": "{n} weeks ago",
  "week.daysOnTarget": "days on target",
  "week.bestDay": "best day",
  "week.fill": "Fill the {n}",
  "week.toGo": "{n} to go",
  "week.eachDay": "Each day",
  "week.targetKinds": "target {n} kinds",
  "week.nothingLogged": "Nothing logged.",
  "week.firstTime": "First time this week",
  "week.empty": "Nothing logged this week.",
  "week.logFirst": "Log the first one",

  /* ----------------------------------------------------------- history */

  "history.title": "History",
  "history.empty": "Nothing logged yet. Once you start, every day and week lands here.",
  "history.allTime": "All time",
  /** Rendered beside a styled count, so the number is not in the message. */
  "history.daysLogged": "day logged|days logged",
  "history.dayStreak": "day streak",
  "history.tried": "Different plants tried",
  "history.triedAria": "Plants tried",
  "history.modeDays": "Days",
  "history.modeWeeks": "Weeks",
  "history.newCount": "{n} new",
  "history.addToDay": "Add to this day",
  "history.weekKinds": "{n} / {max} kinds",
  "history.onTarget": "{n}/7 on target",
  "history.best": "best {n}",

  /* --------------------------------------------------------- catalogue */

  "catalog.title": "Plants",
  "catalog.filters": "Category filters",
  "catalog.ofTried": "of {n} tried",
  "catalog.hintNone": "Tap any one of them to log a first taste.",
  "catalog.hintAll": "Every single one tried. Nothing left to discover.",
  "catalog.hintSome": "{n} still untried — one new pick a week is 52 a year.",
  "catalog.search": "Search {n} plants",
  "catalog.searchAria": "Search plants",
  "catalog.clearSearch": "Clear search",
  "catalog.filterGroup": "Filter by category",
  "catalog.all": "All",
  "catalog.matches": "{n} match|{n} matches",
  "catalog.matchesIn": "{count} in {category}",
  "catalog.emptyInCategory": "Nothing in {category} matches “{query}”.",
  "catalog.clearFilters": "Clear filters",
  "catalog.emptyQuery": "Nothing in the catalogue matches “{query}”.",
  "catalog.emptyFilters": "Nothing is left once these filters are applied.",

  /* ------------------------------------------------------------ picker */

  "picker.tally": "{count} on the list · tap to add or remove",
  "picker.again": "Again",
  "picker.regulars": "Your regulars",
  "picker.clear": "Clear",
  "picker.allUntried": "All {n} · {untried} still untried",
  "picker.noMatch": "Nothing matches “{query}”.",
  "picker.new": "new",

  /* ----------------------------------------------------- plant actions */

  "plant.onList": "{name}, on today's list",
  "plant.tapAdd": "{name}, tap to add to today",
  "plant.triedTapAdd": "{name}, already tried, tap to add to today",
  "plant.remove": "Remove {name}",

  /* ------------------------------------------------------------ toasts */

  "toast.removed": "{name} removed",
  "toast.addedToday": "{name} added to today",
  "toast.removedToday": "{name} removed from today",
  "toast.erased": "All entries erased",

  /* ---------------------------------------------------------- settings */

  "settings.dailyVariety": "Daily variety",
  "settings.dailyVarietyHint": "Different plants per day",
  "settings.weeklyVariety": "Weekly variety",
  "settings.weeklyVarietyHint": "Different plants per week",
  "settings.fewerPerDay": "Fewer per day",
  "settings.morePerDay": "More per day",
  "settings.fewerPerWeek": "Fewer per week",
  "settings.morePerWeek": "More per week",
  "settings.language": "Language",
  "settings.languageHint": "Interface and plant names",
  "settings.erase": "Erase {n} entries",
  "settings.eraseArmed": "Tap again to erase everything",
  "settings.privacy": "Everything stays on this device — no account, no upload, works offline.",

  /* -------------------------------------------------------------- date */

  "date.today": "Today",
  "date.yesterday": "Yesterday",
  /** Lowercase forms for mid-sentence use, e.g. "Add to today". */
  "date.todayCasual": "today",
  "date.yesterdayCasual": "yesterday",
  "date.thisWeek": "This week",
  "date.lastWeek": "Last week",
  "date.weekdays": "Mon|Tue|Wed|Thu|Fri|Sat|Sun",
  "date.months": "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec",
  /** Day-and-month order and punctuation, e.g. `18 Aug` vs `18. Aug`. */
  "date.dayMonth": "{day} {month}",
  /** A day number on its own, for the start of a same-month range. */
  "date.dayOnly": "{day}",
  /** A weekday in front of a date, e.g. `Mon 18 Aug`. */
  "date.weekdayDate": "{weekday} {date}",

  /* -------------------------------------------------------- categories */

  "cat.leafy": "Leafy",
  "cat.brassica": "Brassica",
  "cat.herb": "Herb",
  "cat.sprout": "Sprout",
  "cat.root": "Root",
  "cat.tuber": "Tuber",
  "cat.allium": "Allium",
  "cat.fruiting": "Fruit veg",
  "cat.fruit": "Fruit",
  "cat.legume": "Pod & bean",
  "cat.squash": "Squash",
  "cat.stem": "Stem",
  "cat.mushroom": "Fungi",
  "cat.sea": "Sea",
  "cat.nut": "Nut",
  "cat.seed": "Seed",
  "cat.spice": "Spice",
} as const;

export type MessageKey = keyof typeof en;
