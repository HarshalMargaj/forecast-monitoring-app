import type { ActualRecord, ForecastRecord } from "@/types";

export const MIN_DATE = "2025-01-01T00:00:00Z";
export const MIN_DATE_MS = new Date(MIN_DATE).getTime();
export const MAX_RANGE_DAYS = 7;

function toElexonDate(iso: string): string {
	return iso.slice(0, 16);
}

export async function fetchActuals(
	from: string,
	to: string,
	signal?: AbortSignal,
): Promise<ActualRecord[]> {
	const clampedFrom = from < MIN_DATE ? MIN_DATE : from;
	const params = new URLSearchParams({
		from: toElexonDate(clampedFrom),
		to: toElexonDate(to),
	});
	const res = await fetch(`/api/actuals?${params}`, { signal });
	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		throw new Error(err.error ?? `Actuals API error ${res.status}`);
	}
	const data = await res.json();
	return Array.isArray(data) ? data : (data.data ?? []);
}

export async function fetchForecasts(
	from: string,
	to: string,
	horizonHours: number,
	signal?: AbortSignal,
): Promise<ForecastRecord[]> {
	const fromMs = new Date(from).getTime();
	const toMs = new Date(to).getTime();
	const horizonMs = horizonHours * 60 * 60 * 1000;
	const ms48h = 48 * 60 * 60 * 1000;

	const clampedFrom = toElexonDate(from < MIN_DATE ? MIN_DATE : from);
	const clampedTo = toElexonDate(to);

	const pubFrom = toElexonDate(
		new Date(Math.max(fromMs - ms48h, MIN_DATE_MS)).toISOString(),
	);

	const pubToA = toElexonDate(
		new Date(Math.max(fromMs - horizonMs, MIN_DATE_MS)).toISOString(),
	);
	const pubToB = toElexonDate(
		new Date(Math.max(toMs - horizonMs, MIN_DATE_MS)).toISOString(),
	);

	const fetchPage = async (
		publishDateTimeFrom: string,
		publishDateTimeTo: string,
	): Promise<ForecastRecord[]> => {
		const params = new URLSearchParams({
			from: clampedFrom,
			to: clampedTo,
			publishDateTimeFrom,
			publishDateTimeTo,
		});
		const res = await fetch(`/api/forecasts?${params}`, { signal });
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			throw new Error(err.error ?? `Forecasts API error ${res.status}`);
		}
		const data = await res.json();
		return Array.isArray(data) ? data : (data.data ?? []);
	};

	const [recordsA, recordsB] = await Promise.all([
		fetchPage(pubFrom, pubToA),
		fetchPage(pubFrom, pubToB),
	]);

	const seen = new Set<string>();
	const merged: ForecastRecord[] = [];
	for (const record of [...recordsA, ...recordsB]) {
		const key = `${record.startTime}|${record.publishTime}`;
		if (!seen.has(key)) {
			seen.add(key);
			merged.push(record);
		}
	}
	return merged;
}
