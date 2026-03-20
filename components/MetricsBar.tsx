import type { ForecastDataResult } from "@/types";

interface MetricsBarProps {
	metrics: ForecastDataResult["metrics"];
}

function fmt(n: number | null): string {
	if (n === null) return "—";
	return `${n.toLocaleString()} MW`;
}

const METRIC_TILES = (metrics: NonNullable<ForecastDataResult["metrics"]>) => [
	{
		label: "Actual points",
		value: metrics.actualPoints.toLocaleString(),
		color: "text-blue-600",
	},
	{
		label: "Forecast points",
		value: metrics.forecastPoints.toLocaleString(),
		color: "text-green-600",
	},
	{
		label: "Matched points",
		value: metrics.matchedPoints.toLocaleString(),
		color: "text-slate-700",
	},
	{ label: "MAE", value: fmt(metrics.mae), color: "text-amber-600" },
	{ label: "RMSE", value: fmt(metrics.rmse), color: "text-rose-600" },
];

export function MetricsBar({ metrics }: MetricsBarProps) {
	if (!metrics) return null;

	return (
		<div className="flex flex-wrap divide-x divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
			{METRIC_TILES(metrics).map(({ label, value, color }) => (
				<div
					key={label}
					className="flex flex-col items-center gap-0.5 px-3 py-2 sm:px-4"
				>
					<span
						className={`text-base font-bold tabular-nums sm:text-lg ${color}`}
					>
						{value}
					</span>
					<span className="text-[10px] text-slate-500 sm:text-xs">
						{label}
					</span>
				</div>
			))}
		</div>
	);
}
