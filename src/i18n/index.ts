/**
 * Moltbot 国际化 (i18n) 模块
 * 支持中英文切换
 */

import { zhCNTranslations } from "./translations/zh-CN.js";
import { enTranslations } from "./translations/en.js";

export type Locale = "zh-CN" | "en";

export interface Translations {
  [key: string]: string | Translations;
}

// 当前语言环境 - 默认中文
let currentLocale: Locale = "zh-CN";

// 翻译字典
const translations: Record<Locale, Translations> = {
  "zh-CN": zhCNTranslations,
  en: enTranslations,
};

/**
 * 设置当前语言
 */
export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

/**
 * 获取当前语言
 */
export function getLocale(): Locale {
  return currentLocale;
}

/**
 * 注册翻译
 */
export function registerTranslations(locale: Locale, dict: Translations): void {
  translations[locale] = { ...translations[locale], ...dict };
}

/**
 * 获取翻译值
 * 支持嵌套路径，如 "tabs.chat.title"
 */
export function t(key: string, fallback?: string): string {
  const keys = key.split(".");
  let value: unknown = translations[currentLocale];

  for (const k of keys) {
    if (value === null || typeof value !== "object") {
      return fallback ?? key;
    }
    value = (value as Record<string, unknown>)[k];
  }

  if (typeof value === "string") {
    return value;
  }

  return fallback ?? key;
}

/**
 * 模板翻译 - 支持变量替换
 * 例如: t('hello', { name: 'World' }) => "Hello, World!"
 */
export function tTemplate(key: string, vars: Record<string, string>): string {
  let value = t(key, key);
  for (const [k, v] of Object.entries(vars)) {
    value = value.replace(new RegExp(`{{${k}}}`, "g"), v);
  }
  return value;
}

// 从环境变量读取语言设置
export function initLocaleFromEnv(): void {
  const envLang = process.env.CLAWDBOT_LANG;
  if (envLang === "zh" || envLang === "zh-CN") {
    currentLocale = "zh-CN";
  } else if (envLang === "en") {
    currentLocale = "en";
  }
}

// 初始化
initLocaleFromEnv();
