import type { Command } from "commander";
import { t } from "../../i18n/index.js";
import { onboardCommand } from "../../commands/onboard.js";
import { setupCommand } from "../../commands/setup.js";
import { defaultRuntime } from "../../runtime.js";
import { formatDocsLink } from "../../terminal/links.js";
import { theme } from "../../terminal/theme.js";
import { hasExplicitOptions } from "../command-options.js";
import { runCommandWithRuntime } from "../cli-utils.js";

export function registerSetupCommand(program: Command) {
  program
    .command("setup")
    .description(t("cli.setup"))
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted(t("help.docs"))} ${formatDocsLink("/cli/setup", "docs.molt.bot/cli/setup")}\n`,
    )
    .option(
      "--workspace <dir>",
      "代理工作空间目录（默认：~/clawd；存储为 agents.defaults.workspace）",
    )
    .option("--wizard", t("options.wizard"), false)
    .option("--non-interactive", t("options.nonInteractive"), false)
    .option("--mode <mode>", `${t("options.mode")}: local|remote`)
    .option("--remote-url <url>", t("options.remoteUrl"))
    .option("--remote-token <token>", t("options.remoteToken"))
    .action(async (opts, command) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const hasWizardFlags = hasExplicitOptions(command, [
          "wizard",
          "nonInteractive",
          "mode",
          "remoteUrl",
          "remoteToken",
        ]);
        if (opts.wizard || hasWizardFlags) {
          await onboardCommand(
            {
              workspace: opts.workspace as string | undefined,
              nonInteractive: Boolean(opts.nonInteractive),
              mode: opts.mode as "local" | "remote" | undefined,
              remoteUrl: opts.remoteUrl as string | undefined,
              remoteToken: opts.remoteToken as string | undefined,
            },
            defaultRuntime,
          );
          return;
        }
        await setupCommand({ workspace: opts.workspace as string | undefined }, defaultRuntime);
      });
    });
}
