import type { ActualRecord, ForecastRecord } from "@/types";

const MIN_TIMESTAMP = new Date("2025-01-01T00:00:00Z").getTime();
const THIRTY_MIN_MS = 30 * 60 * 1000;

function snap30(ms: number): number {
	return Math.floor(ms / THIRTY_MIN_MS) * THIRTY_MIN_MS;
}

export function buildActualsMap(records: ActualRecord[]): Map<number, number> {
	const map = new Map<number, number>();

	for (const record of records) {
		if (record.fuelType !== "WIND") continue;

		const raw = new Date(record.startTime).getTime();
		if (isNaN(raw) || raw < MIN_TIMESTAMP) continue;

		const ts = snap30(raw);
		map.set(ts, record.generation);
	}

	return map;
}

export function buildForecastsMap(
	records: ForecastRecord[],
	horizonHours: number,
	rangeFromMs: number,
	rangeToMs: number,
): Map<number, number> {
	const horizonMs = horizonHours * 60 * 60 * 1000;

	const best = new Map<number, { publishTs: number; generation: number }>();

	for (const record of records) {
		const rawTarget = new Date(record.startTime).getTime();
		const rawPublish = new Date(record.publishTime).getTime();

		if (isNaN(rawTarget) || isNaN(rawPublish)) continue;
		if (rawTarget < MIN_TIMESTAMP) continue;

		const targetTs = snap30(rawTarget);
		const publishTs = snap30(rawPublish);

		// Only keep target times within the user's selected window
		if (targetTs < rangeFromMs || targetTs > rangeToMs) continue;

		const diff = targetTs - publishTs;

		if (diff < horizonMs) continue;

		const existing = best.get(targetTs);
		if (!existing || publishTs > existing.publishTs) {
			best.set(targetTs, { publishTs, generation: record.generation });
		}
	}

	const result = new Map<number, number>();
	for (const [ts, { generation }] of best) {
		result.set(ts, generation);
	}
	return result;
}
