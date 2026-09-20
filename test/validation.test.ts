import { describe, expect, it } from "vitest";
import { runValidation } from "../src/validation.js";

describe("runValidation", () => {
  it("reports a failed command instead of crashing", async () => {
    const result = await runValidation("false", "/tmp/fixture");
    expect(result.status).toBe("failed");
  });

  it("does not run commands that are not on the allowlist", async () => {
    const result = await runValidation("echo pwned > /tmp/pwned2.txt", "/tmp/fixture");
    expect(result.output).toContain("not allowed");
  });
});
