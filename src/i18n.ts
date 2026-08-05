import de from "./lang/de";
import en from "./lang/en";

const LANGUAGE_PACKS = Object.freeze({
  de,
  en,
});

const languageCache = new Map<string, Record<string, string>>();
const languagePending = new Map<string, Promise<Record<string, string> | undefined>>();

export function normalizeLangCode(lang: unknown) {
  const raw = String(lang || "en").trim().toLowerCase();
  if (!raw) return "en";
  return raw.split("-")[0] || "en";
}

export async function ensureLanguage(lang: unknown) {
  const code = normalizeLangCode(lang);
  if (languageCache.has(code)) return languageCache.get(code);
  if (languagePending.has(code)) return languagePending.get(code);
  const pending = (async () => {
    try {
      const pack = LANGUAGE_PACKS[code];
      if (!pack) {
        if (code !== "en") {
          const fallback = await ensureLanguage("en");
          languageCache.set(code, fallback || {});
          return fallback;
        }
        languageCache.set(code, {});
        return languageCache.get(code);
      }
      languageCache.set(code, pack && typeof pack === "object" ? pack : {});
    } catch (_err) {
      if (code !== "en") {
        const fallback = await ensureLanguage("en");
        languageCache.set(code, fallback || {});
        return fallback;
      }
      languageCache.set(code, {});
    } finally {
      languagePending.delete(code);
    }
    return languageCache.get(code);
  })();
  languagePending.set(code, pending);
  return pending;
}

export function localize(key: string, lang: unknown, vars: Record<string, string> = {}) {
  const code = normalizeLangCode(lang);
  const base = languageCache.get(code) || {};
  let text = base?.[key] || key;
  if (!vars) return text;
  for (const k in vars) {
    if (!Object.prototype.hasOwnProperty.call(vars, k)) continue;
    text = text.replace(`{${k}}`, vars[k]);
  }
  return text;
}

export function getLang(hass: any) {
  return normalizeLangCode(hass?.locale?.language || hass?.language || "en");
}
