import { fetchActuals, fetchForecasts } from "@/lib/api";
import {
	buildActualsMap,
	buildForecastsMap,
	computeMetrics,
	mergeToChartData,
} from "@/lib/dataProcessing";
import { ForecastDataResult } from "@/types";
import { useEffect, useRef, useState } from "react";

export function useForecastData(
	from: string,
	to: string,
	horizonHours: number,
): ForecastDataResult {
	const [result, setResult] = useState<ForecastDataResult>({
		chartData: [],
		isLoading: false,
		error: null,
		metrics: null,
	});
	const abortRef = useRef<AbortController | null>(null);

	useEffect(() => {
		if (!from || !to) return;

		abortRef.current?.abort();
		const controller = new AbortController();
		abortRef.current = controller;

		const run = async () => {
			setResult({
				chartData: [],
				isLoading: true,
				error: null,
				metrics: null,
			});
			try {
				const [actualRecords, forecastRecords] = await Promise.all([
					fetchActuals(from, to, controller.signal),
					fetchForecasts(from, to, horizonHours, controller.signal),
				]);

				if (controller.signal.aborted) return;

				const actualsMap = buildActualsMap(actualRecords);
				const forecastsMap = buildForecastsMap(
					forecastRecords,
					horizonHours,
					new Date(from).getTime(),
					new Date(to).getTime(),
				);
				const chartData = mergeToChartData(actualsMap, forecastsMap);
				const metrics = computeMetrics(chartData);
				setResult({
					chartData,
					isLoading: false,
					error: null,
					metrics,
				});
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: "An unexpected error occurred.";
				setResult({
					chartData: [],
					isLoading: false,
					error: message,
					metrics: null,
				});
			}
		};

		run();

		return () => {
			controller.abort();
		};
	}, [from, to, horizonHours]);

	return result;
}
