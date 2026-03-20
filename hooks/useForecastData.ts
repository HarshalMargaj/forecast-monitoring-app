import { fetchActuals, fetchForecasts } from "@/lib/api";
import {
	buildActualsMap,
	buildForecastsMap,
	computeMetrics,
	mergeToChartData,
} from "@/lib/dataProcessing";
import { ForecastDataResult } from "@/types";
import { useEffect, useState } from "react";

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

	useEffect(() => {
		if (!from || !to) return;

		const run = async () => {
			setResult({
				chartData: [],
				isLoading: true,
				error: null,
				metrics: null,
			});
			try {
				const [actualRecords, forecastRecords] = await Promise.all([
					fetchActuals(from, to),
					fetchForecasts(from, to, horizonHours),
				]);
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
	}, [from, to, horizonHours]);

	return result;
}
