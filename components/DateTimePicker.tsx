"use client";

interface DateTimePickerProps {
	label: string;
	value: string;
	min?: string;
	max?: string;
	onChange: (value: string) => void;
}

export function DateTimePicker({
	label,
	value,
	min,
	max,
	onChange,
}: DateTimePickerProps) {
	return (
		<div className="flex flex-col gap-1.5">
			<label className="text-sm font-medium text-slate-500">
				{label}
			</label>
			<input
				type="datetime-local"
				value={value}
				min={min}
				max={max}
				onChange={e => onChange(e.target.value)}
				className="
          rounded-lg border border-slate-200 bg-white px-3 py-2
          text-sm text-slate-800 shadow-sm outline-none
          transition-all duration-150
          focus:border-blue-400 focus:ring-2 focus:ring-blue-100
          hover:border-slate-300
          cursor-pointer
        "
			/>
		</div>
	);
}
