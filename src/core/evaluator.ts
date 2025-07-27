import { DatabaseAdapter } from "../adapters/base";
import { BulkOperationResult, Flag } from "./types";

export class FlagEvaluator {
  constructor(public readonly adapter: DatabaseAdapter) {}

  async isEnabled(flagName: string, subjectId: string): Promise<boolean> {
    return this.adapter.isEnabled(flagName, subjectId);
  }

  async evaluateBatch(
    flagNames: string[],
    subjectId: string
  ): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    await Promise.all(
      flagNames.map(async (flagName) => {
        results[flagName] = await this.isEnabled(flagName, subjectId);
      })
    );

    return results;
  }

  async grantAccess(flagName: string, subjectId: string): Promise<void> {
    return this.adapter.grantAccess(flagName, subjectId);
  }

  async revokeAccess(flagName: string, subjectId: string): Promise<void> {
    return this.adapter.revokeAccess(flagName, subjectId);
  }

  async grantAccessBulk(
    flagName: string,
    subjectIds: string[]
  ): Promise<BulkOperationResult> {
    return this.adapter.grantAccessBulk(flagName, subjectIds);
  }

  async revokeAccessBulk(
    flagName: string,
    subjectIds: string[]
  ): Promise<BulkOperationResult> {
    return this.adapter.revokeAccessBulk(flagName, subjectIds);
  }

  async enableForAll(flagName: string): Promise<void> {
    return this.adapter.enableForAll(flagName);
  }

  async createFlag(name: string): Promise<Flag> {
    return this.adapter.createFlag(name);
  }

  async deleteFlag(name: string): Promise<void> {
    return this.adapter.deleteFlag(name);
  }

  async listFlags(): Promise<Flag[]> {
    return this.adapter.listFlags();
  }

  async getActiveFlags(subjectId: string): Promise<Flag[]> {
    return this.adapter.getActiveFlags(subjectId);
  }
}
