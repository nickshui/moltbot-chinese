import type { Command } from "commander";
import { t } from "../../i18n/index.js";
import { healthCommand } from "../../commands/health.js";
import { sessionsCommand } from "../../commands/sessions.js";
import { statusCommand } from "../../commands/status.js";
import { setVerbose } from "../../globals.js";
import { defaultRuntime } from "../../runtime.js";
import { formatDocsLink } from "../../terminal/links.js";
import { theme } from "../../terminal/theme.js";
import { runCommandWithRuntime } from "../cli-utils.js";
import { formatHelpExamples } from "../help-format.js";
import { parsePositiveIntOrUndefined } from "./helpers.js";

function resolveVerbose(opts: { verbose?: boolean; debug?: boolean }): boolean {
  return Boolean(opts.verbose || opts.debug);
}

function parseTimeoutMs(timeout: unknown): number | null | undefined {
  const parsed = parsePositiveIntOrUndefined(timeout);
  if (timeout !== undefined && parsed === undefined) {
    defaultRuntime.error("--timeout must be a positive integer (milliseconds)");
    defaultRuntime.exit(1);
    return null;
  }
  return parsed;
}

export function registerStatusHealthSessionsCommands(program: Command) {
  program
    .command("status")
    .description(t("cli.status"))
    .option("--json", t("options.json"), false)
    .option("--all", t("options.allDiagnosis", "Full diagnosis (read-only)"), false)
    .option("--usage", t("options.showUsage", "Show model provider usage/quota snapshots"), false)
    .option("--deep", t("options.deepProbe", "Probe channels"), false)
    .option("--timeout <ms>", t("options.timeout"), "10000")
    .option("--verbose", t("options.verbose"), false)
    .option("--debug", t("options.debug"), false)
    .addHelpText(
      "after",
      () =>
        `\n${theme.heading(t("help.examples"))}\n${formatHelpExamples([
          ["moltbot status", t("examples.showStatus")],
          ["moltbot status --all", t("examples.fullDiagnosis")],
          ["moltbot status --json", t("examples.machineReadable")],
          ["moltbot status --usage", "Show model provider usage/quota snapshots."],
          ["moltbot status --deep", t("examples.runChannelProbes")],
          ["moltbot status --deep --timeout 5000", t("examples.tightenProbeTimeout")],
        ])}`,
    )
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted(t("help.docs"))} ${formatDocsLink("/cli/status", "docs.molt.bot/cli/status")}\n`,
    )
    .action(async (opts) => {
      const verbose = resolveVerbose(opts);
      setVerbose(verbose);
      const timeout = parseTimeoutMs(opts.timeout);
      if (timeout === null) {
        return;
      }
      await runCommandWithRuntime(defaultRuntime, async () => {
        await statusCommand(
          {
            json: Boolean(opts.json),
            all: Boolean(opts.all),
            deep: Boolean(opts.deep),
            usage: Boolean(opts.usage),
            timeoutMs: timeout,
            verbose,
          },
          defaultRuntime,
        );
      });
    });

  program
    .command("health")
    .description(t("cli.health"))
    .option("--json", t("options.json"), false)
    .option("--timeout <ms>", t("options.timeout"), "10000")
    .option("--verbose", t("options.verbose"), false)
    .option("--debug", t("options.debug"), false)
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted(t("help.docs"))} ${formatDocsLink("/cli/health", "docs.molt.bot/cli/health")}\n`,
    )
    .action(async (opts) => {
      const verbose = resolveVerbose(opts);
      setVerbose(verbose);
      const timeout = parseTimeoutMs(opts.timeout);
      if (timeout === null) {
        return;
      }
      await runCommandWithRuntime(defaultRuntime, async () => {
        await healthCommand(
          {
            json: Boolean(opts.json),
            timeoutMs: timeout,
            verbose,
          },
          defaultRuntime,
        );
      });
    });

  program
    .command("sessions")
    .description(t("cli.sessions"))
    .option("--json", t("options.json"), false)
    .option("--verbose", t("options.verbose"), false)
    .option("--store <path>", t("options.storePath", "Path to session store"))
    .option(
      "--active <minutes>",
      t("options.activeMinutes", "Only show sessions updated within the past N minutes"),
    )
    .addHelpText(
      "after",
      () =>
        `\n${theme.heading("Examples:")}\n${formatHelpExamples([
          ["moltbot sessions", t("examples.listSessions")],
          ["moltbot sessions --active 120", t("examples.listRecentSessions")],
          ["moltbot sessions --json", t("examples.machineReadable")],
          ["moltbot sessions --store ./tmp/sessions.json", t("options.storePath")],
        ])}\n\n${theme.muted(
          t("help.tokenUsageHint", "Shows token usage per session when the agent reports it."),
        )}`,
    )
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted(t("help.docs"))} ${formatDocsLink("/cli/sessions", "docs.molt.bot/cli/sessions")}\n`,
    )
    .action(async (opts) => {
      setVerbose(Boolean(opts.verbose));
      await sessionsCommand(
        {
          json: Boolean(opts.json),
          store: opts.store as string | undefined,
          active: opts.active as string | undefined,
        },
        defaultRuntime,
      );
    });
}
