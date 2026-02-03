import { html, nothing } from "lit";

import { t } from "../../i18n/index.js";
import { formatAgo } from "../format";
import type { DiscordStatus } from "../types";
import type { ChannelsProps } from "./channels.types";
import { renderChannelConfigSection } from "./channels.config";

export function renderDiscordCard(params: {
  props: ChannelsProps;
  discord?: DiscordStatus | null;
  accountCountLabel: unknown;
}) {
  const { props, discord, accountCountLabel } = params;

  return html`
    <div class="card">
      <div class="card-title">${t("channels.discord", "Discord")}</div>
      <div class="card-sub">${t("channels.discordSubtitle", "Bot status and channel configuration.")}</div>
      ${accountCountLabel}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">${t("common.configured", "Configured")}</span>
          <span>${discord?.configured ? t("common.yes", "Yes") : t("common.no", "No")}</span>
        </div>
        <div>
          <span class="label">${t("common.running", "Running")}</span>
          <span>${discord?.running ? t("common.yes", "Yes") : t("common.no", "No")}</span>
        </div>
        <div>
          <span class="label">${t("discord.lastStart", "Last start")}</span>
          <span>${discord?.lastStartAt ? formatAgo(discord.lastStartAt) : t("common.na", "n/a")}</span>
        </div>
        <div>
          <span class="label">${t("discord.lastProbe", "Last probe")}</span>
          <span>${discord?.lastProbeAt ? formatAgo(discord.lastProbeAt) : t("common.na", "n/a")}</span>
        </div>
      </div>

      ${discord?.lastError
        ? html`<div class="callout danger" style="margin-top: 12px;">
            ${discord.lastError}
          </div>`
        : nothing}

      ${discord?.probe
        ? html`<div class="callout" style="margin-top: 12px;">
            ${t("discord.probe", "Probe")} ${discord.probe.ok ? t("common.ok", "ok") : t("common.failed", "failed")} ·
            ${discord.probe.status ?? ""} ${discord.probe.error ?? ""}
          </div>`
        : nothing}

      ${renderChannelConfigSection({ channelId: "discord", props })}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${() => props.onRefresh(true)}>
          ${t("discord.probe", "Probe")}
        </button>
      </div>
    </div>
  `;
}
