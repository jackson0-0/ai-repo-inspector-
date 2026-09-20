import { execFile } from "node:child_process";
import type { ValidationResult } from "./types.js";

//only allow the commands a review actually needs to run 
const ALLOWED = ["npm test", "npm run typecheck", "npm run build"];

export function runValidation(command: string, cwd: string): Promise<ValidationResult> {
  return new Promise((resolve) => {
    if (!ALLOWED.includes(command)) {
      resolve({ command, status: "failed", output: "Command not allowed" });
      return;
    }

    const [program, ...args] = command.split(" ");
    //execFile passes arguments into the program rather then shell 
    execFile(program, args, { cwd, timeout: 60_000 }, (error, stdout, stderr) => {
      //a failed command gets reported instead of crashing the server
      resolve({ command, status: error ? "failed" : "passed", output: stdout + stderr });
    });
  });
}

export async function runValidations(commands: string[], cwd: string): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];
  for (const command of commands) {
    results.push(await runValidation(command, cwd));
  }
  return results;
}