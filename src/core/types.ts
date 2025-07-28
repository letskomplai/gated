import type { DatabaseAdapter } from "../adapters/base";

export type Subject = {
	id: string;
	/** Use for labeling */
	type: string;
};

export type Flag = {
	id: string;
	name: string;
	enabledForAll: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export type FlagGrant = {
	id: string;
	flagId: string;
	subjectId: string;
	enabled: boolean;
	createdAt: Date;
};

export type CreateFlagInput = {
	name: string;
	enabledForAll?: boolean;
};

export type BulkOperationResult = {
	successful: string[];
	failed: { subjectId: string; error: string }[];
};

export type GatedConfig = {
	adapter: DatabaseAdapter;
};
