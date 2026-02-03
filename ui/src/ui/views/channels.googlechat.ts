import { html, nothing } from "lit";

import { t } from "../../i18n/index.js";
import { formatAgo } from "../format";
import type { GoogleChatStatus } from "../types";
import { renderChannelConfigSection } from "./channels.config";
import type { ChannelsProps } from "./channels.types";

export function renderGoogleChatCard(params: {
  props: ChannelsProps;
  googleChat?: GoogleChatStatus | null;
  accountCountLabel: unknown;
}) {
  const { props, googleChat, accountCountLabel } = params;

  return html`
    <div class="card">
      <div class="card-title">${t("channels.googlechat", "Google Chat")}</div>
      <div class="card-sub">${t("channels.googlechatSubtitle", "Chat API webhook status and channel configuration.")}</div>
      ${accountCountLabel}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">${t("common.configured", "Configured")}</span>
          <span>${googleChat ? (googleChat.configured ? t("common.yes", "Yes") : t("common.no", "No")) : t("common.na", "n/a")}</span>
        </div>
        <div>
          <span class="label">${t("common.running", "Running")}</span>
          <span>${googleChat ? (googleChat.running ? t("common.yes", "Yes") : t("common.no", "No")) : t("common.na", "n/a")}</span>
        </div>
        <div>
          <span class="label">${t("googlechat.credential", "Credential")}</span>
          <span>${googleChat?.credentialSource ?? t("common.na", "n/a")}</span>
        </div>
        <div>
          <span class="label">${t("googlechat.audience", "Audience")}</span>
          <span>
            ${googleChat?.audienceType
              ? `${googleChat.audienceType}${googleChat.audience ? ` · ${googleChat.audience}` : ""}`
              : t("common.na", "n/a")}
          </span>
        </div>
        <div>
          <span class="label">${t("googlechat.lastStart", "Last start")}</span>
          <span>${googleChat?.lastStartAt ? formatAgo(googleChat.lastStartAt) : t("common.na", "n/a")}</span>
        </div>
        <div>
          <span class="label">${t("googlechat.lastProbe", "Last probe")}</span>
          <span>${googleChat?.lastProbeAt ? formatAgo(googleChat.lastProbeAt) : t("common.na", "n/a")}</span>
        </div>
      </div>

      ${googleChat?.lastError
        ? html`<div class="callout danger" style="margin-top: 12px;">
            ${googleChat.lastError}
          </div>`
        : nothing}

      ${googleChat?.probe
        ? html`<div class="callout" style="margin-top: 12px;">
            ${t("googlechat.probe", "Probe")} ${googleChat.probe.ok ? t("common.ok", "ok") : t("common.failed", "failed")} ·
            ${googleChat.probe.status ?? ""} ${googleChat.probe.error ?? ""}
          </div>`
        : nothing}

      ${renderChannelConfigSection({ channelId: "googlechat", props })}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${() => props.onRefresh(true)}>
          ${t("googlechat.probe", "Probe")}
        </button>
      </div>
    </div>
  `;
}
