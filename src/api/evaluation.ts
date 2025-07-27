import { Flag } from "../core/types";
import { getEvaluator } from "./configuration";

export async function isEnabled(
  flagName: string,
  subjectId: string
): Promise<boolean> {
  const evaluator = getEvaluator();
  return evaluator.isEnabled(flagName, subjectId);
}

export async function evaluate(
  flagNames: string[],
  subjectId: string
): Promise<Record<string, boolean>> {
  const evaluator = getEvaluator();
  return evaluator.evaluateBatch(flagNames, subjectId);
}

export async function getActiveFlags(subjectId: string): Promise<Flag[]> {
  const evaluator = getEvaluator();
  return evaluator.getActiveFlags(subjectId);
}
