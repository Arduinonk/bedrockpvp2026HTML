# BedrockPlus website v2

This is an independent static redesign. The published v1 website remains in
`docs/site` and is not read, modified, or replaced by v2.

## Local preview

From the repository root:

```powershell
.tools\venvs\development\Scripts\python.exe -m http.server 8010 --directory docs\site-v2
```

Then open `http://localhost:8010/`.

## Connect the future support repository

Edit only `site-config.js`:

```js
githubRepositoryUrl: "https://github.com/OWNER/REPOSITORY",
githubNewIssueUrl: "https://github.com/OWNER/REPOSITORY/issues/new/choose"
```

The public repository may contain issue templates, discussions, release notes,
and documentation only. It does not need the private BedrockPlus source code.
Until both URLs are configured, the website presents the repository as not yet
connected and does not send visitors to a placeholder address.

## Reference a real issue from the changelog

After an issue exists, add an anchor beside the exact changelog item:

```html
<a data-issue="42">#42</a>
```

The site derives the full URL from `githubRepositoryUrl`. If the repository is
not configured, issue anchors remain hidden. Never add invented issue numbers.

## Languages

Every visible `data-i18n` key must exist in `locales/en.js`, `ru.js`, `tr.js`,
and `tk.js`. English remains the safe fallback when a translation is missing.
