const MIN_DATE_MS = new Date("2025-01-01T00:00:00Z").getTime();

export function makeHistoricalWindow(
	durationHours: number,
	endOffsetHours = 2,
): { start: string; end: string } {
	const nowMs = Date.now();
	const endMs = nowMs - endOffsetHours * 60 * 60 * 1000;
	const startMs = endMs - durationHours * 60 * 60 * 1000;
	return {
		start: new Date(Math.max(startMs, MIN_DATE_MS)).toISOString(),
		end: new Date(endMs).toISOString(),
	};
}
