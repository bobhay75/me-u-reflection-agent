export const STORY_MIN = 20;
export const STORY_MAX = 1500;
export const FIELD_MAX = 700;

export const LENSES = Object.freeze([
  { key: "me", short: "ME", title: "Notice your inner world" },
  { key: "u", short: "U", title: "Hold possibilities lightly" },
  { key: "us", short: "US", title: "Name the interaction pattern" },
  { key: "witness", short: "WITNESS", title: "Separate record from story" },
  { key: "next", short: "WHAT NEXT?", title: "Choose a safe next step" },
]);

export function emptyWorksheet() {
  return {
    story: "",
    feelings: "",
    withinControl: "",
    possibleView: "",
    sharedPattern: "",
    observation: "",
    inference: "",
    unknown: "",
    boundary: "",
    nextStep: "",
  };
}

export const DEMO_WORKSHEET = Object.freeze({
  story:
    "I sent an important message yesterday and have not received a reply. I feel ignored and want to send an angry follow-up.",
  feelings: "Hurt, anxious, and impatient.",
  withinControl:
    "I can pause, avoid treating my interpretation as a fact, and choose one calm response.",
  possibleView:
    "They could be busy, overwhelmed, unsure how to answer, or intentionally taking space. I do not know which, if any, is true.",
  sharedPattern:
    "Silence may lead to an assumption, then urgency, then a message that increases tension. This is a possible pattern, not a finding of equal responsibility.",
  observation: "I sent one message yesterday and have not received a reply.",
  inference: "They are ignoring me because they do not care.",
  unknown: "Why they have not replied and whether they saw the message.",
  boundary:
    "I need timely communication about important decisions, and I will not send repeated hostile messages.",
  nextStep:
    "Wait until this evening, then send one neutral check-in asking when they can respond.",
});

export function cleanText(value, max = FIELD_MAX) {
  return String(value ?? "")
    .normalize("NFKC")
    // Worksheet exports must not preserve invisible control payloads.
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[\u202A-\u202E\u2066-\u2069]/g, "")
    .slice(0, max)
    .trim();
}

export function completedLensCount(worksheet) {
  const complete = [
    cleanText(worksheet.feelings) && cleanText(worksheet.withinControl),
    cleanText(worksheet.possibleView),
    cleanText(worksheet.sharedPattern),
    cleanText(worksheet.observation) &&
      cleanText(worksheet.inference) &&
      cleanText(worksheet.unknown),
    cleanText(worksheet.boundary) && cleanText(worksheet.nextStep),
  ];
  return complete.filter(Boolean).length;
}

export function buildSummary(worksheet) {
  const story = cleanText(worksheet.story, STORY_MAX);
  const rows = [
    ["THE MOMENT", story],
    [
      "ME",
      joinPresent([
        ["What I notice", worksheet.feelings],
        ["Within my control", worksheet.withinControl],
      ]),
    ],
    ["U — POSSIBILITIES, NOT FACTS", cleanText(worksheet.possibleView)],
    ["US — POSSIBLE PATTERN", cleanText(worksheet.sharedPattern)],
    [
      "WITNESS",
      joinPresent([
        ["Observed", worksheet.observation],
        ["Inferred", worksheet.inference],
        ["Still unknown", worksheet.unknown],
      ]),
    ],
    [
      "WHAT NEXT",
      joinPresent([
        ["Boundary or request", worksheet.boundary],
        ["Smallest safe step", worksheet.nextStep],
      ]),
    ],
  ];

  const body = rows
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => `${label}\n${value}`)
    .join("\n\n");

  return [
    "ME+U PRIVATE REFLECTION",
    "Based only on what I entered. Events and motives were not independently verified.",
    body,
    "Safety note: If there are threats, coercion, stalking, abuse, or immediate danger, do not force shared responsibility. Prioritize safety and qualified support.",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function joinPresent(entries) {
  return entries
    .map(([label, value]) => [label, cleanText(value)])
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}
