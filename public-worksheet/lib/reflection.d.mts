export const STORY_MIN: number;
export const STORY_MAX: number;
export const FIELD_MAX: number;
export const LENSES: ReadonlyArray<{ key: string; short: string; title: string }>;
export function emptyWorksheet(): Record<string, string>;
export const DEMO_WORKSHEET: Readonly<Record<string, string>>;
export function cleanText(value: unknown, max?: number): string;
export function completedLensCount(worksheet: Record<string, string>): number;
export function buildSummary(worksheet: Record<string, string>): string;
