import { BulkOperationResult, Flag } from "../core/types";
import { DatabaseAdapter } from "./base";

export class MemoryAdapter extends DatabaseAdapter {
  private flags = new Map<
    string,
    {
      id: string;
      name: string;
      isActive: boolean;
      enabledForAll: boolean;
      grants: Set<string>;
      createdAt: Date;
      updatedAt: Date;
    }
  >();

  async isEnabled(flagName: string, subjectId: string): Promise<boolean> {
    const flag = this.flags.get(flagName);
    if (!flag) {
      return false;
    }
    return flag.isActive && (flag.enabledForAll || flag.grants.has(subjectId));
  }

  async grantAccess(flagName: string, subjectId: string): Promise<void> {
    const flag = this.flags.get(flagName);
    if (!flag) {
      throw new Error(`Flag ${flagName} not found`);
    }
    flag.grants.add(subjectId);
    flag.updatedAt = new Date();
  }

  async revokeAccess(flagName: string, subjectId: string): Promise<void> {
    const flag = this.flags.get(flagName);
    if (!flag) {
      throw new Error(`Flag ${flagName} not found`);
    }
    flag.grants.delete(subjectId);
    flag.updatedAt = new Date();
  }

  async grantAccessBulk(
    flagName: string,
    subjectIds: string[]
  ): Promise<BulkOperationResult> {
    const flag = this.flags.get(flagName);
    if (!flag) {
      throw new Error(`Flag ${flagName} not found`);
    }
    const successful: string[] = [];
    const failed: { subjectId: string; error: string }[] = [];
    for (const subjectId of subjectIds) {
      if (flag.grants.has(subjectId)) {
        failed.push({ subjectId, error: "Subject already has access" });
      } else {
        flag.grants.add(subjectId);
        flag.updatedAt = new Date();
        successful.push(subjectId);
      }
    }
    return { successful, failed };
  }

  async revokeAccessBulk(
    flagName: string,
    subjectIds: string[]
  ): Promise<BulkOperationResult> {
    const flag = this.flags.get(flagName);
    if (!flag) {
      throw new Error(`Flag ${flagName} not found`);
    }
    const successful: string[] = [];
    const failed: { subjectId: string; error: string }[] = [];
    for (const subjectId of subjectIds) {
      if (!flag.grants.has(subjectId)) {
        failed.push({ subjectId, error: "Subject does not have access" });
      } else {
        flag.grants.delete(subjectId);
        flag.updatedAt = new Date();
        successful.push(subjectId);
      }
    }
    return { successful, failed };
  }

  async enableForAll(flagName: string): Promise<void> {
    const flag = this.flags.get(flagName);
    if (!flag) {
      throw new Error(`Flag ${flagName} not found`);
    }
    flag.enabledForAll = true;
    flag.updatedAt = new Date();
  }

  async disableForAll(flagName: string): Promise<void> {
    const flag = this.flags.get(flagName);
    if (!flag) {
      throw new Error(`Flag ${flagName} not found`);
    }
    flag.enabledForAll = false;
    flag.grants.clear();
    flag.updatedAt = new Date();
  }

  async createFlag(name: string): Promise<Flag> {
    const id = this.flags.size + 1;
    const flag = {
      id: id.toString(),
      name,
      isActive: true,
      enabledForAll: false,
      grants: new Set<string>(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.flags.set(name, flag);
    return Promise.resolve(flag);
  }

  async deleteFlag(name: string): Promise<void> {
    this.flags.delete(name);
    return Promise.resolve();
  }

  async listFlags(): Promise<Flag[]> {
    return Promise.resolve(Array.from(this.flags.values()));
  }

  async getFlag(name: string): Promise<Flag | null> {
    return Promise.resolve(this.flags.get(name) || null);
  }

  async getActiveFlags(subjectId: string): Promise<Flag[]> {
    const flagStatuses = Array.from(this.flags.values()).map(async (flag) => {
      const isEnabled = await this.isEnabled(flag.name, subjectId);
      return { flag, isEnabled };
    });
    const activeFlags = await Promise.all(flagStatuses).then((flagStatuses) =>
      flagStatuses
        .filter((flagStatus) => flagStatus.isEnabled)
        .map((flagStatus) => flagStatus.flag)
    );
    return Promise.resolve(activeFlags);
  }

  clear(): void {
    this.flags.clear();
  }

  seed(data: Array<{ flag: string; subjects: string[] }>): void {
    for (const { flag, subjects } of data) {
      this.createFlag(flag);
      for (const subject of subjects) {
        this.grantAccess(flag, subject);
      }
    }
  }
}
