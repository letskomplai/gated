import { beforeEach, describe, expect, it } from "vitest";
import {
  configure,
  createFlag,
  evaluate,
  getActiveFlags,
  grantAccess,
  isEnabled,
  MemoryAdapter,
} from "../../src/index";

describe("Flag Evaluation with MemoryAdapter", () => {
  beforeEach(async () => {
    const adapter = new MemoryAdapter();
    configure({ adapter });
    // Seed data
    await createFlag("flag-a");
    await createFlag("flag-b");
    await grantAccess("flag-a", "user-123");
  });

  describe("isEnabled", () => {
    it("should return false for a non-existent flag", async () => {
      const result = await isEnabled("non-existent-flag", "user-123");
      expect(result).toBe(false);
    });

    it("should return false for a subject without access", async () => {
      const result = await isEnabled("flag-b", "user-456");
      expect(result).toBe(false);
    });

    it("should return true", async () => {
      const result = await isEnabled("flag-a", "user-123");
      expect(result).toBe(true);
    });
  });

  describe("evaluate", () => {
    it("should evaluate multiple flags correctly", async () => {
      const results = await evaluate(["flag-a", "flag-b"], "user-123");

      expect(results).toEqual({
        "flag-a": true,
        "flag-b": false,
      });
    });
  });

  describe("getActiveFlags", () => {
    it("should corectly list flags that user has access to", async () => {
      const flags = await getActiveFlags("user-123").then((flags) =>
        flags.map((flag) => flag.name)
      );
      expect(flags).toEqual(["flag-a"]);
    });
  });
});
