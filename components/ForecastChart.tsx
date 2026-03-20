"use client";

import {
	ResponsiveContainer,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from "recharts";
import type { ChartDataPoint } from "@/types";

interface TooltipPayloadItem {
	name: string;
	value: number | null;
	color: string;
}

interface CustomTooltipProps {
	active?: boolean;
	payload?: TooltipPayloadItem[];
	label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
	if (!active || !payload?.length) return null;

	return (
		<div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg text-xs">
			<p className="mb-1.5 font-semibold text-slate-600">{label}</p>
			{payload.map(
				item =>
					item.value !== null && (
						<div
							key={item.name}
							className="flex items-center gap-2"
						>
							<span
								className="inline-block h-2 w-2 rounded-full"
								style={{ background: item.color }}
							/>
							<span className="text-slate-500">{item.name}:</span>
							<span className="font-semibold text-slate-800">
								{item.value.toLocaleString()} MW
							</span>
						</div>
					),
			)}
		</div>
	);
}

function makeTickFormatter(data: ChartDataPoint[], maxTicks = 10) {
	const step = Math.max(1, Math.ceil(data.length / maxTicks));
	return (_: unknown, index: number) =>
		index % step === 0 ? (data[index]?.timeLabel ?? "") : "";
}

interface ForecastChartProps {
	data: ChartDataPoint[];
}

export function ForecastChart({ data }: ForecastChartProps) {
	if (data.length === 0) {
		return (
			<div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
				<p className="text-sm text-slate-400">
					No data to display. Adjust the date range and click Fetch
					Data.
				</p>
			</div>
		);
	}

	const tickFormatter = makeTickFormatter(data);

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
			<ResponsiveContainer width="100%" height={420}>
				<LineChart
					data={data}
					margin={{ top: 8, right: 24, left: 16, bottom: 8 }}
				>
					<CartesianGrid
						strokeDasharray="3 3"
						stroke="#e2e8f0"
						vertical={false}
					/>

					<XAxis
						dataKey="timeLabel"
						tickFormatter={tickFormatter}
						tick={{ fontSize: 11, fill: "#94a3b8" }}
						axisLine={{ stroke: "#e2e8f0" }}
						tickLine={false}
						label={{
							value: "Target Time End (UTC)",
							position: "insideBottom",
							offset: -4,
							style: {
								fontSize: 12,
								fill: "#64748b",
								fontWeight: 500,
							},
						}}
						height={52}
					/>

					<YAxis
						tickFormatter={(v: number) =>
							v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
						}
						tick={{ fontSize: 11, fill: "#94a3b8" }}
						axisLine={false}
						tickLine={false}
						label={{
							value: "Power (MW)",
							angle: -90,
							position: "insideLeft",
							offset: 8,
							style: {
								fontSize: 12,
								fill: "#64748b",
								fontWeight: 500,
							},
						}}
						width={52}
					/>

					<Tooltip
						content={<CustomTooltip />}
						cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }}
					/>

					<Legend
						wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
						iconType="circle"
						iconSize={8}
					/>

					<Line
						type="monotone"
						dataKey="actual"
						name="Actual"
						stroke="#3b82f6"
						strokeWidth={2}
						dot={false}
						activeDot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
						connectNulls={false}
					/>

					<Line
						type="monotone"
						dataKey="forecast"
						name="Forecast"
						stroke="#22c55e"
						strokeWidth={2}
						dot={false}
						activeDot={{ r: 4, fill: "#22c55e", strokeWidth: 0 }}
						connectNulls={false}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
