"use client";

import { AppHeader } from "@/components/AppHeader";
import { ControlPanel } from "@/components/ControlPanel";
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

	return (
		<div className="bg-white h-full">
			<AppHeader />
			<section className="mb-5">
				<ControlPanel
					startTime={startTime}
					endTime={endTime}
					horizonHours={horizonHours}
					isLoading={false}
					onStartChange={setStartTime}
					onEndChange={setEndTime}
					onHorizonChange={setHorizonHours}
					onFetch={handleFetch}
				/>
			</section>
		</div>
	);
}
