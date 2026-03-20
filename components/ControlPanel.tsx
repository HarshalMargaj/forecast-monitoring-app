"use client";

import { DateTimePicker } from "./DateTimePicker";
import { HorizonSlider } from "./HorizonSlider";

export function isoToLocalInput(iso: string): string {
	const d = new Date(iso);
	if (isNaN(d.getTime())) return iso.slice(0, 16);

	const pad = (n: number) => String(n).padStart(2, "0");
	return (
		d.getFullYear() +
		"-" +
		pad(d.getMonth() + 1) +
		"-" +
		pad(d.getDate()) +
		"T" +
		pad(d.getHours()) +
		":" +
		pad(d.getMinutes())
	);
}

export function localInputToIso(local: string): string {
	const d = new Date(local);
	return isNaN(d.getTime()) ? `${local}:00Z` : d.toISOString();
}

interface ControlPanelProps {
	startTime: string;
	endTime: string;
	horizonHours: number;
	isLoading: boolean;
	onStartChange: (iso: string) => void;
	onEndChange: (iso: string) => void;
	onHorizonChange: (hours: number) => void;
	onFetch: () => void;
}

export function ControlPanel({
	startTime,
	endTime,
	horizonHours,
	isLoading,
	onStartChange,
	onEndChange,
	onHorizonChange,
	onFetch,
}: ControlPanelProps) {
	const MIN_DATETIME = "2025-01-01T00:00";

	return (
		<div className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
			<DateTimePicker
				label="Start Time"
				value={isoToLocalInput(startTime)}
				min={MIN_DATETIME}
				max={isoToLocalInput(endTime)}
				onChange={v => onStartChange(localInputToIso(v))}
			/>

			<DateTimePicker
				label="End Time"
				value={isoToLocalInput(endTime)}
				min={isoToLocalInput(startTime)}
				onChange={v => onEndChange(localInputToIso(v))}
			/>

			<div className="min-w-55 flex-1">
				<HorizonSlider
					value={horizonHours}
					onChange={onHorizonChange}
				/>
			</div>

			<button
				onClick={onFetch}
				disabled={isLoading}
				className="
          rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white
          shadow-sm transition-all duration-150
          hover:bg-blue-700 active:scale-95
          disabled:cursor-not-allowed disabled:opacity-60
          focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer
        "
			>
				{isLoading ? "Loading…" : "Fetch Data"}
			</button>
		</div>
	);
}
