(() => {
  "use strict";

  const config = window.BedrockPlusSiteConfig || {};
  const locales = window.BedrockPlusLocales || {};
  const supportedRoutes = new Set([
    "home", "getting-started", "tutorials", "reference", "changelog", "report"
  ]);
  const supportedLanguages = new Set(["en", "ru", "tr", "tk"]);
  const supportedRuntimes = new Set(["python", "cpp"]);

  const pages = [...document.querySelectorAll("[data-page]")];
  const topLinks = [...document.querySelectorAll("[data-top-nav] [data-route]")];
  const sideNav = document.querySelector("[data-side-nav]");
  const languageSelect = document.querySelector("[data-language]");
  const runtimeButtons = [...document.querySelectorAll("[data-runtime-option]")];
  const menu = document.querySelector("[data-top-nav]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const searchDialog = document.querySelector("[data-search-dialog]");
  const searchInput = document.querySelector("[data-search-input]");
  const searchResults = document.querySelector("[data-search-results]");

  let language = localStorage.getItem("bedrockplus-language") ||
    navigator.language.slice(0, 2).toLowerCase();
  if (!supportedLanguages.has(language)) language = "en";
  let runtime = localStorage.getItem("bedrockplus-plugin-language") || "python";
  if (!supportedRuntimes.has(runtime)) runtime = "python";

  const text = (key) => locales[language]?.[key] ?? locales.en?.[key] ?? key;

  function applyProductMetadata() {
    document.querySelectorAll("[data-version]").forEach((node) => {
      node.textContent = config.productVersion || "1.1.0";
    });
    document.querySelectorAll("[data-api-version]").forEach((node) => {
      node.textContent = config.apiVersion || "1.1";
    });
    document.querySelectorAll("[data-bds-version]").forEach((node) => {
      node.textContent = config.bdsVersion || "1.26.52.3";
    });
  }

  function applyTranslations() {
    document.documentElement.lang = language;
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = text(node.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      node.placeholder = text(node.dataset.i18nPlaceholder);
    });
    languageSelect.value = language;
    document.title = `BedrockPlus ${config.productVersion || "1.1.0"} · ${text("nav.reference")}`;
  }

  function applyRuntime() {
    document.documentElement.dataset.runtime = runtime;
    runtimeButtons.forEach((button) => {
      const active = button.dataset.runtimeOption === runtime;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    document.querySelectorAll("[data-runtime-content]").forEach((node) => {
      node.hidden = node.dataset.runtimeContent !== runtime;
    });
  }

  function configureGithub() {
    const repository = String(config.githubRepositoryUrl || "").trim();
    const newIssue = String(config.githubNewIssueUrl || "").trim();
    document.querySelectorAll("[data-github]").forEach((link) => {
      const kind = link.dataset.github;
      const target = kind === "new-issue"
        ? newIssue
        : kind === "issues" && repository
          ? `${repository.replace(/\/$/, "")}/issues`
          : repository;
      if (/^https:\/\//i.test(target)) {
        link.href = target;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.onclick = null;
        link.classList.remove("is-unavailable");
        link.removeAttribute("aria-disabled");
        link.removeAttribute("title");
      } else {
        link.classList.add("is-unavailable");
        link.setAttribute("aria-disabled", "true");
        link.title = text("github.pending");
        link.onclick = (event) => {
          if (link.dataset.github === "repository") return;
          event.preventDefault();
        };
      }
    });
    document.querySelectorAll("[data-issue]").forEach((link) => {
      const issue = String(link.dataset.issue || "").trim();
      if (repository && /^[1-9][0-9]*$/.test(issue)) {
        link.href = `${repository.replace(/\/$/, "")}/issues/${issue}`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.hidden = false;
      } else {
        link.hidden = true;
      }
    });
  }

  function currentLocation() {
    const raw = location.hash.startsWith("#/") ? location.hash.slice(2) : "home";
    const [candidate, section = ""] = raw.split("/");
    return { route: supportedRoutes.has(candidate) ? candidate : "home", section };
  }

  function sectionTitle(section) {
    return section.querySelector("h1, h2, h3")?.textContent?.trim() || section.id;
  }

  function buildSideNav(page, route) {
    sideNav.replaceChildren();
    sideNav.dataset.label = text("sidebar.onPage");
    const targets = [...page.querySelectorAll("header[id], section[id]")];
    targets.forEach((target) => {
      const link = document.createElement("a");
      link.href = `#/${route}/${target.id}`;
      link.textContent = sectionTitle(target);
      link.dataset.sectionLink = target.id;
      sideNav.append(link);
    });
  }

  function renderRoute({ focus = false } = {}) {
    const { route, section } = currentLocation();
    const page = pages.find((candidate) => candidate.dataset.page === route) || pages[0];
    pages.forEach((candidate) => candidate.classList.toggle("active", candidate === page));
    topLinks.forEach((link) => {
      const active = link.dataset.route === route;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    buildSideNav(page, route);
    menu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    requestAnimationFrame(() => {
      const destination = section ? document.getElementById(section) : null;
      if (destination) destination.scrollIntoView({ block: "start" });
      else window.scrollTo({ top: 0, behavior: "instant" });
      if (focus) document.getElementById("main").focus({ preventScroll: true });
    });
  }

  function searchIndex() {
    const index = [];
    pages.forEach((page) => {
      const route = page.dataset.page;
      page.querySelectorAll("header[id], section[id]").forEach((section) => {
        const title = sectionTitle(section);
        const body = section.textContent.replace(/\s+/g, " ").trim();
        index.push({ route, id: section.id, title, body });
      });
    });
    return index;
  }

  function renderSearch(query) {
    searchResults.replaceChildren();
    const normalized = query.trim().toLocaleLowerCase(language);
    if (!normalized) {
      const hint = document.createElement("p");
      hint.textContent = text("search.hint");
      searchResults.append(hint);
      return;
    }
    const matches = searchIndex().filter((item) =>
      `${item.title} ${item.body}`.toLocaleLowerCase(language).includes(normalized)
    ).slice(0, 12);
    if (!matches.length) {
      const empty = document.createElement("p");
      empty.textContent = text("search.noResults");
      searchResults.append(empty);
      return;
    }
    matches.forEach((item) => {
      const link = document.createElement("a");
      link.className = "search-result";
      link.href = `#/${item.route}/${item.id}`;
      const routeName = document.querySelector(`[data-route="${item.route}"]`)?.textContent || item.route;
      link.innerHTML = `<small></small><strong></strong><span></span>`;
      link.querySelector("small").textContent = routeName;
      link.querySelector("strong").textContent = item.title;
      link.querySelector("span").textContent = item.body.slice(0, 145) + (item.body.length > 145 ? "…" : "");
      link.addEventListener("click", () => searchDialog.close());
      searchResults.append(link);
    });
  }

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const code = button.parentElement.querySelector("code")?.textContent || "";
      try {
        await navigator.clipboard.writeText(code);
        const original = button.textContent;
        button.textContent = text("code.copied");
        setTimeout(() => { button.textContent = original; }, 1400);
      } catch {
        button.textContent = text("code.copyFailed");
      }
    });
  });

  document.querySelector("[data-theme-toggle]").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("bedrockplus-theme", next);
  });
  document.documentElement.dataset.theme = localStorage.getItem("bedrockplus-theme") || "dark";

  languageSelect.addEventListener("change", () => {
    language = languageSelect.value;
    localStorage.setItem("bedrockplus-language", language);
    applyTranslations();
    configureGithub();
    renderRoute();
    renderSearch(searchInput.value);
  });

  runtimeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      runtime = button.dataset.runtimeOption;
      localStorage.setItem("bedrockplus-plugin-language", runtime);
      applyRuntime();
      renderRoute();
      renderSearch(searchInput.value);
    });
  });

  menuToggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  document.querySelector("[data-open-search]").addEventListener("click", () => {
    searchDialog.showModal();
    searchInput.focus();
  });
  searchInput.addEventListener("input", () => renderSearch(searchInput.value));
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
      event.preventDefault();
      searchDialog.showModal();
      searchInput.focus();
    }
    if (event.key === "Escape" && searchDialog.open) searchDialog.close();
  });

  window.addEventListener("hashchange", () => renderRoute({ focus: true }));
  applyProductMetadata();
  applyTranslations();
  applyRuntime();
  configureGithub();
  renderRoute();
})();
