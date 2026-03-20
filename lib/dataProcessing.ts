import type { ActualRecord, ChartDataPoint, ForecastRecord } from "@/types";
import { format } from "date-fns";

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

export function mergeToChartData(
	actualsMap: Map<number, number>,
	forecastsMap: Map<number, number>,
): ChartDataPoint[] {
	const allTs = new Set([...actualsMap.keys(), ...forecastsMap.keys()]);
	const sorted = Array.from(allTs).sort((a, b) => a - b);

	return sorted.map(ts => ({
		timestamp: ts,
		timeLabel: format(new Date(ts), "dd/MM/yy HH:mm"),
		actual: actualsMap.get(ts) ?? null,
		forecast: forecastsMap.get(ts) ?? null,
	}));
}

export interface AccuracyMetrics {
	actualPoints: number;
	forecastPoints: number;
	matchedPoints: number;
	mae: number | null;
	rmse: number | null;
}

export function computeMetrics(data: ChartDataPoint[]): AccuracyMetrics {
	const actualPoints = data.filter(d => d.actual !== null).length;
	const forecastPoints = data.filter(d => d.forecast !== null).length;
	const matched = data.filter(d => d.actual !== null && d.forecast !== null);

	if (matched.length === 0) {
		return {
			actualPoints,
			forecastPoints,
			matchedPoints: 0,
			mae: null,
			rmse: null,
		};
	}

	const errors = matched.map(d => Math.abs(d.actual! - d.forecast!));
	const squaredErrors = matched.map(d => (d.actual! - d.forecast!) ** 2);

	const mae = errors.reduce((s, e) => s + e, 0) / errors.length;
	const rmse = Math.sqrt(
		squaredErrors.reduce((s, e) => s + e, 0) / squaredErrors.length,
	);

	return {
		actualPoints,
		forecastPoints,
		matchedPoints: matched.length,
		mae: Math.round(mae),
		rmse: Math.round(rmse),
	};
}
