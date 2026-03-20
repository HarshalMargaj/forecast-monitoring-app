"use client";

interface HorizonSliderProps {
	value: number;
	min?: number;
	max?: number;
	onChange: (hours: number) => void;
}

export function HorizonSlider({
	value,
	min = 1,
	max = 48,
	onChange,
}: HorizonSliderProps) {
	return (
		<div className="flex flex-col gap-1.5">
			<label className="text-sm font-medium text-slate-500">
				Forecast Horizon:{" "}
				<span className="font-semibold text-slate-800">{value}h</span>
			</label>

			<div className="flex items-center gap-2">
				<span className="text-xs text-slate-400">{min}h</span>

				<input
					type="range"
					min={min}
					max={max}
					step={1}
					value={value}
					onChange={e => onChange(Number(e.target.value))}
					className="
            h-2 flex-1 cursor-pointer appearance-none rounded-full
            bg-slate-200 accent-blue-500
            focus:outline-none focus:ring-2 focus:ring-blue-200
          "
				/>
				<span className="text-xs text-slate-400">{max}h</span>
			</div>
		</div>
	);
}
