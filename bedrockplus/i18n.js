(() => {
  "use strict";
  const root = document.documentElement;
  const sections = [...document.querySelectorAll("main section[data-title]")];
  const navigation = document.querySelector("#doc-navigation");
  const search = document.querySelector("#doc-search");
  const searchEmpty = document.querySelector("#search-empty");
  const sidebar = document.querySelector("#sidebar");
  const menuButton = document.querySelector("#menu-button");
  const themeButton = document.querySelector("#theme-button");
  const languageSelect = document.querySelector("#language-select");
  const apiLanguageButtons = [...document.querySelectorAll("[data-api-language-select]")];
  const i18n = window.BedrockPlusI18n;
  let links = [];

  function slug(value) {
    return value.toLocaleLowerCase().replace(/[^a-z0-9+]+/g, "-").replace(/^-|-$/g, "");
  }

  function buildNavigation() {
    const groups = new Map();
    navigation.replaceChildren();
    for (const section of sections) {
      if (section.dataset.apiLanguage && section.dataset.apiLanguage !== root.dataset.apiLanguage) continue;
      const group = section.dataset.group || "Documentation";
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(section);
    }
    for (const [group, items] of groups) {
      const block = document.createElement("div");
      block.className = "nav-group";
      const label = document.createElement("span");
      label.className = "nav-group-label";
      label.textContent = i18n?.t("group." + slug(group), group) || group;
      block.append(label);
      for (const section of items) {
        const link = document.createElement("a");
        link.className = "nav-link";
        link.href = "#" + section.id;
        const heading = section.querySelector("h1, h2");
        link.textContent = heading?.textContent || section.dataset.title;
        link.dataset.section = section.id;
        link.addEventListener("click", () => {
          sidebar.classList.remove("open");
          menuButton.setAttribute("aria-expanded", "false");
        });
        block.append(link);
      }
      navigation.append(block);
    }
    links = [...document.querySelectorAll(".nav-link")];
  }

  i18n?.initialize(languageSelect);
  buildNavigation();
  document.addEventListener("bedrockplus:locale-changed", () => {
    buildNavigation();
    filterDocumentation();
    for (const button of document.querySelectorAll(".copy-button")) {
      button.textContent = i18n?.t("ui.copy", "Copy") || "Copy";
    }
  });
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting && !entry.target.classList.contains("search-hidden"))
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (!visible.length) return;
    const id = visible[0].target.id;
    for (const link of links) link.classList.toggle("active", link.dataset.section === id);
  }, { rootMargin: "-20% 0px -70% 0px" });
  sections.forEach((section) => observer.observe(section));

  function filterDocumentation() {
    const term = search.value.trim().toLocaleLowerCase();
    let visibleCount = 0;
    for (const section of sections) {
      const visible = !term || section.textContent.toLocaleLowerCase().includes(term);
      section.classList.toggle("search-hidden", !visible);
      const link = document.querySelector('[data-section="' + section.id + '"]');
      if (link) link.hidden = !visible;
      if (visible) visibleCount += 1;
    }
    for (const group of document.querySelectorAll(".nav-group")) {
      group.hidden = ![...group.querySelectorAll(".nav-link")].some((link) => !link.hidden);
    }
    searchEmpty.hidden = visibleCount !== 0;
  }
  search.addEventListener("input", filterDocumentation);
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== search) {
      event.preventDefault();
      search.focus();
    }
    if (event.key === "Escape") {
      search.value = "";
      filterDocumentation();
      search.blur();
      sidebar.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
  menuButton.addEventListener("click", () => {
    const open = sidebar.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  const storedTheme = localStorage.getItem("bedrockplus-doc-theme");
  if (storedTheme === "light" || storedTheme === "dark") root.dataset.theme = storedTheme;
  themeButton.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("bedrockplus-doc-theme", root.dataset.theme);
  });
  function setApiLanguage(language) {
    const selected = language === "cpp" ? "cpp" : "python";
    root.dataset.apiLanguage = selected;
    localStorage.setItem("bedrockplus-doc-api-language", selected);
    for (const button of apiLanguageButtons) {
      const active = button.dataset.apiLanguageSelect === selected;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    }
    buildNavigation();
    filterDocumentation();
  }
  for (const button of apiLanguageButtons) {
    button.addEventListener("click", () => setApiLanguage(button.dataset.apiLanguageSelect));
  }
  setApiLanguage(localStorage.getItem("bedrockplus-doc-api-language") || "python");
  for (const container of document.querySelectorAll("[data-tabs]")) {
    const tabs = [...container.querySelectorAll("[data-tab-target]")];
    const panels = [...container.querySelectorAll("[data-tab-panel]")];
    for (const tab of tabs) {
      tab.addEventListener("click", () => {
        for (const item of tabs) item.classList.toggle("active", item === tab);
        for (const panel of panels) panel.classList.toggle("active", panel.dataset.tabPanel === tab.dataset.tabTarget);
      });
    }
  }
  for (const pre of document.querySelectorAll("pre")) {
    const code = pre.querySelector("code");
    if (!code) continue;
    const button = document.createElement("button");
    button.className = "copy-button";
    button.type = "button";
    button.textContent = i18n?.t("ui.copy", "Copy") || "Copy";
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = i18n?.t("ui.copied", "Copied") || "Copied";
      } catch {
        button.textContent = i18n?.t("ui.selectText", "Select text") || "Select text";
      }
      window.setTimeout(() => { button.textContent = i18n?.t("ui.copy", "Copy") || "Copy"; }, 1500);
    });
    pre.append(button);
  }
})();
