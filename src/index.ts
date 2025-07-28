export { DatabaseAdapter } from "./adapters/base";
export { MemoryAdapter } from "./adapters/memory";
export { PrismaAdapter } from "./adapters/prisma";
export {
  grantAccess,
  grantAccessBulk,
  hasAccess,
  revokeAccess,
  revokeAccessBulk,
} from "./api/access-control";
export { configure } from "./api/configuration";
export { evaluate, getActiveFlags, isEnabled } from "./api/evaluation";
export { createFlag, deleteFlag, listFlags } from "./api/management";
export type { CreateFlagInput, Flag, GatedConfig, Subject } from "./core/types";
