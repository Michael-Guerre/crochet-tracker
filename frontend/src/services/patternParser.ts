import type { PatternRow } from "../types/PatternRow.ts"

export function parsePattern(text: string): PatternRow[] {
	const lines = text
	.split("\n")
	.map(line => line.trim())
	.filter(line => line.length > 0);

	const rows: patternRow[] = []

	for (const line of lines) {
		const match = line.match(
			/^R(\d+):\s*(.*?)\s*\((\d+)\)$/i
		);

		if (!match) continue;
		rows.push({
		row: Number(match[1]),
		instruction: match[2],
		target: Number(match[3]),
		});
	}

	return rows;

}
