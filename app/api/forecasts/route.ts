import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const from = searchParams.get("from");
	const to = searchParams.get("to");
	const publishDateTimeFrom = searchParams.get("publishDateTimeFrom");
	const publishDateTimeTo = searchParams.get("publishDateTimeTo");

	if (!from || !to) {
		return NextResponse.json(
			{ error: "Missing required query params: from, to" },
			{ status: 400 },
		);
	}

	try {
		const allRecords: unknown[] = [];
		let page = 1;
		const pageSize = 500;

		// Paginate until we get all records
		while (true) {
			const params = new URLSearchParams({
				from,
				to,
				dataset: "WINDFOR",
				page: String(page),
				pageSize: String(pageSize),
			});
			if (publishDateTimeFrom)
				params.set("publishDateTimeFrom", publishDateTimeFrom);
			if (publishDateTimeTo)
				params.set("publishDateTimeTo", publishDateTimeTo);

			const upstreamUrl = `${process.env.ELEXON_BASE}/datasets/WINDFOR?${params}`;

			const upstream = await fetch(upstreamUrl);

			if (!upstream.ok) {
				const body = await upstream.text();
				console.error(
					"[api/forecasts] Upstream error:",
					upstream.status,
					body,
				);
				return NextResponse.json(
					{ error: `Upstream API error: ${upstream.status}` },
					{ status: upstream.status },
				);
			}

			const json = await upstream.json();
			console.log("forecasts", json);

			// Elexon paginated response: { data: [...], total: N, ... }
			const records: unknown[] = Array.isArray(json)
				? json
				: (json.data ?? []);

			allRecords.push(...records);

			// Stop if this page had fewer records than pageSize (last page)
			if (records.length < pageSize) break;

			// Safety cap: max 20 pages = 10,000 records
			if (page >= 20) break;

			page++;
		}

		return NextResponse.json(allRecords);
	} catch (err) {
		console.error("[api/forecasts] Fetch failed:", err);
		return NextResponse.json(
			{ error: "Failed to reach Elexon API" },
			{ status: 502 },
		);
	}
}
