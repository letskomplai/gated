import type { BulkOperationResult } from "../core/types";
import { getEvaluator } from "./configuration";
import { isEnabled } from "./evaluation";

export async function grantAccess(
	flagName: string,
	subjectId: string,
): Promise<void> {
	const evaluator = getEvaluator();
	return evaluator.grantAccess(flagName, subjectId);
}

export async function revokeAccess(
	flagName: string,
	subjectId: string,
): Promise<void> {
	const evaluator = getEvaluator();
	return evaluator.revokeAccess(flagName, subjectId);
}

export async function hasAccess(
	flagName: string,
	subjectId: string,
): Promise<boolean> {
	return isEnabled(flagName, subjectId);
}

export async function grantAccessBulk(
	flagName: string,
	subjectIds: string[],
): Promise<BulkOperationResult> {
	const evaluator = getEvaluator();
	return evaluator.grantAccessBulk(flagName, subjectIds);
}

export async function revokeAccessBulk(
	flagName: string,
	subjectIds: string[],
): Promise<BulkOperationResult> {
	const evaluator = getEvaluator();
	return evaluator.revokeAccessBulk(flagName, subjectIds);
}

export async function enableForAll(flagName: string): Promise<void> {
	const evaluator = getEvaluator();
	return evaluator.enableForAll(flagName);
}

export async function disableForAll(flagName: string): Promise<void> {
	const evaluator = getEvaluator();
	return evaluator.adapter.disableForAll(flagName);
}
