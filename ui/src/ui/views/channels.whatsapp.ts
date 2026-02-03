import { html, nothing } from "lit";

import { t } from "../../i18n/index.js";
import { formatAgo } from "../format";
import type { WhatsAppStatus } from "../types";
import type { ChannelsProps } from "./channels.types";
import { renderChannelConfigSection } from "./channels.config";
import { formatDuration } from "./channels.shared";

export function renderWhatsAppCard(params: {
  props: ChannelsProps;
  whatsapp?: WhatsAppStatus;
  accountCountLabel: unknown;
}) {
  const { props, whatsapp, accountCountLabel } = params;

  return html`
    <div class="card">
      <div class="card-title">${t("channels.whatsapp", "WhatsApp")}</div>
      <div class="card-sub">${t("channels.whatsappSubtitle", "Link WhatsApp Web and monitor connection health.")}</div>
      ${accountCountLabel}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">${t("common.configured", "Configured")}</span>
          <span>${whatsapp?.configured ? t("common.yes", "Yes") : t("common.no", "No")}</span>
        </div>
        <div>
          <span class="label">${t("whatsapp.linked", "Linked")}</span>
          <span>${whatsapp?.linked ? t("common.yes", "Yes") : t("common.no", "No")}</span>
        </div>
        <div>
          <span class="label">${t("common.running", "Running")}</span>
          <span>${whatsapp?.running ? t("common.yes", "Yes") : t("common.no", "No")}</span>
        </div>
        <div>
          <span class="label">${t("common.connected", "Connected")}</span>
          <span>${whatsapp?.connected ? t("common.yes", "Yes") : t("common.no", "No")}</span>
        </div>
        <div>
          <span class="label">${t("whatsapp.lastConnect", "Last connect")}</span>
          <span>
            ${whatsapp?.lastConnectedAt
              ? formatAgo(whatsapp.lastConnectedAt)
              : t("common.na", "n/a")}
          </span>
        </div>
        <div>
          <span class="label">${t("whatsapp.lastMessage", "Last message")}</span>
          <span>
            ${whatsapp?.lastMessageAt ? formatAgo(whatsapp.lastMessageAt) : t("common.na", "n/a")}
          </span>
        </div>
        <div>
          <span class="label">${t("whatsapp.authAge", "Auth age")}</span>
          <span>
            ${whatsapp?.authAgeMs != null
              ? formatDuration(whatsapp.authAgeMs)
              : t("common.na", "n/a")}
          </span>
        </div>
      </div>

      ${whatsapp?.lastError
        ? html`<div class="callout danger" style="margin-top: 12px;">
            ${whatsapp.lastError}
          </div>`
        : nothing}

      ${props.whatsappMessage
        ? html`<div class="callout" style="margin-top: 12px;">
            ${props.whatsappMessage}
          </div>`
        : nothing}

      ${props.whatsappQrDataUrl
        ? html`<div class="qr-wrap">
            <img src=${props.whatsappQrDataUrl} alt="WhatsApp QR" />
          </div>`
        : nothing}

      <div class="row" style="margin-top: 14px; flex-wrap: wrap;">
        <button
          class="btn primary"
          ?disabled=${props.whatsappBusy}
          @click=${() => props.onWhatsAppStart(false)}
        >
          ${props.whatsappBusy ? t("whatsapp.working", "Working…") : t("whatsapp.showQr", "Show QR")}
        </button>
        <button
          class="btn"
          ?disabled=${props.whatsappBusy}
          @click=${() => props.onWhatsAppStart(true)}
        >
          ${t("whatsapp.relink", "Relink")}
        </button>
        <button
          class="btn"
          ?disabled=${props.whatsappBusy}
          @click=${() => props.onWhatsAppWait()}
        >
          ${t("whatsapp.waitForScan", "Wait for scan")}
        </button>
        <button
          class="btn danger"
          ?disabled=${props.whatsappBusy}
          @click=${() => props.onWhatsAppLogout()}
        >
          ${t("whatsapp.logout", "Logout")}
        </button>
        <button class="btn" @click=${() => props.onRefresh(true)}>
          ${t("common.refresh", "Refresh")}
        </button>
      </div>

      ${renderChannelConfigSection({ channelId: "whatsapp", props })}
    </div>
  `;
}
