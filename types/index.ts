export interface ActualRecord {
	startTime: string;
	fuelType: string;
	generation: number;
	[key: string]: unknown;
}

export interface ForecastRecord {
	startTime: string;
	publishTime: string;
	generation: number;
	[key: string]: unknown;
}

export interface DateRange {
	from: string;
	to: string;
}

/** One x-axis tick in the Recharts dataset */
export interface ChartDataPoint {
	timestamp: number;
	timeLabel: string;
	actual: number | null;
	forecast: number | null;
}

export interface ForecastDataResult {
	chartData: ChartDataPoint[];
	isLoading: boolean;
	error: string | null;
	metrics: {
		actualPoints: number;
		forecastPoints: number;
		matchedPoints: number;
		mae: number | null;
		rmse: number | null;
	} | null;
}
