/**
 * German. Typed as a total map over `MessageKey`, so this file cannot drift out
 * of sync with `en` without failing the build.
 *
 * Note that plural forms are a property of the *language*, not of the key:
 * "{n} Treffer" is invariant in German while English needs "match|matches", and
 * "Tag in Folge|Tage in Folge" needs a split English does not. Either side may
 * carry a `one|other` pair independently.
 */

import type { MessageKey } from "./en.ts";

// `satisfies` rather than an annotation: it still enforces that every key is
// present, while keeping the literal values visible to the type that works out
// which messages carry a plural pair.
export const de = {
  /* ------------------------------------------------------------ common */

  "common.kinds": "{n} Sorte|{n} Sorten",
  "common.ofKinds": "von {n} Sorten",
  "common.newToYou": "neu für dich",
  "common.logPlant": "Pflanze eintragen",
  "common.mostDays": "Häufigste",
  "common.undo": "Rückgängig",
  "common.addTo": "Zu {day} hinzufügen",

  /* -------------------------------------------------------------- tabs */

  "tab.today": "Heute",
  "tab.week": "Woche",
  "tab.history": "Verlauf",
  "tab.plants": "Pflanzen",

  /* ------------------------------------------------------------ sheets */

  "sheet.targets": "Ziele",
  "sheet.close": "Schließen",

  /* ------------------------------------------------------------- today */

  "today.title": "Heute",
  "today.openTargets": "Ziele",
  "today.thisWeek": "diese Woche",
  "today.dayStreak": "Tag in Folge|Tage in Folge",
  "today.nudge": "Noch {n} Sorte bis zum Tagesziel.|Noch {n} Sorten bis zum Tagesziel.",
  "today.reached": "Tagesziel erreicht. Jede weitere Sorte zählt für die Woche.",
  "today.oneTap": "Schnellauswahl",
  "today.listTitle": "Heute gegessen",
  "today.empty": "Heute noch nichts eingetragen.",
  "today.startGreen": "Fang mit etwas Grünem an",
  "today.weekPeek": "{n} / {max} verschiedene Sorten",

  /* -------------------------------------------------------------- week */

  "week.prev": "Vorige Woche",
  "week.next": "Nächste Woche",
  "week.weeksAgo": "vor {n} Wochen",
  "week.daysOnTarget": "Tage am Ziel",
  "week.bestDay": "bester Tag",
  "week.fill": "Fülle die {n}",
  "week.toGo": "noch {n}",
  "week.eachDay": "Jeder Tag",
  "week.targetKinds": "Ziel {n} Sorten",
  "week.nothingLogged": "Nichts eingetragen.",
  "week.firstTime": "Neu diese Woche",
  "week.empty": "Diese Woche noch nichts eingetragen.",
  "week.logFirst": "Das erste eintragen",

  /* ----------------------------------------------------------- history */

  "history.title": "Verlauf",
  "history.empty":
    "Noch nichts eingetragen. Sobald du anfängst, landet hier jeder Tag und jede Woche.",
  "history.allTime": "Insgesamt",
  "history.daysLogged": "Tag erfasst|Tage erfasst",
  "history.dayStreak": "Tag in Folge|Tage in Folge",
  "history.tried": "Verschiedene Sorten probiert",
  "history.triedAria": "Probierte Sorten",
  "history.modeDays": "Tage",
  "history.modeWeeks": "Wochen",
  "history.newCount": "{n} neu",
  "history.addToDay": "Zu diesem Tag hinzufügen",
  "history.weekKinds": "{n} / {max} Sorten",
  "history.onTarget": "{n}/7 am Ziel",
  "history.best": "max. {n}",

  /* --------------------------------------------------------- catalogue */

  "catalog.title": "Pflanzen",
  "catalog.filters": "Kategoriefilter",
  "catalog.ofTried": "von {n} probiert",
  "catalog.hintNone": "Tippe eine an, um sie zum ersten Mal zu probieren.",
  "catalog.hintAll": "Alle probiert. Nichts mehr zu entdecken.",
  "catalog.hintSome": "{n} noch nicht probiert — eine neue pro Woche sind 52 im Jahr.",
  "catalog.search": "{n} Sorten durchsuchen",
  "catalog.searchAria": "Pflanzen suchen",
  "catalog.clearSearch": "Suche löschen",
  "catalog.filterGroup": "Nach Kategorie filtern",
  "catalog.all": "Alle",
  "catalog.matches": "{n} Treffer",
  "catalog.matchesIn": "{count} in {category}",
  "catalog.emptyInCategory": "Nichts in {category} passt zu „{query}“.",
  "catalog.clearFilters": "Filter zurücksetzen",
  "catalog.emptyQuery": "Nichts im Katalog passt zu „{query}“.",
  "catalog.emptyFilters": "Mit diesen Filtern bleibt nichts übrig.",

  /* ------------------------------------------------------------ picker */

  "picker.tally": "{count} auf der Liste · tippen zum Hinzufügen oder Entfernen",
  "picker.again": "Nochmal",
  "picker.regulars": "Deine Klassiker",
  "picker.clear": "Löschen",
  "picker.allUntried": "Alle {n} · {untried} noch nicht probiert",
  "picker.noMatch": "Nichts passt zu „{query}“.",
  "picker.new": "neu",

  /* ----------------------------------------------------- plant actions */

  "plant.onList": "{name}, heute auf der Liste",
  "plant.tapAdd": "{name}, tippen zum Hinzufügen",
  "plant.triedTapAdd": "{name}, schon probiert, tippen zum Hinzufügen",
  "plant.remove": "{name} entfernen",

  /* ------------------------------------------------------------ toasts */

  "toast.removed": "{name} entfernt",
  "toast.addedToday": "{name} zu heute hinzugefügt",
  "toast.removedToday": "{name} von heute entfernt",
  "toast.erased": "Alle Einträge gelöscht",

  /* ---------------------------------------------------------- settings */

  "settings.dailyVariety": "Tagesvielfalt",
  "settings.dailyVarietyHint": "Verschiedene Sorten pro Tag",
  "settings.weeklyVariety": "Wochenvielfalt",
  "settings.weeklyVarietyHint": "Verschiedene Sorten pro Woche",
  "settings.fewerPerDay": "Weniger pro Tag",
  "settings.morePerDay": "Mehr pro Tag",
  "settings.fewerPerWeek": "Weniger pro Woche",
  "settings.morePerWeek": "Mehr pro Woche",
  "settings.language": "Sprache",
  "settings.languageHint": "Oberfläche und Pflanzennamen",
  "settings.erase": "{n} Einträge löschen",
  "settings.eraseArmed": "Nochmal tippen, um alles zu löschen",
  "settings.privacy": "Alles bleibt auf diesem Gerät — kein Konto, kein Upload, offline nutzbar.",

  /* -------------------------------------------------------------- date */

  "date.today": "Heute",
  "date.yesterday": "Gestern",
  "date.todayCasual": "heute",
  "date.yesterdayCasual": "gestern",
  "date.thisWeek": "Diese Woche",
  "date.lastWeek": "Letzte Woche",
  "date.weekdays": "Mo|Di|Mi|Do|Fr|Sa|So",
  "date.months": "Jan|Feb|Mär|Apr|Mai|Jun|Jul|Aug|Sep|Okt|Nov|Dez",
  "date.dayMonth": "{day}. {month}",
  "date.dayOnly": "{day}.",
  "date.weekdayDate": "{weekday} {date}",

  /* -------------------------------------------------------- categories */

  "cat.leafy": "Blattgemüse",
  "cat.brassica": "Kohl",
  "cat.herb": "Kräuter",
  "cat.sprout": "Sprossen",
  "cat.root": "Wurzeln",
  "cat.tuber": "Knollen",
  "cat.allium": "Zwiebeln",
  "cat.fruiting": "Fruchtgemüse",
  "cat.legume": "Hülsenfrüchte",
  "cat.squash": "Kürbis",
  "cat.stem": "Stiele",
  "cat.mushroom": "Pilze",
  "cat.sea": "Algen",
  "cat.nut": "Nüsse",
  "cat.seed": "Saaten",
  "cat.spice": "Gewürze",
} as const satisfies Record<MessageKey, string>;
