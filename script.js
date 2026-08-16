/* ============================================================
   A TEAM SERIES / TEAM HQ – script.js
   Easy to extend: just add objects to the arrays below.
   ============================================================ */

// ----------------------------------------------------------
//  DATA  –  edit only this section when adding books / series
// ----------------------------------------------------------

/**
 * SERIES
 * id          – unique key (used for filtering)
 * name        – display name
 * badgeClass  – CSS class for the colored badge (danger | ace | coming)
 * description – short blurb
 * status      – "available" | "coming"
 * bookCount   – number shown in the meta (can be string like "3+")
 * tags        – optional extra labels
 */
const SERIES = [
  {
    id: "danger",
    name: "Danger Series",
    badgeClass: "danger",
    description:
      "When a mission goes wrong, everything changes. Follow Arrow Jade and the team as they race to uncover the truth and protect what matters most.",
    status: "available",
    bookCount: "3 books",
    tags: ["Action", "Family", "Mystery"],
  },
  {
    id: "ace",
    name: "Ace Shard",
    badgeClass: "ace",
    description:
      "A brand-new series is on the horizon. New characters. New stakes. Same TEAM HQ energy. Stay tuned for the first mission drop.",
    status: "coming",
    bookCount: "Coming Soon",
    tags: ["Action", "Adventure"],
  },
];

/**
 * BOOKS
 * id           – unique key
 * title        – full title
 * seriesId     – must match a SERIES.id
 * seriesOrder  – 1, 2, 3… (shown as “Book X in the Y Series”)
 * status       – "available" | "coming"
 * isNew        – true → shows “NEW RELEASE!” badge
 * cover        – image path (relative). If missing, a styled fallback is shown.
 * blurb        – short description for cards & modal
 * longBlurb    – optional longer text for the modal
 * author       – defaults to Ava Evans if omitted
 * year         – optional
 */
const BOOKS = [
  {
    id: "fwd",
    title: "Framed With Danger",
    seriesId: "danger",
    seriesOrder: 1,
    status: "available",
    isNew: true,
    cover: "FWD.JPG",          // place this file next to index.html (or in /images/)
    blurb:
      "When a mission goes wrong, everything changes. Now the truth is the only way out. The chase begins.",
    longBlurb:
      "Book 1 in the Danger Series. Arrow Jade and her team are thrust into a high-stakes mystery when a mission spirals out of control. Framed, hunted, and racing against time, they must uncover the truth before it’s too late. Family, courage, and loyalty are put to the ultimate test.",
    author: "Ava Evans",
  },
  {
    id: "pwd",
    title: "Programmed With Danger",
    seriesId: "danger",
    seriesOrder: 2,
    status: "available",
    isNew: false,
    cover: "PWD.png",
    blurb:
      "The secrets dig deeper. The danger is programmed. Arrow Jade and the team face their most complex mission yet.",
    longBlurb:
      "Book 2 in the Danger Series. The team discovers that the threat is more calculated than anyone imagined. Technology, deception, and old allies collide as Arrow Jade races to stay one step ahead. Trust is fragile. The code is lethal.",
    author: "Ava Evans",
  },
  {
    id: "rwd",
    title: "Rigged With Danger",
    seriesId: "danger",
    seriesOrder: 3,
    status: "coming",
    isNew: false,
    cover: "RWD.png",
    blurb:
      "The final pieces are in place. Everything is rigged. The ultimate showdown is coming.",
    longBlurb:
      "Book 3 in the Danger Series — Coming Soon. All the threads converge. All the secrets surface. Arrow Jade and the TEAM must face the truth head-on in the most dangerous mission yet. The endgame has begun.",
    author: "Ava Evans",
  },
];

// ----------------------------------------------------------
//  RENDER HELPERS
// ----------------------------------------------------------

function getSeriesById(id) {
  return SERIES.find((s) => s.id === id);
}

function createCoverFallback(book) {
  const words = book.title.split(" ");
  // Heuristic: first word(s) pink, last word green (matches ad style)
  const last = words.pop();
  const first = words.join(" ");
  return `
    <div class="cover-fallback">
      <span class="series-label">${getSeriesById(book.seriesId)?.name || ""} · Book ${book.seriesOrder}</span>
      <div class="title">
        <span class="word1">${first}</span><br>
        <span class="word2">${last}</span>
      </div>
      <span class="author">${book.author || "Ava Evans"}</span>
    </div>
  `;
}

function renderSeries() {
  const grid = document.getElementById("seriesGrid");
  if (!grid) return;

  grid.innerHTML = SERIES.map((s) => {
    const statusLabel = s.status === "coming" ? "Coming Soon" : "Available Now";
    const badgeClass = s.status === "coming" ? "coming" : s.badgeClass;
    return `
      <article class="series-card" data-series="${s.id}">
        <span class="series-badge ${badgeClass}">${statusLabel}</span>
        <h3>${s.name}</h3>
        <p>${s.description}</p>
        <div class="series-meta">
          <span>📚 ${s.bookCount}</span>
          ${s.tags.map((t) => `<span>#${t}</span>`).join("")}
        </div>
      </article>
    `;
  }).join("");
}

function renderBooks(filter = "all") {
  const grid = document.getElementById("booksGrid");
  if (!grid) return;

  const filtered = BOOKS.filter((book) => {
    if (filter === "all") return true;
    if (filter === "available") return book.status === "available";
    if (filter === "coming") return book.status === "coming";
    return book.seriesId === filter;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);">No books match this filter yet. New missions are on the way!</p>`;
    return;
  }

  grid.innerHTML = filtered
    .map((book) => {
      const series = getSeriesById(book.seriesId);
      const statusBadge = book.isNew
        ? `<span class="book-status new">New Release!</span>`
        : book.status === "coming"
        ? `<span class="book-status coming">Coming Soon</span>`
        : "";

      const coverContent = `
        <img src="${book.cover}" alt="Cover of ${book.title}" loading="lazy"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        ${createCoverFallback(book)}
      `;

      return `
        <article class="book-card" data-id="${book.id}" data-series="${book.seriesId}" data-status="${book.status}" tabindex="0" role="button" aria-label="View details for ${book.title}">
          <div class="book-cover">
            ${statusBadge}
            ${coverContent}
          </div>
          <div class="book-info">
            <span class="series-tag">${series ? series.name : ""} · Book ${book.seriesOrder}</span>
            <h3>${book.title}</h3>
            <p class="blurb">${book.blurb}</p>
            <span class="order">Book ${book.seriesOrder} of the ${series ? series.name : "series"}</span>
          </div>
        </article>
      `;
    })
    .join("");

  // Attach click / keyboard handlers
  grid.querySelectorAll(".book-card").forEach((card) => {
    card.addEventListener("click", () => openBookModal(card.dataset.id));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openBookModal(card.dataset.id);
      }
    });
  });
}

// ----------------------------------------------------------
//  MODAL
// ----------------------------------------------------------

function openBookModal(bookId) {
  const book = BOOKS.find((b) => b.id === bookId);
  if (!book) return;

  const series = getSeriesById(book.seriesId);
  const modal = document.getElementById("bookModal");
  const body = document.getElementById("modalBody");

  const coverHtml = `
    <div class="modal-cover">
      <img src="${book.cover}" alt="Cover of ${book.title}"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      ${createCoverFallback(book)}
    </div>
  `;

  body.innerHTML = `
    ${coverHtml}
    <div class="modal-info">
      <p class="series-line">${series ? series.name : ""} · Book ${book.seriesOrder}</p>
      <h2 id="modalTitle">${book.title}</h2>
      <p class="blurb">${book.longBlurb || book.blurb}</p>
      <div class="modal-meta">
        <span>${book.author || "Ava Evans"}</span>
        <span>${book.status === "coming" ? "Coming Soon" : "Available Now"}</span>
        ${book.isNew ? "<span>New Release</span>" : ""}
      </div>
      <a href="#contact" class="btn btn-primary" data-close>Join the Mission</a>
    </div>
  `;

  modal.hidden = false;
  document.body.style.overflow = "hidden";

  // Focus the close button for accessibility
  modal.querySelector(".modal-close")?.focus();
}

function closeModal() {
  const modal = document.getElementById("bookModal");
  modal.hidden = true;
  document.body.style.overflow = "";
}

// ----------------------------------------------------------
//  INTERACTIONS
// ----------------------------------------------------------

function initNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");

  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });

  // Close mobile nav when a link is clicked
  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });
}

function initFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderBooks(btn.dataset.filter);
    });
  });
}

function initModal() {
  const modal = document.getElementById("bookModal");
  modal?.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-close") || e.target.classList.contains("modal-backdrop")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });
}

function initForm() {
  const form = document.getElementById("missionForm");
  const note = document.getElementById("formNote");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get("name") || "Agent";

    // No backend – friendly success message
    note.textContent = `Welcome to the team, ${name}! HQ has received your transmission. Stay sharp.`;
    form.reset();

    setTimeout(() => {
      note.textContent = "";
    }, 6000);
  });
}

function initYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

// Smooth header background on scroll (subtle)
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 40) {
        header.style.background = "rgba(10, 10, 12, 0.95)";
      } else {
        header.style.background = "rgba(10, 10, 12, 0.85)";
      }
    },
    { passive: true }
  );
}

// ----------------------------------------------------------
//  BOOT
// ----------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  renderSeries();
  renderBooks("all");
  initNav();
  initFilters();
  initModal();
  initForm();
  initYear();
  initHeaderScroll();
});

/* ============================================================
   HOW TO ADD A NEW BOOK
   ----------------------------------------------------------
   1. Drop the cover image next to index.html (or in /images/).
   2. Copy an existing object in the BOOKS array and change:
        - id          (unique string)
        - title
        - seriesId    (must exist in SERIES)
        - seriesOrder (1, 2, 3…)
        - status      ("available" or "coming")
        - isNew       (true/false)
        - cover       (filename)
        - blurb / longBlurb
   3. Save. The grid and filters update automatically.

   HOW TO ADD A NEW SERIES
   ----------------------------------------------------------
   1. Add an object to the SERIES array (unique id).
   2. Optionally add a filter button in index.html:
        <button class="filter-btn" data-filter="your-id">Your Series</button>
   3. Add books that reference the new seriesId.
   ============================================================ */
