# Translating the BedrockPlus documentation

The English HTML is always the fallback, so a missing translation never leaves an empty label.

1. Copy an existing complete catalog such as `locales/tr.js` to `locales/<language-code>.js`.
2. Change the locale code, `nativeName`, direction (`ltr` or `rtl`), and every translated message value. Keep every message key unchanged.
3. Add `<script defer src="locales/<language-code>.js"></script>` after `locales/en.js` in `index.html`.
4. Open the site and choose the language from the header. The preference is remembered in the browser.

Use stable `data-i18n="key"` attributes for visible text, `data-i18n-placeholder` for inputs, and `data-i18n-aria-label` for accessibility labels. Navigation uses `nav.<section-id>` and group names use `group.<lowercase-hyphenated-name>`. When a key is absent, the system uses English and then the original HTML.

Every non-English catalog must contain every `data-i18n`, `data-i18n-placeholder`,
and `data-i18n-aria-label` key used by the page. The documentation test rejects an
incomplete catalog. English prose remains in the HTML as the stable fallback.
Do not put HTML markup inside catalog values; keep code examples and API
identifiers unchanged. The Python/C++ selector is independent from the interface
language, so translations should describe both runtimes without changing code.
