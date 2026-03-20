"use client";

import { AppHeader } from "@/components/AppHeader";
import { ControlPanel } from "@/components/ControlPanel";
import { ForecastChart } from "@/components/ForecastChart";
import { MetricsBar } from "@/components/MetricsBar";
import { QuickSelectBar } from "@/components/QuickSelectorBar";
import { ErrorMessage, LoadingSpinner } from "@/components/StatusStates";
import { useForecastData } from "@/hooks/useForecastData";
import { makeHistoricalWindow } from "@/lib/dateUtils";
import { useCallback, useState } from "react";

const INITIAL = makeHistoricalWindow(24);
const DEFAULT_HORIZON = 4;

export default function Home() {
	const [startTime, setStartTime] = useState(INITIAL.start);
	const [endTime, setEndTime] = useState(INITIAL.end);
	const [horizonHours, setHorizonHours] = useState(DEFAULT_HORIZON);

	const [appliedStart, setAppliedStart] = useState(INITIAL.start);
	const [appliedEnd, setAppliedEnd] = useState(INITIAL.end);
	const [appliedHorizon, setAppliedHorizon] = useState(DEFAULT_HORIZON);

	const handleFetch = useCallback(() => {
		setAppliedStart(startTime);
		setAppliedEnd(endTime);
		setAppliedHorizon(horizonHours);
	}, [startTime, endTime, horizonHours]);

	const { chartData, isLoading, error, metrics } = useForecastData(
		appliedStart,
		appliedEnd,
		appliedHorizon,
	);

	const applyPreset = useCallback(
		(hours: number) => {
			const { start, end } = makeHistoricalWindow(hours);
			setStartTime(start);
			setEndTime(end);
			setAppliedStart(start);
			setAppliedEnd(end);
			setAppliedHorizon(horizonHours);
		},
		[horizonHours],
	);

	return (
		<div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
			<AppHeader />

			<QuickSelectBar isLoading={isLoading} onSelect={applyPreset} />

			<section className="mb-5">
				<ControlPanel
					startTime={startTime}
					endTime={endTime}
					horizonHours={horizonHours}
					isLoading={isLoading}
					onStartChange={setStartTime}
					onEndChange={setEndTime}
					onHorizonChange={setHorizonHours}
					onFetch={handleFetch}
				/>
			</section>

			{metrics && (
				<section className="mb-5">
					<MetricsBar metrics={metrics} />
				</section>
			)}

			<section>
				{isLoading ? (
					<LoadingSpinner />
				) : error ? (
					<ErrorMessage message={error} onRetry={handleFetch} />
				) : (
					<ForecastChart data={chartData} />
				)}
			</section>
		</div>
	);
}
