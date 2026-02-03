import { html, nothing } from "lit";

import { t } from "../../i18n/index.js";
import { formatAgo } from "../format";
import type { SignalStatus } from "../types";
import type { ChannelsProps } from "./channels.types";
import { renderChannelConfigSection } from "./channels.config";

export function renderSignalCard(params: {
  props: ChannelsProps;
  signal?: SignalStatus | null;
  accountCountLabel: unknown;
}) {
  const { props, signal, accountCountLabel } = params;

  return html`
    <div class="card">
      <div class="card-title">${t("channels.signal", "Signal")}</div>
      <div class="card-sub">${t("channels.signalSubtitle", "signal-cli status and channel configuration.")}</div>
      ${accountCountLabel}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">${t("common.configured", "Configured")}</span>
          <span>${signal?.configured ? t("common.yes", "Yes") : t("common.no", "No")}</span>
        </div>
        <div>
          <span class="label">${t("common.running", "Running")}</span>
          <span>${signal?.running ? t("common.yes", "Yes") : t("common.no", "No")}</span>
        </div>
        <div>
          <span class="label">${t("signal.baseUrl", "Base URL")}</span>
          <span>${signal?.baseUrl ?? t("common.na", "n/a")}</span>
        </div>
        <div>
          <span class="label">${t("signal.lastStart", "Last start")}</span>
          <span>${signal?.lastStartAt ? formatAgo(signal.lastStartAt) : t("common.na", "n/a")}</span>
        </div>
        <div>
          <span class="label">${t("signal.lastProbe", "Last probe")}</span>
          <span>${signal?.lastProbeAt ? formatAgo(signal.lastProbeAt) : t("common.na", "n/a")}</span>
        </div>
      </div>

      ${signal?.lastError
        ? html`<div class="callout danger" style="margin-top: 12px;">
            ${signal.lastError}
          </div>`
        : nothing}

      ${signal?.probe
        ? html`<div class="callout" style="margin-top: 12px;">
            ${t("signal.probe", "Probe")} ${signal.probe.ok ? t("common.ok", "ok") : t("common.failed", "failed")} ·
            ${signal.probe.status ?? ""} ${signal.probe.error ?? ""}
          </div>`
        : nothing}

      ${renderChannelConfigSection({ channelId: "signal", props })}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${() => props.onRefresh(true)}>
          ${t("signal.probe", "Probe")}
        </button>
      </div>
    </div>
  `;
}
