import { html, nothing } from "lit";

import { t } from "../../i18n/index.js";
import { formatAgo } from "../format";
import type { SlackStatus } from "../types";
import type { ChannelsProps } from "./channels.types";
import { renderChannelConfigSection } from "./channels.config";

export function renderSlackCard(params: {
  props: ChannelsProps;
  slack?: SlackStatus | null;
  accountCountLabel: unknown;
}) {
  const { props, slack, accountCountLabel } = params;

  return html`
    <div class="card">
      <div class="card-title">${t("channels.slack", "Slack")}</div>
      <div class="card-sub">${t("channels.slackSubtitle", "Socket mode status and channel configuration.")}</div>
      ${accountCountLabel}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">${t("common.configured", "Configured")}</span>
          <span>${slack?.configured ? t("common.yes", "Yes") : t("common.no", "No")}</span>
        </div>
        <div>
          <span class="label">${t("common.running", "Running")}</span>
          <span>${slack?.running ? t("common.yes", "Yes") : t("common.no", "No")}</span>
        </div>
        <div>
          <span class="label">${t("slack.lastStart", "Last start")}</span>
          <span>${slack?.lastStartAt ? formatAgo(slack.lastStartAt) : t("common.na", "n/a")}</span>
        </div>
        <div>
          <span class="label">${t("slack.lastProbe", "Last probe")}</span>
          <span>${slack?.lastProbeAt ? formatAgo(slack.lastProbeAt) : t("common.na", "n/a")}</span>
        </div>
      </div>

      ${slack?.lastError
        ? html`<div class="callout danger" style="margin-top: 12px;">
            ${slack.lastError}
          </div>`
        : nothing}

      ${slack?.probe
        ? html`<div class="callout" style="margin-top: 12px;">
            ${t("slack.probe", "Probe")} ${slack.probe.ok ? t("common.ok", "ok") : t("common.failed", "failed")} ·
            ${slack.probe.status ?? ""} ${slack.probe.error ?? ""}
          </div>`
        : nothing}

      ${renderChannelConfigSection({ channelId: "slack", props })}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${() => props.onRefresh(true)}>
          ${t("slack.probe", "Probe")}
        </button>
      </div>
    </div>
  `;
}
