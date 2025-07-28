import type { Flag } from "../core/types";
import { getEvaluator } from "./configuration";

export async function createFlag(name: string): Promise<Flag> {
	const evaluator = getEvaluator();
	return evaluator.createFlag(name);
}

export async function deleteFlag(name: string): Promise<void> {
	const evaluator = getEvaluator();
	return evaluator.deleteFlag(name);
}

export async function listFlags(): Promise<Flag[]> {
	const evaluator = getEvaluator();
	return evaluator.listFlags();
}

export async function getFlag(name: string): Promise<Flag | null> {
	const evaluator = getEvaluator();
	return evaluator.adapter.getFlag(name);
}
