"use client";

const PRESETS = [
	{ label: "Last 12h", hours: 12 },
	{ label: "Last 24h", hours: 24 },
	{ label: "Last 48h", hours: 48 },
	{ label: "Last 3d", hours: 72 },
] as const;

interface QuickSelectBarProps {
	isLoading: boolean;
	onSelect: (hours: number) => void;
}

export function QuickSelectBar({ isLoading, onSelect }: QuickSelectBarProps) {
	return (
		<div className="mb-3 flex flex-wrap items-center gap-2">
			<span className="text-xs font-medium uppercase tracking-wide text-slate-400">
				Quick select:
			</span>

			{PRESETS.map(({ label, hours }) => (
				<button
					key={label}
					onClick={() => onSelect(hours)}
					disabled={isLoading}
					className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
				>
					{label}
				</button>
			))}

			<span className="ml-auto hidden text-xs text-slate-400 sm:block">
				Max range: 7 days
			</span>
		</div>
	);
}
