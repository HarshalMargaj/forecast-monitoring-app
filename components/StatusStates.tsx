export function LoadingSpinner() {
	return (
		<div className="flex h-80 flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-slate-50">
			<div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
			<p className="text-sm text-slate-500">
				Fetching wind generation data…
			</p>
		</div>
	);
}

interface ErrorMessageProps {
	message: string;
	onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
	return (
		<div className="flex h-80 flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-red-50">
			<svg
				className="h-8 w-8 text-red-400"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
				/>
			</svg>
			<p className="max-w-xs text-center text-sm text-red-600">
				{message}
			</p>
			{onRetry && (
				<button
					onClick={onRetry}
					className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700"
				>
					Retry
				</button>
			)}
		</div>
	);
}
