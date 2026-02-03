import type { Command } from "commander";
import { t } from "../../../i18n/index.js";
import type { MessageCliHelpers } from "./helpers.js";

export function registerMessageSendCommand(message: Command, helpers: MessageCliHelpers) {
  helpers
    .withMessageBase(
      helpers
        .withRequiredMessageTarget(
          message
            .command("send")
            .description(t("cli.send"))
            .option("-m, --message <text>", t("options.message")),
        )
        .option("--media <path-or-url>", t("options.media"))
        .option(
          "--buttons <json>",
          t("options.buttons", "Telegram inline keyboard buttons (JSON array)"),
        )
        .option("--card <json>", t("options.card"))
        .option("--reply-to <id>", t("options.replyTo"))
        .option("--thread-id <id>", t("options.threadId"))
        .option("--gif-playback", t("options.gifPlayback"), false)
        .option("--silent", t("options.silent"), false),
    )
    .action(async (opts) => {
      await helpers.runMessageAction("send", opts);
    });
}
