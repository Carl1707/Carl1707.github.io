(function () {
  const content = window.PAGE_CONTENT;
  if (!content) {
    return;
  }

  const $ = (selector) => document.querySelector(selector);
  const setText = (selector, text) => {
    const element = $(selector);
    if (element) {
      element.textContent = text;
    }
  };

  function renderProfile() {
    const profile = content.profile;
    setText("#greeting", profile.greeting);
    setText("#nickname", profile.nickname);
    setText("#role", profile.role);
    setText("#photo-caption", profile.photoCaption);
    setText("#footer-name", profile.nickname);

    const portrait = $("#portrait");
    portrait.src = profile.portrait;
    portrait.alt = profile.portraitAlt;

    const intro = $("#intro-lines");
    profile.intro.forEach((line) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = line;
      intro.appendChild(paragraph);
    });

    const tags = $("#tags");
    profile.tags.forEach((tag) => {
      const item = document.createElement("span");
      item.textContent = tag;
      tags.appendChild(item);
    });

    let messageIndex = 0;
    $("#portrait-prompt").addEventListener("click", () => {
      const message = profile.portraitMessages[messageIndex % profile.portraitMessages.length];
      setText("#portrait-message", message);
      messageIndex += 1;
    });
  }

  function renderData() {
    const data = content.data;
    setText("#data-title", data.title);
    setText("#data-description", data.description);
    setText("#dataset-label", data.label);
    setText("#data-status", data.status);
    setText("#chart-unit", `单位：${data.unit}`);

    if (!data.entries.length) {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "empty-chart";
      emptyMessage.textContent = "请在 content.js 中添加你的真实数据条目。";
      $("#bar-chart").appendChild(emptyMessage);
      return;
    }

    const values = data.entries.map((entry) => Math.max(0, Number(entry.value) || 0));
    const max = Math.max(...values);
    const scaleMax = Math.max(max, 1);
    const total = values.reduce((sum, value) => sum + value, 0);
    const average = total / values.length;
    const maxEntry = data.entries[values.indexOf(max)];

    $("#bar-chart").setAttribute(
      "aria-label",
      `${data.title}柱状图，最高值为${maxEntry.label}${max}${data.unit}`
    );

    data.entries.forEach((entry, index) => {
      const item = document.createElement("div");
      item.className = "bar-item";
      item.style.setProperty("--height", `${(values[index] / scaleMax) * 100}%`);
      item.style.setProperty("--delay", `${index * 70}ms`);
      const value = document.createElement("span");
      const bar = document.createElement("span");
      const label = document.createElement("span");
      value.className = "bar-value";
      value.textContent = values[index];
      bar.className = "bar";
      bar.setAttribute("aria-hidden", "true");
      label.className = "bar-label";
      label.textContent = entry.label;
      item.append(value, bar, label);
      $("#bar-chart").appendChild(item);
    });

    const statItems = [
      { value: average.toFixed(1), label: `日均${data.unit}` },
      { value: total.toFixed(1), label: `合计${data.unit}` },
      { value: maxEntry.label, label: "峰值日" }
    ];
    statItems.forEach((stat) => {
      const card = document.createElement("article");
      card.className = "stat-card glass reveal";
      const value = document.createElement("strong");
      const label = document.createElement("span");
      value.textContent = stat.value;
      label.textContent = stat.label;
      card.append(value, label);
      $("#stats").appendChild(card);
    });

    data.insights.forEach((insight) => {
      const item = document.createElement("li");
      item.textContent = insight;
      $("#insights").appendChild(item);
    });
  }

  function scatterPetals() {
    const field = $("#petal-field");
    for (let i = 0; i < 12; i += 1) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.style.setProperty("--left", `${8 + Math.random() * 84}%`);
      petal.style.setProperty("--drift", `${-34 + Math.random() * 68}px`);
      petal.style.setProperty("--fall-delay", `${Math.random() * 380}ms`);
      field.appendChild(petal);
      window.setTimeout(() => petal.remove(), 2300);
    }
  }

  function setUpEasterEgg() {
    const egg = content.egg;
    setText("#egg-title", egg.title);
    setText("#egg-description", egg.description);
    setText("#ticket-message", egg.idleMessage);

    let clicks = 0;
    $("#tea-button").addEventListener("click", () => {
      const button = $("#tea-button");
      clicks += 1;
      const message = egg.messages[(clicks - 1) % egg.messages.length];
      setText("#ticket-message", message);
      button.classList.remove("serving");
      void button.offsetWidth;
      button.classList.add("serving");

      if (clicks >= egg.unlockAt) {
        setText("#unlock-tip", egg.unlockMessage);
        scatterPetals();
      }
    });
  }

  function setUpTheme() {
    const toggle = $("#theme-toggle");
    const label = toggle.querySelector(".toggle-label");
    const storedTheme = window.localStorage.getItem("little-cafe-theme");
    if (storedTheme === "dusk") {
      document.body.classList.add("dusk");
      label.textContent = "晨光";
      toggle.setAttribute("aria-pressed", "true");
    } else {
      toggle.setAttribute("aria-pressed", "false");
    }

    toggle.addEventListener("click", () => {
      const isDusk = document.body.classList.toggle("dusk");
      label.textContent = isDusk ? "晨光" : "黄昏";
      toggle.setAttribute("aria-pressed", String(isDusk));
      window.localStorage.setItem("little-cafe-theme", isDusk ? "dusk" : "day");
    });
  }

  renderProfile();
  renderData();
  setUpEasterEgg();
  setUpTheme();
  setText("#year", new Date().getFullYear());
})();
