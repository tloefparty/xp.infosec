// XP — 2nd Revision Prototype Logic

const state = { tier: "all", location: "all", max_hours: null };

// Deleted quests stack for View/Restore functionality
let DELETED_QUESTS = [];
let activeModalQuest = null;
let pendingDeleteId = null;

// DOM element selectors
const grid = document.getElementById("quest-grid");
const resultsCount = document.getElementById("results-count");
const hoursRange = document.getElementById("hours-range");
const hoursValue = document.getElementById("hours-value");
const locationSelect = document.getElementById("location-select");
const statQuestCount = document.getElementById("stat-quest-count");
const statTotalXp = document.getElementById("stat-total-xp");
const dynamicQuestForm = document.getElementById("dynamic-quest-form");
const qTierSelect = document.getElementById("q-tier");
const financialLabel = document.getElementById("financial-label");
const deletedCountSpan = document.getElementById("deleted-count");

// Modal elements
const questModal = document.getElementById("quest-modal");
const closeQuestModal = document.getElementById("close-quest-modal");
const closeQuestModalBtn = document.getElementById("close-quest-modal-btn");
const acceptQuestBtn = document.getElementById("accept-quest-btn");
const modalTitle = document.getElementById("modal-title");
const modalOrg = document.getElementById("modal-org");
const modalDesc = document.getElementById("modal-desc");
const modalMeta = document.getElementById("modal-meta");

const deleteModal = document.getElementById("delete-modal");
const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
const cancelDeleteBtn = document.getElementById("cancel-delete-btn");

const restoreModal = document.getElementById("restore-modal");
const openRestoreModalBtn = document.getElementById("open-restore-modal-btn");
const closeRestoreModal = document.getElementById("close-restore-modal");
const restoreList = document.getElementById("restore-list");

// Conditional input labeling for dynamic quest form
if (qTierSelect && financialLabel) {
  qTierSelect.addEventListener("change", (e) => {
    const qMoneyInput = document.getElementById("q-money");
    if (qMoneyInput) {
      if (e.target.value === "free") {
        financialLabel.style.opacity = "0.4";
        qMoneyInput.value = "0";
        qMoneyInput.disabled = true;
      } else {
        financialLabel.style.opacity = "1";
        qMoneyInput.disabled = false;
      }
    }
  });
}

// Emphasize/bold first 2 words of entries for readability (Clarence's recommendation)
function formatHighlightedTitle(title) {
  const words = title.split(" ");
  if (words.length <= 2) return `<strong>${title}</strong>`;
  const boldPart = words.slice(0, 2).join(" ");
  const restPart = words.slice(2).join(" ");
  return `<strong>${boldPart}</strong> ${restPart}`;
}

function filterQuests() {
  let results = typeof QUESTS !== 'undefined' ? QUESTS : [];

  if (state.tier !== "all") {
    results = results.filter((q) => q.tier === state.tier);
  }
  if (state.location !== "all") {
    results = results.filter((q) => q.location === state.location);
  }
  if (state.max_hours !== null) {
    results = results.filter((q) => q.time_hours <= state.max_hours);
  }

  return results.sort((a, b) => b.xp - a.xp);
}

function questCardHTML(q) {
  const label = (typeof TIER_LABELS !== 'undefined' && TIER_LABELS[q.tier]) ? TIER_LABELS[q.tier] : q.tier;
  
  const moneyBit =
    q.tier === "premium"
      ? `<span class="quest-money">₱${q.cost || 0} entry fee</span>`
      : q.tier === "paid"
      ? `<span class="quest-money">₱${q.payout || 0} (Gets Paid)</span>`
      : `<span class="quest-money" style="color: var(--mint);">Free (Just for fun)</span>`;

  const formattedTitle = formatHighlightedTitle(q.title);

  return `
    <article class="quest-card tier-${q.tier}" id="card-${q.id}" onclick="openQuestModal('${q.id}')">
      <button class="chore-delete" onclick="event.stopPropagation(); promptDelete('${q.id}')" aria-label="Delete quest" title="Delete quest" style="position: absolute; top: 12px; right: 12px; background: transparent; border: none; font-size: 0.95rem; color: var(--coral); cursor: pointer;">✕</button>
      <div class="quest-top" style="padding-right: 20px;">
        <div>
          <p class="quest-title">${formattedTitle}</p>
          <p class="quest-org">${q.org}</p>
        </div>
        <span class="quest-xp">+${q.xp} XP</span>
      </div>
      <p class="quest-desc">${q.description}</p>
      <div class="quest-meta">
        <span>${label}</span>
        <span>${q.location.replace("-", " ")}</span>
        <span>${q.time_hours} hrs</span>
        ${moneyBit}
      </div>
    </article>
  `;
}

function renderQuests() {
  if (!grid || !resultsCount) return;
  const results = filterQuests();
  resultsCount.textContent = results.length;

  if (results.length === 0) {
    grid.innerHTML = `<p class="empty-state">No tasks or events match your current view filters.</p>`;
    return;
  }
  grid.innerHTML = results.map(questCardHTML).join("");
}

function renderHeroStats() {
  const currentQuests = typeof QUESTS !== 'undefined' ? QUESTS : [];
  if (statQuestCount) statQuestCount.textContent = currentQuests.length;
  if (statTotalXp) statTotalXp.textContent = currentQuests.reduce((sum, q) => sum + q.xp, 0);
  if (deletedCountSpan) deletedCountSpan.textContent = DELETED_QUESTS.length;
}

// ----- Modal Actions -----
window.openQuestModal = function(id) {
  const allQ = [...QUESTS, ...DELETED_QUESTS];
  const q = allQ.find(item => item.id === id);
  if (!q) return;
  activeModalQuest = q;

  modalTitle.textContent = q.title;
  modalOrg.textContent = `Organizer: ${q.org}`;
  modalDesc.textContent = q.description;

  const label = (typeof TIER_LABELS !== 'undefined' && TIER_LABELS[q.tier]) ? TIER_LABELS[q.tier] : q.tier;
  const moneyBit =
    q.tier === "premium"
      ? `<span class="quest-money">₱${q.cost || 0} entry fee</span>`
      : q.tier === "paid"
      ? `<span class="quest-money">₱${q.payout || 0} payout</span>`
      : `<span class="quest-money" style="color: var(--mint);">Free task</span>`;

  modalMeta.innerHTML = `
    <span>Tier: ${label}</span>
    <span>Location: ${q.location.replace("-", " ")}</span>
    <span>Duration: ${q.time_hours} hrs</span>
    <span>Award: +${q.xp} XP</span>
    ${moneyBit}
  `;

  questModal.hidden = false;
};

if (closeQuestModal) closeQuestModal.addEventListener("click", () => questModal.hidden = true);
if (closeQuestModalBtn) closeQuestModalBtn.addEventListener("click", () => questModal.hidden = true);
if (acceptQuestBtn) acceptQuestBtn.addEventListener("click", () => {
  alert(`Successfully accepted quest: "${activeModalQuest.title}"! Added to your active side quests.`);
  questModal.hidden = true;
});

// Delete confirmation workflow
window.promptDelete = function(id) {
  pendingDeleteId = id;
  deleteModal.hidden = false;
};

if (cancelDeleteBtn) cancelDeleteBtn.addEventListener("click", () => {
  deleteModal.hidden = true;
  pendingDeleteId = null;
});

if (confirmDeleteBtn) confirmDeleteBtn.addEventListener("click", () => {
  if (pendingDeleteId && typeof QUESTS !== 'undefined') {
    const idx = QUESTS.findIndex(q => q.id === pendingDeleteId);
    if (idx !== -1) {
      const removed = QUESTS.splice(idx, 1)[0];
      DELETED_QUESTS.push(removed);
    }
    renderHeroStats();
    renderQuests();
  }
  deleteModal.hidden = true;
  pendingDeleteId = null;
});

// Restore modal workflow
if (openRestoreModalBtn) openRestoreModalBtn.addEventListener("click", () => {
  renderRestoreList();
  restoreModal.hidden = false;
});
if (closeRestoreModal) closeRestoreModal.addEventListener("click", () => restoreModal.hidden = true);

function renderRestoreList() {
  if (!restoreList) return;
  if (DELETED_QUESTS.length === 0) {
    restoreList.innerHTML = `<p style="text-align: center; color: var(--ink-soft); font-family: var(--font-mono); font-size: 0.82rem; padding: 12px;">No deleted quests to restore.</p>`;
    return;
  }
  restoreList.innerHTML = DELETED_QUESTS.map(q => `
    <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg); padding: 10px 14px; border-radius: 10px; border: 1px solid var(--line);">
      <div>
        <strong>${q.title}</strong>
        <div style="font-size: 0.78rem; color: var(--ink-soft);">${q.org} (+${q.xp} XP)</div>
      </div>
      <button class="btn btn-primary btn-small" onclick="restoreQuest('${q.id}')">Restore</button>
    </div>
  `).join("");
}

window.restoreQuest = function(id) {
  const idx = DELETED_QUESTS.findIndex(q => q.id === id);
  if (idx !== -1) {
    const restored = DELETED_QUESTS.splice(idx, 1)[0];
    QUESTS.unshift(restored);
  }
  renderHeroStats();
  renderQuests();
  renderRestoreList();
  if (DELETED_QUESTS.length === 0) {
    restoreModal.hidden = true;
  }
};

// Handle submission of new task form
if (dynamicQuestForm) {
  dynamicQuestForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("q-title").value.trim();
    const org = document.getElementById("q-org").value.trim();
    const desc = document.getElementById("q-desc").value.trim();
    const tier = document.getElementById("q-tier").value;
    const location = document.getElementById("q-location").value;
    const moneyVal = Number(document.getElementById("q-money").value) || 0;
    const hours = Number(document.getElementById("q-hours").value) || 1;
    const xp = Number(document.getElementById("q-xp").value) || 100;

    const newQuest = {
      id: "custom-" + Date.now(),
      tier,
      title,
      org,
      description: desc,
      time_hours: hours,
      location,
      xp
    };

    if (tier === "paid") {
      newQuest.payout = moneyVal;
    } else if (tier === "premium") {
      newQuest.cost = moneyVal;
    } else {
      newQuest.payout = 0;
    }

    if (typeof QUESTS !== 'undefined') {
      QUESTS.unshift(newQuest);
    }
    
    dynamicQuestForm.reset();
    if (financialLabel) financialLabel.style.opacity = "1";
    const qMoneyInput = document.getElementById("q-money");
    if (qMoneyInput) qMoneyInput.disabled = false;
    
    renderHeroStats();
    renderQuests();
    
    const targetSection = document.getElementById("quests");
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// ----- Filter controls -----
document.querySelectorAll('.chip[data-filter="tier"]').forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll('.chip[data-filter="tier"]').forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    state.tier = chip.dataset.value;
    renderQuests();
  });
});

if (locationSelect) {
  locationSelect.addEventListener("change", (e) => {
    state.location = e.target.value;
    renderQuests();
  });
}

if (hoursRange) {
  hoursRange.addEventListener("input", (e) => {
    const val = Number(e.target.value);
    if (hoursValue) {
      if (val >= 16) {
        state.max_hours = null;
        hoursValue.textContent = "Any";
      } else {
        state.max_hours = val;
        hoursValue.textContent = `${val} hrs or less`;
      }
    }
    renderQuests();
  });
}

// ----- Dark mode -----
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle ? themeToggle.querySelector(".theme-icon") : null;

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  if (themeIcon) themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
  localStorage.setItem("xp-theme", theme);
}

function initTheme() {
  const saved = localStorage.getItem("xp-theme");
  if (saved) {
    applyTheme(saved);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });
}

// ----- Profile: name, class, avatar -----
const DEFAULT_PROFILE = { name: "Ajax", cls: "Second-year Student", avatar: "🎒" };

const displayName = document.getElementById("display-name");
const displayClass = document.getElementById("display-class");
const avatarBtn = document.getElementById("avatar-btn");
const editProfileBtn = document.getElementById("edit-profile-btn");
const cancelProfileBtn = document.getElementById("cancel-profile-btn");
const profileForm = document.getElementById("profile-form");
const inputName = document.getElementById("input-name");
const inputClass = document.getElementById("input-class");
const avatarOptions = document.getElementById("avatar-options");

function loadProfile() {
  const saved = localStorage.getItem("xp-profile");
  return saved ? JSON.parse(saved) : { ...DEFAULT_PROFILE };
}

function saveProfile(profile) {
  localStorage.setItem("xp-profile", JSON.stringify(profile));
}

function renderProfile(profile) {
  if (displayName) displayName.textContent = profile.name || DEFAULT_PROFILE.name;
  if (displayClass) displayClass.textContent = `Class: ${profile.cls || DEFAULT_PROFILE.cls}`;
  if (avatarBtn) avatarBtn.textContent = profile.avatar || DEFAULT_PROFILE.avatar;

  if (avatarOptions) {
    avatarOptions.querySelectorAll("button").forEach((btn) => {
      btn.classList.toggle("is-selected", btn.dataset.avatar === (profile.avatar || DEFAULT_PROFILE.avatar));
    });
  }
}

let currentProfile = loadProfile();
let pendingAvatar = currentProfile.avatar || DEFAULT_PROFILE.avatar;

function openEditor() {
  if (inputName) inputName.value = currentProfile.name || "";
  if (inputClass) inputClass.value = currentProfile.cls || "";
  pendingAvatar = currentProfile.avatar || DEFAULT_PROFILE.avatar;
  if (avatarOptions) {
    avatarOptions.querySelectorAll("button").forEach((btn) => {
      btn.classList.toggle("is-selected", btn.dataset.avatar === pendingAvatar);
    });
  }
  if (profileForm) profileForm.hidden = false;
  if (editProfileBtn) editProfileBtn.hidden = true;
  if (inputName) inputName.focus();
}

function closeEditor() {
  if (profileForm) profileForm.hidden = true;
  if (editProfileBtn) editProfileBtn.hidden = false;
}

if (editProfileBtn) editProfileBtn.addEventListener("click", openEditor);
if (avatarBtn) avatarBtn.addEventListener("click", openEditor);
if (cancelProfileBtn) cancelProfileBtn.addEventListener("click", closeEditor);

if (avatarOptions) {
  avatarOptions.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-avatar]");
    if (!btn) return;
    pendingAvatar = btn.dataset.avatar;
    avatarOptions.querySelectorAll("button").forEach((b) => b.classList.remove("is-selected"));
    btn.classList.add("is-selected");
  });
}

if (profileForm) {
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    currentProfile = {
      name: inputName ? inputName.value.trim() || DEFAULT_PROFILE.name : DEFAULT_PROFILE.name,
      cls: inputClass ? inputClass.value.trim() || DEFAULT_PROFILE.cls : DEFAULT_PROFILE.cls,
      avatar: pendingAvatar,
    };
    saveProfile(currentProfile);
    renderProfile(currentProfile);
    closeEditor();
  });
}

// ----- Init -----
window.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderHeroStats();
  renderQuests();
  renderProfile(currentProfile);
});