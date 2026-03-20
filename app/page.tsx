"use client";

import { AppHeader } from "@/components/AppHeader";
import { ControlPanel } from "@/components/ControlPanel";
import { ForecastChart } from "@/components/ForecastChart";
import { MetricsBar } from "@/components/MetricsBar";
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

	return (
		<div className="bg-white h-full">
			<AppHeader />
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
