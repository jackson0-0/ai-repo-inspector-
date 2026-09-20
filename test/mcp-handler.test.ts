import { describe, expect, it } from "vitest";
import { handleReview } from "../src/mcp-server.js";

describe("review_repository tool", () => {
  it("looks at the repo you give it", async () => {
    // The tool takes "repo_path". If it reads the wrong field,
    // the path ends up undefined and git runs in the wrong folder.
    const result = await handleReview({
      repo_path: "/tmp/fixture",
      baseRef: "master",
    });

    const report = result.content[0].text;

    expect(report).toContain("# Review Report: /tmp/fixture");
  });
});
