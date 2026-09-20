#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { reviewRepository } from "./core.js";

const server = new McpServer({ name: "repository-inspector", version: "2.0.0" });

//move it so we can test it without starting server 
export async function handleReview(input: any) {
  const report = await reviewRepository({
    repositoryPath: input.repo_path,
    baseRef: input.baseRef,
    validationCommands: input.validationCommands,
  });
  return { content: [{ type: "text" as const, text: report }] };
}

server.tool(
  "review_repository",
  "Inspects a Git repository and returns a review report.",
  {
    repo_path: z.string().describe("Repository path to inspect."),
    baseRef: z.string().optional(),
    validationCommands: z.array(z.string()).optional(),
  },
  handleReview,
);

//dont start server when imported to test 
if (process.env.NODE_ENV !== "test") {
  await server.connect(new StdioServerTransport());
}