import type { Command } from "commander";
import { t } from "../../i18n/index.js";
import type { GatewayDaemonRuntime } from "../../commands/daemon-runtime.js";
import { onboardCommand } from "../../commands/onboard.js";
import type {
  AuthChoice,
  GatewayAuthChoice,
  GatewayBind,
  NodeManagerChoice,
  TailscaleMode,
} from "../../commands/onboard-types.js";
import { defaultRuntime } from "../../runtime.js";
import { formatDocsLink } from "../../terminal/links.js";
import { theme } from "../../terminal/theme.js";
import { runCommandWithRuntime } from "../cli-utils.js";

function resolveInstallDaemonFlag(
  command: unknown,
  opts: { installDaemon?: boolean },
): boolean | undefined {
  if (!command || typeof command !== "object") return undefined;
  const getOptionValueSource =
    "getOptionValueSource" in command ? command.getOptionValueSource : undefined;
  if (typeof getOptionValueSource !== "function") return undefined;

  // Commander doesn't support option conflicts natively; keep original behavior.
  // If --skip-daemon is explicitly passed, it wins.
  if (getOptionValueSource.call(command, "skipDaemon") === "cli") return false;
  if (getOptionValueSource.call(command, "installDaemon") === "cli") {
    return Boolean(opts.installDaemon);
  }
  return undefined;
}

export function registerOnboardCommand(program: Command) {
  program
    .command("onboard")
    .description(t("cli.onboard"))
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted(t("help.docs"))} ${formatDocsLink("/cli/onboard", "docs.molt.bot/cli/onboard")}\n`,
    )
    .option("--workspace <dir>", t("options.workspace"))
    .option("--reset", t("options.reset"))
    .option("--non-interactive", t("options.nonInteractive"), false)
    .option(
      "--accept-risk",
      t("options.acceptRisk", "Acknowledge risk (required for --non-interactive)"),
      false,
    )
    .option("--flow <flow>", `${t("options.flow")}: quickstart|advanced|manual`)
    .option("--mode <mode>", `${t("options.mode")}: local|remote`)
    .option("--auth-choice <choice>", `${t("options.authChoice", "Auth")}: setup-token|token|...`)
    .option("--token-provider <id>", t("options.tokenProvider", "Token provider id"))
    .option("--token <token>", t("options.tokenValue", "Token value"))
    .option("--token-profile-id <id>", t("options.tokenProfileId", "Auth profile id"))
    .option(
      "--token-expires-in <duration>",
      t("options.tokenExpiresIn", "Token expiry (e.g. 365d, 12h)"),
    )
    .option("--anthropic-api-key <key>", t("options.anthropicApiKey"))
    .option("--openai-api-key <key>", t("options.openaiApiKey"))
    .option("--openrouter-api-key <key>", t("options.openrouterApiKey"))
    .option("--ai-gateway-api-key <key>", t("options.aiGatewayApiKey"))
    .option("--moonshot-api-key <key>", t("options.moonshotApiKey"))
    .option("--kimi-code-api-key <key>", t("options.kimiCodeApiKey"))
    .option("--gemini-api-key <key>", t("options.geminiApiKey"))
    .option("--zai-api-key <key>", t("options.zaiApiKey"))
    .option("--minimax-api-key <key>", t("options.minimaxApiKey"))
    .option("--synthetic-api-key <key>", t("options.syntheticApiKey"))
    .option("--venice-api-key <key>", t("options.veniceApiKey"))
    .option("--opencode-zen-api-key <key>", t("options.opencodeZenApiKey"))
    .option("--gateway-port <port>", t("options.port"))
    .option("--gateway-bind <mode>", `${t("options.bind")}: loopback|tailnet|lan|auto|custom`)
    .option("--gateway-auth <mode>", `${t("options.auth")}: token|password`)
    .option("--gateway-token <token>", t("options.token"))
    .option("--gateway-password <password>", t("options.password", "Gateway password"))
    .option("--remote-url <url>", t("options.remoteUrl"))
    .option("--remote-token <token>", t("options.remoteToken"))
    .option("--tailscale <mode>", `Tailscale: off|serve|funnel`)
    .option(
      "--tailscale-reset-on-exit",
      t("options.tailscaleResetOnExit", "Reset tailscale on exit"),
    )
    .option("--install-daemon", t("options.installDaemon"))
    .option("--no-install-daemon", t("options.skipDaemon"))
    .option("--skip-daemon", t("options.skipDaemon"))
    .option(
      "--daemon-runtime <runtime>",
      `${t("options.daemonRuntime", "Daemon runtime")}: node|bun`,
    )
    .option("--skip-channels", t("options.skipChannels"))
    .option("--skip-skills", t("options.skipSkills"))
    .option("--skip-health", t("options.skipHealth"))
    .option("--skip-ui", t("options.skipUi", "Skip Control UI/TUI prompts"))
    .option("--node-manager <name>", `${t("options.nodeManager", "Node manager")}: npm|pnpm|bun`)
    .option("--json", t("options.json"), false)
    .action(async (opts, command) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const installDaemon = resolveInstallDaemonFlag(command, {
          installDaemon: Boolean(opts.installDaemon),
        });
        const gatewayPort =
          typeof opts.gatewayPort === "string" ? Number.parseInt(opts.gatewayPort, 10) : undefined;
        await onboardCommand(
          {
            workspace: opts.workspace as string | undefined,
            nonInteractive: Boolean(opts.nonInteractive),
            acceptRisk: Boolean(opts.acceptRisk),
            flow: opts.flow as "quickstart" | "advanced" | "manual" | undefined,
            mode: opts.mode as "local" | "remote" | undefined,
            authChoice: opts.authChoice as AuthChoice | undefined,
            tokenProvider: opts.tokenProvider as string | undefined,
            token: opts.token as string | undefined,
            tokenProfileId: opts.tokenProfileId as string | undefined,
            tokenExpiresIn: opts.tokenExpiresIn as string | undefined,
            anthropicApiKey: opts.anthropicApiKey as string | undefined,
            openaiApiKey: opts.openaiApiKey as string | undefined,
            openrouterApiKey: opts.openrouterApiKey as string | undefined,
            aiGatewayApiKey: opts.aiGatewayApiKey as string | undefined,
            moonshotApiKey: opts.moonshotApiKey as string | undefined,
            kimiCodeApiKey: opts.kimiCodeApiKey as string | undefined,
            geminiApiKey: opts.geminiApiKey as string | undefined,
            zaiApiKey: opts.zaiApiKey as string | undefined,
            minimaxApiKey: opts.minimaxApiKey as string | undefined,
            syntheticApiKey: opts.syntheticApiKey as string | undefined,
            veniceApiKey: opts.veniceApiKey as string | undefined,
            opencodeZenApiKey: opts.opencodeZenApiKey as string | undefined,
            gatewayPort:
              typeof gatewayPort === "number" && Number.isFinite(gatewayPort)
                ? gatewayPort
                : undefined,
            gatewayBind: opts.gatewayBind as GatewayBind | undefined,
            gatewayAuth: opts.gatewayAuth as GatewayAuthChoice | undefined,
            gatewayToken: opts.gatewayToken as string | undefined,
            gatewayPassword: opts.gatewayPassword as string | undefined,
            remoteUrl: opts.remoteUrl as string | undefined,
            remoteToken: opts.remoteToken as string | undefined,
            tailscale: opts.tailscale as TailscaleMode | undefined,
            tailscaleResetOnExit: Boolean(opts.tailscaleResetOnExit),
            reset: Boolean(opts.reset),
            installDaemon,
            daemonRuntime: opts.daemonRuntime as GatewayDaemonRuntime | undefined,
            skipChannels: Boolean(opts.skipChannels),
            skipSkills: Boolean(opts.skipSkills),
            skipHealth: Boolean(opts.skipHealth),
            skipUi: Boolean(opts.skipUi),
            nodeManager: opts.nodeManager as NodeManagerChoice | undefined,
            json: Boolean(opts.json),
          },
          defaultRuntime,
        );
      });
    });
}
