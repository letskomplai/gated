import { FlagEvaluator } from "../core/evaluator";
import type { GatedConfig } from "../core/types";

let globalEvaluator: FlagEvaluator | null = null;

export function configure(config: GatedConfig): void {
	const adapter = config.adapter;
	globalEvaluator = new FlagEvaluator(adapter);
}

export function getEvaluator(): FlagEvaluator {
	if (!globalEvaluator) {
		throw new Error("Gated not configured. Call configure() first.");
	}
	return globalEvaluator;
}
