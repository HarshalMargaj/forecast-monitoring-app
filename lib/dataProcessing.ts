import type { ActualRecord } from "@/types";

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
