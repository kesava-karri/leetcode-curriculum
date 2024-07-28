import { writeFile } from "node:fs/promises";
import nullthrows from "nullthrows";
import process from "node:process";

import { assertIsCi } from "@code-chronicles/util/assertIsCi";
import { getCurrentGitRepositoryRoot } from "@code-chronicles/util/getCurrentGitRepositoryRoot";
import { spawnWithSafeStdio } from "@code-chronicles/util/spawnWithSafeStdio";

const COMMANDS = [
  "yarn lint",
  "yarn typecheck",
  "yarn test",
  "yarn workspace @code-chronicles/adventure-pack build-app",
  "yarn workspace @code-chronicles/fetch-leetcode-problem-list build",
];

async function main(): Promise<void> {
  assertIsCi();

  const outputPath = nullthrows(
    process.env.GITHUB_STEP_SUMMARY,
    "Missing the GITHUB_STEP_SUMMARY environment variable!",
  );

  process.chdir(await getCurrentGitRepositoryRoot());

  // TODO: prevent stray annotations from being generated by command output

  const summary = ["# PR Health Report\n\n"];
  const errors = [];

  for (const command of COMMANDS) {
    // eslint-disable-next-line no-await-in-loop
    await spawnWithSafeStdio("git", ["reset", "--hard", "HEAD"]);
    // eslint-disable-next-line no-await-in-loop
    await spawnWithSafeStdio("git", ["clean", "-fd"]);

    console.error("Running: " + command);
    try {
      // eslint-disable-next-line no-await-in-loop
      await spawnWithSafeStdio("bash", ["-c", command + " 1>&2"]);
      summary.push(` * \`${command}\`: ✅\n`);
    } catch (err) {
      console.error(err);
      errors.push(err);
      summary.push(` * \`${command}\`: ❌\n`);
    }
  }

  await writeFile(outputPath, summary.join(""));

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
