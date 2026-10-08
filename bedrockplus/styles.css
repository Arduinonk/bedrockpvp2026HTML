(() => {
  "use strict";
  const locales = new Map();
  const storageKey = "bedrockplus-doc-locale";
  const originalText = new WeakMap();
  const originalPlaceholders = new WeakMap();
  const originalLabels = new WeakMap();
  let active = "en";

  function registerLocale(code, catalog) {
    if (!code || !catalog || typeof catalog.messages !== "object") return;
    locales.set(code.toLowerCase(), catalog);
  }

  function translate(key, fallback = "") {
    const selected = locales.get(active)?.messages?.[key];
    const english = locales.get("en")?.messages?.[key];
    return selected ?? english ?? fallback;
  }

  function applyLocale(code) {
    active = locales.has(code) ? code : "en";
    const catalog = locales.get(active) || locales.get("en") || {};
    document.documentElement.lang = active;
    document.documentElement.dir = catalog.dir || "ltr";
    for (const element of document.querySelectorAll("[data-i18n]")) {
      if (!originalText.has(element)) originalText.set(element, element.textContent);
      element.textContent = translate(element.dataset.i18n, originalText.get(element) || "");
    }
    for (const element of document.querySelectorAll("[data-i18n-placeholder]")) {
      if (!originalPlaceholders.has(element)) originalPlaceholders.set(element, element.placeholder);
      element.placeholder = translate(element.dataset.i18nPlaceholder, originalPlaceholders.get(element) || "");
    }
    for (const element of document.querySelectorAll("[data-i18n-aria-label]")) {
      if (!originalLabels.has(element)) originalLabels.set(element, element.getAttribute("aria-label") || "");
      element.setAttribute("aria-label", translate(element.dataset.i18nAriaLabel, originalLabels.get(element) || ""));
    }
    localStorage.setItem(storageKey, active);
    document.dispatchEvent(new CustomEvent("bedrockplus:locale-changed"));
  }

  function initialize(select) {
    if (select) {
      select.replaceChildren();
      for (const [code, catalog] of locales) {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = catalog.nativeName || code;
        select.append(option);
      }
      select.addEventListener("change", () => applyLocale(select.value));
    }
    const stored = localStorage.getItem(storageKey);
    const browserLanguage = navigator.language?.split("-")[0]?.toLowerCase();
    const preferred = stored && locales.has(stored) ? stored : (locales.has(browserLanguage) ? browserLanguage : "en");
    if (select) select.value = preferred;
    applyLocale(preferred);
  }

  window.BedrockPlusI18n = { registerLocale, initialize, applyLocale, t: translate };
})();
