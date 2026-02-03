import { html, nothing } from "lit";

import { t } from "../../i18n/index.js";
import { formatAgo } from "../format";
import type { IMessageStatus } from "../types";
import type { ChannelsProps } from "./channels.types";
import { renderChannelConfigSection } from "./channels.config";

export function renderIMessageCard(params: {
  props: ChannelsProps;
  imessage?: IMessageStatus | null;
  accountCountLabel: unknown;
}) {
  const { props, imessage, accountCountLabel } = params;

  return html`
    <div class="card">
      <div class="card-title">${t("channels.imessage", "iMessage")}</div>
      <div class="card-sub">${t("channels.imessageSubtitle", "macOS bridge status and channel configuration.")}</div>
      ${accountCountLabel}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">${t("common.configured", "Configured")}</span>
          <span>${imessage?.configured ? t("common.yes", "Yes") : t("common.no", "No")}</span>
        </div>
        <div>
          <span class="label">${t("common.running", "Running")}</span>
          <span>${imessage?.running ? t("common.yes", "Yes") : t("common.no", "No")}</span>
        </div>
        <div>
          <span class="label">${t("imessage.lastStart", "Last start")}</span>
          <span>${imessage?.lastStartAt ? formatAgo(imessage.lastStartAt) : t("common.na", "n/a")}</span>
        </div>
        <div>
          <span class="label">${t("imessage.lastProbe", "Last probe")}</span>
          <span>${imessage?.lastProbeAt ? formatAgo(imessage.lastProbeAt) : t("common.na", "n/a")}</span>
        </div>
      </div>

      ${imessage?.lastError
        ? html`<div class="callout danger" style="margin-top: 12px;">
            ${imessage.lastError}
          </div>`
        : nothing}

      ${imessage?.probe
        ? html`<div class="callout" style="margin-top: 12px;">
            ${t("imessage.probe", "Probe")} ${imessage.probe.ok ? t("common.ok", "ok") : t("common.failed", "failed")} ·
            ${imessage.probe.error ?? ""}
          </div>`
        : nothing}

      ${renderChannelConfigSection({ channelId: "imessage", props })}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${() => props.onRefresh(true)}>
          ${t("imessage.probe", "Probe")}
        </button>
      </div>
    </div>
  `;
}
