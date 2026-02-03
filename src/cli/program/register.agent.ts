import type { Command } from "commander";
import { t } from "../../i18n/index.js";
import { DEFAULT_CHAT_CHANNEL } from "../../channels/registry.js";
import { agentCliCommand } from "../../commands/agent-via-gateway.js";
import {
  agentsAddCommand,
  agentsDeleteCommand,
  agentsListCommand,
  agentsSetIdentityCommand,
} from "../../commands/agents.js";
import { setVerbose } from "../../globals.js";
import { defaultRuntime } from "../../runtime.js";
import { formatDocsLink } from "../../terminal/links.js";
import { theme } from "../../terminal/theme.js";
import { hasExplicitOptions } from "../command-options.js";
import { formatHelpExamples } from "../help-format.js";
import { createDefaultDeps } from "../deps.js";
import { runCommandWithRuntime } from "../cli-utils.js";
import { collectOption } from "./helpers.js";

export function registerAgentCommands(program: Command, args: { agentChannelOptions: string }) {
  program
    .command("agent")
    .description(t("cli.agent"))
    .requiredOption("-m, --message <text>", t("options.messageBody", "Message body for the agent"))
    .option("-t, --to <number>", t("options.recipientNumber", "Recipient number in E.164"))
    .option("--session-id <id>", t("options.sessionId"))
    .option("--agent <id>", t("options.agentId", "Agent id"))
    .option("--thinking <level>", t("options.thinking"))
    .option("--verbose <on|off>", t("options.verbosePersist", "Persist agent verbose level"))
    .option(
      "--channel <channel>",
      `${t("options.deliveryChannel", "Delivery channel")}: ${args.agentChannelOptions} (${t("common.default")}: ${DEFAULT_CHAT_CHANNEL})`,
    )
    .option("--reply-to <target>", t("options.replyTo", "Delivery target override"))
    .option("--reply-channel <channel>", t("options.replyChannel", "Delivery channel override"))
    .option("--reply-account <id>", t("options.replyAccount", "Delivery account id"))
    .option("--local", t("options.localAgent", "Run embedded agent locally"), false)
    .option("--deliver", t("options.deliverReply", "Send reply back to channel"), false)
    .option("--json", t("options.json"), false)
    .option("--timeout <seconds>", t("options.timeoutSeconds", "Override timeout (seconds)"))
    .addHelpText(
      "after",
      () =>
        `
${theme.heading(t("help.examples"))}
${formatHelpExamples([
  ['moltbot agent --to +15555550123 --message "status update"', t("examples.startNewSession")],
  ['moltbot agent --agent ops --message "Summarize logs"', t("examples.useSpecificAgent")],
  [
    'moltbot agent --session-id 1234 --message "Summarize inbox" --thinking medium',
    "Target a session with explicit thinking level.",
  ],
  [
    'moltbot agent --to +15555550123 --message "Trace logs" --verbose on --json',
    "Enable verbose logging and JSON output.",
  ],
  [
    'moltbot agent --to +15555550123 --message "Summon reply" --deliver',
    t("examples.deliverReply"),
  ],
  [
    'moltbot agent --agent ops --message "Generate report" --deliver --reply-channel slack --reply-to "#reports"',
    "Send reply to a different channel/target.",
  ],
])}

${theme.muted(t("help.docs"))} ${formatDocsLink("/cli/agent", "docs.molt.bot/cli/agent")}`,
    )
    .action(async (opts) => {
      const verboseLevel = typeof opts.verbose === "string" ? opts.verbose.toLowerCase() : "";
      setVerbose(verboseLevel === "on");
      // Build default deps (keeps parity with other commands; future-proofing).
      const deps = createDefaultDeps();
      await runCommandWithRuntime(defaultRuntime, async () => {
        await agentCliCommand(opts, defaultRuntime, deps);
      });
    });

  const agents = program
    .command("agents")
    .description(t("cli.agents"))
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted(t("help.docs"))} ${formatDocsLink("/cli/agents", "docs.molt.bot/cli/agents")}\n`,
    );

  agents
    .command("list")
    .description(t("cli.subcommands.list"))
    .option("--json", t("options.json"), false)
    .option("--bindings", t("options.includeBindings", "Include routing bindings"), false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        await agentsListCommand(
          { json: Boolean(opts.json), bindings: Boolean(opts.bindings) },
          defaultRuntime,
        );
      });
    });

  agents
    .command("add [name]")
    .description(t("options.addAgent", "Add a new isolated agent"))
    .option("--workspace <dir>", t("options.workspaceDir", "Workspace directory"))
    .option("--model <id>", t("options.modelId", "Model id"))
    .option("--agent-dir <dir>", t("options.agentDir", "Agent state directory"))
    .option(
      "--bind <channel[:accountId]>",
      t("options.channelBinding", "Route channel binding"),
      collectOption,
      [],
    )
    .option("--non-interactive", t("options.nonInteractive"), false)
    .option("--json", t("options.json"), false)
    .action(async (name, opts, command) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const hasFlags = hasExplicitOptions(command, [
          "workspace",
          "model",
          "agentDir",
          "bind",
          "nonInteractive",
        ]);
        await agentsAddCommand(
          {
            name: typeof name === "string" ? name : undefined,
            workspace: opts.workspace as string | undefined,
            model: opts.model as string | undefined,
            agentDir: opts.agentDir as string | undefined,
            bind: Array.isArray(opts.bind) ? (opts.bind as string[]) : undefined,
            nonInteractive: Boolean(opts.nonInteractive),
            json: Boolean(opts.json),
          },
          defaultRuntime,
          { hasFlags },
        );
      });
    });

  agents
    .command("set-identity")
    .description(t("options.updateIdentity", "Update agent identity"))
    .option("--agent <id>", t("options.agentId", "Agent id"))
    .option("--workspace <dir>", t("options.workspaceForIdentity", "Workspace directory"))
    .option("--identity-file <path>", t("options.identityFile", "IDENTITY.md path"))
    .option("--from-identity", t("options.fromIdentity", "Read from IDENTITY.md"), false)
    .option("--name <name>", t("options.identityName", "Identity name"))
    .option("--theme <theme>", t("options.identityTheme", "Identity theme"))
    .option("--emoji <emoji>", t("options.identityEmoji", "Identity emoji"))
    .option("--avatar <value>", t("options.identityAvatar", "Identity avatar"))
    .option("--json", t("options.json"), false)
    .addHelpText(
      "after",
      () =>
        `
${theme.heading("Examples:")}
${formatHelpExamples([
  ['moltbot agents set-identity --agent main --name "Clawd" --emoji "🦞"', "Set name + emoji."],
  ["moltbot agents set-identity --agent main --avatar avatars/clawd.png", "Set avatar path."],
  ["moltbot agents set-identity --workspace ~/clawd --from-identity", "Load from IDENTITY.md."],
  [
    "moltbot agents set-identity --identity-file ~/clawd/IDENTITY.md --agent main",
    "Use a specific IDENTITY.md.",
  ],
])}
`,
    )
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        await agentsSetIdentityCommand(
          {
            agent: opts.agent as string | undefined,
            workspace: opts.workspace as string | undefined,
            identityFile: opts.identityFile as string | undefined,
            fromIdentity: Boolean(opts.fromIdentity),
            name: opts.name as string | undefined,
            theme: opts.theme as string | undefined,
            emoji: opts.emoji as string | undefined,
            avatar: opts.avatar as string | undefined,
            json: Boolean(opts.json),
          },
          defaultRuntime,
        );
      });
    });

  agents
    .command("delete <id>")
    .description(t("options.deleteAgent", "Delete agent"))
    .option("--force", t("options.force"), false)
    .option("--json", t("options.json"), false)
    .action(async (id, opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        await agentsDeleteCommand(
          {
            id: String(id),
            force: Boolean(opts.force),
            json: Boolean(opts.json),
          },
          defaultRuntime,
        );
      });
    });

  agents.action(async () => {
    await runCommandWithRuntime(defaultRuntime, async () => {
      await agentsListCommand({}, defaultRuntime);
    });
  });
}
