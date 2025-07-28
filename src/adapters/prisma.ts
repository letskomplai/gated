import type { PrismaClient } from "@prisma/client";
import type { BulkOperationResult, Flag } from "../core/types";
import type { DatabaseAdapter } from "./base";

export class PrismaAdapter implements DatabaseAdapter {
	constructor(private prisma: PrismaClient) {}

	async isEnabled(flagName: string, subjectId: string): Promise<boolean> {
		const flag = await this.getFlag(flagName);
		if (!flag) {
			return false;
		}

		if (flag.enabledForAll) {
			return true;
		}

		const grant = await this.prisma.featureFlagGrant.findUnique({
			where: {
				flagId_subjectId: {
					flagId: flag.id,
					subjectId,
				},
			},
		});

		if (!grant) {
			return false;
		}

		return grant.enabled;
	}

	async grantAccess(flagName: string, subjectId: string): Promise<void> {
		const flag = await this.getFlag(flagName);
		if (!flag) {
			throw new Error(`Flag ${flagName} not found`);
		}

		await this.prisma.featureFlagGrant.upsert({
			where: {
				flagId_subjectId: {
					flagId: flag.id,
					subjectId,
				},
			},
			create: {
				flagId: flag.id,
				subjectId,
				enabled: true,
			},
			update: {
				enabled: true,
			},
		});
	}

	async revokeAccess(flagName: string, subjectId: string): Promise<void> {
		const grant = await this.prisma.featureFlagGrant.findFirst({
			where: {
				Flag: {
					name: flagName,
				},
				subjectId,
			},
		});
		if (!grant) {
			return;
		}
		await this.prisma.featureFlagGrant.update({
			where: {
				id: grant.id,
			},
			data: {
				enabled: false,
			},
		});
	}

	async grantAccessBulk(
		flagName: string,
		subjectIds: string[],
	): Promise<BulkOperationResult> {
		const flag = await this.getFlag(flagName);
		if (!flag) {
			throw new Error(`Flag ${flagName} not found`);
		}

		const successful: string[] = [];
		const failed: { subjectId: string; error: string }[] = [];
		for (const subjectId of subjectIds) {
			try {
				await this.grantAccess(flagName, subjectId);
				successful.push(subjectId);
			} catch (error) {
				failed.push({ subjectId, error: error as string });
			}
		}
		return { successful, failed };
	}

	async revokeAccessBulk(
		flagName: string,
		subjectIds: string[],
	): Promise<BulkOperationResult> {
		const flag = await this.getFlag(flagName);
		if (!flag) {
			throw new Error(`Flag ${flagName} not found`);
		}

		const successful: string[] = [];
		const failed: { subjectId: string; error: string }[] = [];
		for (const subjectId of subjectIds) {
			try {
				await this.revokeAccess(flagName, subjectId);
				successful.push(subjectId);
			} catch (error) {
				failed.push({ subjectId, error: error as string });
			}
		}
		return { successful, failed };
	}

	async enableForAll(flagName: string): Promise<void> {
		const flag = await this.getFlag(flagName);
		if (!flag) {
			throw new Error(`Flag ${flagName} not found`);
		}

		await this.prisma.featureFlag.update({
			where: {
				id: flag.id,
			},
			data: {
				enabledForAll: true,
			},
		});
	}

	async disableForAll(flagName: string): Promise<void> {
		const flag = await this.getFlag(flagName);
		if (!flag) {
			throw new Error(`Flag ${flagName} not found`);
		}

		await this.prisma.featureFlag.update({
			where: {
				id: flag.id,
			},
			data: {
				enabledForAll: false,
			},
		});

		await this.prisma.featureFlagGrant.deleteMany({
			where: {
				flagId: flag.id,
			},
		});
	}

	async getActiveFlags(subjectId: string): Promise<Flag[]> {
		const grants = await this.prisma.featureFlagGrant.findMany({
			where: {
				subjectId,
			},
			include: {
				Flag: true,
			},
		});
		return grants.map((grant) => grant.Flag);
	}

	createFlag(name: string): Promise<Flag> {
		return this.prisma.featureFlag.create({
			data: {
				name,
			},
		});
	}

	async deleteFlag(name: string): Promise<void> {
		const flag = await this.getFlag(name);
		if (!flag) {
			throw new Error(`Flag ${name} not found`);
		}

		await this.prisma.featureFlag.delete({
			where: {
				id: flag.id,
			},
		});
	}

	listFlags(): Promise<Flag[]> {
		return this.prisma.featureFlag.findMany();
	}

	getFlag(name: string): Promise<Flag | null> {
		return this.prisma.featureFlag.findUnique({
			where: {
				name,
			},
		});
	}
}
