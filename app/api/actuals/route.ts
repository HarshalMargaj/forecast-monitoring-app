import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const from = searchParams.get("from");
	const to = searchParams.get("to");

	if (!from || !to) {
		return NextResponse.json(
			{ error: "Missing required query params: from, to" },
			{ status: 400 },
		);
	}

	const upstreamUrl = `${process.env.ELEXON_BASE}/datasets/FUELHH/stream?${searchParams}`;

	try {
		const upstream = await fetch(upstreamUrl);

		if (!upstream.ok) {
			const body = await upstream.text();
			console.error(
				"[api/actuals] Upstream error:",
				upstream.status,
				body,
			);
			return NextResponse.json(
				{ error: `Upstream API error: ${upstream.status}` },
				{ status: upstream.status },
			);
		}

		const data = await upstream.json();
		console.log("actuals", data);
		return NextResponse.json(data);
	} catch (err) {
		console.error("[api/actuals] Fetch failed:", err);
		return NextResponse.json(
			{ error: "Failed to reach Elexon API" },
			{ status: 502 },
		);
	}
}
