import type { BulkOperationResult, Flag } from "../core/types";

export abstract class DatabaseAdapter {
	// Core flag evaluation
	abstract isEnabled(flagName: string, subjectId: string): Promise<boolean>;

	// Access management
	abstract grantAccess(flagName: string, subjectId: string): Promise<void>;
	abstract revokeAccess(flagName: string, subjectId: string): Promise<void>;

	abstract grantAccessBulk(
		flagName: string,
		subjectIds: string[],
	): Promise<BulkOperationResult>;

	abstract revokeAccessBulk(
		flagName: string,
		subjectIds: string[],
	): Promise<BulkOperationResult>;

	abstract enableForAll(flagName: string): Promise<void>;
	abstract disableForAll(flagName: string): Promise<void>;
	abstract getActiveFlags(subjectId: string): Promise<Flag[]>;

	// Flag management
	abstract createFlag(name: string): Promise<Flag>;
	abstract deleteFlag(name: string): Promise<void>;
	abstract listFlags(): Promise<Flag[]>;
	abstract getFlag(name: string): Promise<Flag | null>;
}
