import type { ForecastDataResult } from "@/types";

interface MetricsBarProps {
	metrics: ForecastDataResult["metrics"];
}

function fmt(n: number | null): string {
	if (n === null) return "—";
	return `${n.toLocaleString()} MW`;
}

function MetricTile({
	label,
	value,
	color,
}: {
	label: string;
	value: string;
	color?: string;
}) {
	return (
		<div className="flex flex-col items-center gap-0.5 px-4 py-2">
			<span
				className={`text-lg font-bold tabular-nums ${color ?? "text-slate-800"}`}
			>
				{value}
			</span>
			<span className="text-xs text-slate-500">{label}</span>
		</div>
	);
}

export function MetricsBar({ metrics }: MetricsBarProps) {
	if (!metrics) return null;

	return (
		<div className="flex flex-wrap divide-x divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
			<MetricTile
				label="Actual points"
				value={metrics.actualPoints.toLocaleString()}
				color="text-blue-600"
			/>
			<MetricTile
				label="Forecast points"
				value={metrics.forecastPoints.toLocaleString()}
				color="text-green-600"
			/>
			<MetricTile
				label="Matched points"
				value={metrics.matchedPoints.toLocaleString()}
				color="text-slate-700"
			/>
			<MetricTile
				label="MAE"
				value={fmt(metrics.mae)}
				color="text-amber-600"
			/>
			<MetricTile
				label="RMSE"
				value={fmt(metrics.rmse)}
				color="text-rose-600"
			/>
		</div>
	);
}
