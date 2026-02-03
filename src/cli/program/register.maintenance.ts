import type { Command } from "commander";
import { t } from "../../i18n/index.js";
import { dashboardCommand } from "../../commands/dashboard.js";
import { doctorCommand } from "../../commands/doctor.js";
import { resetCommand } from "../../commands/reset.js";
import { uninstallCommand } from "../../commands/uninstall.js";
import { defaultRuntime } from "../../runtime.js";
import { formatDocsLink } from "../../terminal/links.js";
import { theme } from "../../terminal/theme.js";
import { runCommandWithRuntime } from "../cli-utils.js";

export function registerMaintenanceCommands(program: Command) {
  program
    .command("doctor")
    .description(t("cli.doctor"))
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted(t("help.docs"))} ${formatDocsLink("/cli/doctor", "docs.molt.bot/cli/doctor")}\n`,
    )
    .option(
      "--no-workspace-suggestions",
      t("options.disableWorkspaceSuggestions", "Disable workspace memory system suggestions"),
      false,
    )
    .option("--yes", t("options.yes"), false)
    .option("--repair", t("options.repair", "Apply recommended repairs without prompting"), false)
    .option("--fix", t("options.fix", "Apply recommended repairs (alias for --repair)"), false)
    .option("--force", t("options.force", "Apply aggressive repairs"), false)
    .option("--non-interactive", t("options.nonInteractive"), false)
    .option(
      "--generate-gateway-token",
      t("options.generateGatewayToken", "Generate and configure a gateway token"),
      false,
    )
    .option("--deep", t("options.deep", "Scan system services for extra gateway installs"), false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        await doctorCommand(defaultRuntime, {
          workspaceSuggestions: opts.workspaceSuggestions,
          yes: Boolean(opts.yes),
          repair: Boolean(opts.repair) || Boolean(opts.fix),
          force: Boolean(opts.force),
          nonInteractive: Boolean(opts.nonInteractive),
          generateGatewayToken: Boolean(opts.generateGatewayToken),
          deep: Boolean(opts.deep),
        });
      });
    });

  program
    .command("dashboard")
    .description(t("cli.dashboard"))
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted(t("help.docs"))} ${formatDocsLink("/cli/dashboard", "docs.molt.bot/cli/dashboard")}\n`,
    )
    .option("--no-open", t("options.noOpen", "Print URL but do not launch a browser"), false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        await dashboardCommand(defaultRuntime, {
          noOpen: Boolean(opts.noOpen),
        });
      });
    });

  program
    .command("reset")
    .description(t("cli.reset"))
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted(t("help.docs"))} ${formatDocsLink("/cli/reset", "docs.molt.bot/cli/reset")}\n`,
    )
    .option("--scope <scope>", t("options.scope", "config|config+creds+sessions|full"))
    .option("--yes", t("options.yes"), false)
    .option("--non-interactive", t("options.nonInteractive"), false)
    .option("--dry-run", t("options.dryRun"), false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        await resetCommand(defaultRuntime, {
          scope: opts.scope,
          yes: Boolean(opts.yes),
          nonInteractive: Boolean(opts.nonInteractive),
          dryRun: Boolean(opts.dryRun),
        });
      });
    });

  program
    .command("uninstall")
    .description(t("cli.uninstall"))
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted(t("help.docs"))} ${formatDocsLink("/cli/uninstall", "docs.molt.bot/cli/uninstall")}\n`,
    )
    .option("--service", t("options.removeService", "Remove the gateway service"), false)
    .option("--state", t("options.removeState", "Remove state + config"), false)
    .option("--workspace", t("options.removeWorkspace", "Remove workspace dirs"), false)
    .option("--app", t("options.removeApp", "Remove the macOS app"), false)
    .option("--all", t("options.removeAll", "Remove service + state + workspace + app"), false)
    .option("--yes", t("options.yes"), false)
    .option("--non-interactive", t("options.nonInteractive"), false)
    .option("--dry-run", t("options.dryRun"), false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        await uninstallCommand(defaultRuntime, {
          service: Boolean(opts.service),
          state: Boolean(opts.state),
          workspace: Boolean(opts.workspace),
          app: Boolean(opts.app),
          all: Boolean(opts.all),
          yes: Boolean(opts.yes),
          nonInteractive: Boolean(opts.nonInteractive),
          dryRun: Boolean(opts.dryRun),
        });
      });
    });
}
