/* ============================================================
   A TEAM SERIES / TEAM HQ – script.js
   Official site: ateamseries.com
   Easy to extend: add objects to SERIES / BOOKS arrays.
   ============================================================ */

const SERIES = [
  {
    id: "arrowjade",
    name: "Arrow Jade",
    badgeClass: "arrowjade",
    description:
      "When a mission goes wrong, everything changes. Follow Arrow Jade and her team as they race to uncover the truth and protect what matters most.",
    status: "available",
    bookCount: "3 books",
    tags: ["Action", "Adventure", "Mystery"],
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

const BOOKS = [
  {
    id: "fwd",
    title: "Framed With Danger",
    seriesId: "arrowjade",
    seriesOrder: 1,
    status: "available",
    isNew: true,
    cover: "FWD.JPG",
    blurb:
      "Follow us—and by us, I mean my family and I, as we embark on the biggest adventure of our lives. It started as any other mission, but exploded into something amazing.",
    longBlurb:
      "Follow us—and by us, I mean my family and I, as we embark on the biggest adventure of our lives. It started as any other mission, but exploded into something amazing. How can I say 'amazing,' especially given all the danger we went through? Because something I’ve learned from the two years I’ve written about is: Life has its own way of turning out. It can be horrible, amazing, and it can completely change in an instant of time. For us, that change happened in the blink of a light. You’ll understand what I mean later. For now, though… I just hope you enjoy the story.\n— Arrow Jade",
    author: "Skyler Hensley",
    buyUrl: "https://www.lulu.com/search?sortBy=RELEVANCE&page=1&q=Skyler+Hensley&pageSize=10&adult_audience_rating=00",
  },
  {
    id: "pwd",
    title: "Programmed With Danger",
    seriesId: "arrowjade",
    seriesOrder: 2,
    status: "available",
    isNew: false,
    cover: "PWD.png",
    blurb:
      "Follow us to X. We have Oray beside us, but that’s not much of a comfort. Questions still remain: Can we trust her? Without spoiling it… there are two ways to find things out, the easy way or the hard way.",
    longBlurb:
      "Follow us to X. We have Oray beside us, but that’s not much of a comfort. Questions still remain: Can we trust her? Without spoiling it, I’ll tell you this: There are two ways to find things out, the easy way or the hard way. We also find out that we’ll be up against robots. Robots that don’t have a conscience and follow orders from none other than Raven and Ivy. So, let me just say that I hope you enjoy the story more than we did at the time.\n— Arrow Jade",
    author: "Skyler Hensley",
    buyUrl: "https://www.lulu.com/search?sortBy=RELEVANCE&page=1&q=Skyler+Hensley&pageSize=10&adult_audience_rating=00",
  },
  {
    id: "rwd",
    title: "Rigged With Danger",
    seriesId: "arrowjade",
    seriesOrder: 3,
    status: "coming",
    isNew: false,
    cover: "RWD.png",
    blurb:
      "The final pieces are in place. Everything is rigged. The ultimate showdown is coming.",
    longBlurb:
      "Book 3 in the Arrow Jade series — Coming Soon. All the threads converge. All the secrets surface. Arrow Jade and the TEAM must face the truth head-on in the most dangerous mission yet. The endgame has begun.",
    author: "Skyler Hensley",
    buyUrl: "https://www.lulu.com/search?sortBy=RELEVANCE&page=1&q=Skyler+Hensley&pageSize=10&adult_audience_rating=00",
  },
];

const BUY_ALL_URL =
  "https://www.lulu.com/search?sortBy=RELEVANCE&page=1&q=Skyler+Hensley&pageSize=10&adult_audience_rating=00";

// ----------------------------------------------------------
//  RENDER HELPERS
// ----------------------------------------------------------

function getSeriesById(id) {
  return SERIES.find((s) => s.id === id);
}

function createCoverFallback(book) {
  const words = book.title.split(" ");
  const last = words.pop();
  const first = words.join(" ");
  return `
    <div class="cover-fallback" style="display:none;">
      <span class="series-label">${getSeriesById(book.seriesId)?.name || ""} · Book ${book.seriesOrder}</span>
      <div class="title">
        <span class="word1">${first}</span><br>
        <span class="word2">${last}</span>
      </div>
      <span class="author">${book.author || "Skyler Hensley"}</span>
    </div>
  `;
}

function renderSeries() {
  const grid = document.getElementById("seriesGrid");
  if (!grid) return;

  grid.innerHTML = SERIES.map((s, i) => {
    const statusLabel = s.status === "coming" ? "Coming Soon" : "Available Now";
    const badgeClass = s.status === "coming" ? "coming" : s.badgeClass;
    return `
      <article class="series-card animate-in" style="--delay:${i * 0.1}s" data-series="${s.id}">
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
    grid.innerHTML = `<p class="empty-msg">No books match this filter yet. New missions are on the way!</p>`;
    return;
  }

  grid.innerHTML = filtered
    .map((book, i) => {
      const series = getSeriesById(book.seriesId);
      const statusBadge = book.isNew
        ? `<span class="book-status new">New Release!</span>`
        : book.status === "coming"
        ? `<span class="book-status coming">Coming Soon</span>`
        : "";

      const coverContent = `
        <img src="${book.cover}" alt="Cover of ${book.title}" loading="lazy"
             onerror="this.style.display='none'; var fb=this.nextElementSibling; if(fb){fb.style.display='flex';}">
        ${createCoverFallback(book)}
      `;

      const buyBtn =
        book.status === "available"
          ? `<a href="${book.buyUrl || BUY_ALL_URL}" class="btn btn-buy" target="_blank" rel="noopener" onclick="event.stopPropagation()">Buy Now</a>`
          : `<span class="btn btn-disabled">Coming Soon</span>`;

      return `
        <article class="book-card animate-in" style="--delay:${i * 0.08}s" data-id="${book.id}" data-series="${book.seriesId}" data-status="${book.status}" tabindex="0" role="button" aria-label="View details for ${book.title}">
          <div class="book-cover">
            ${statusBadge}
            ${coverContent}
          </div>
          <div class="book-info">
            <span class="series-tag">${series ? series.name : ""} · Book ${book.seriesOrder}</span>
            <h3>${book.title}</h3>
            <p class="blurb">${book.blurb}</p>
            <div class="book-actions">
              ${buyBtn}
              <button type="button" class="btn btn-outline-sm details-btn">Details</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  grid.querySelectorAll(".book-card").forEach((card) => {
    const open = () => openBookModal(card.dataset.id);
    card.addEventListener("click", (e) => {
      if (e.target.closest("a.btn-buy")) return;
      open();
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
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
           onerror="this.style.display='none'; var fb=this.nextElementSibling; if(fb){fb.style.display='flex';}">
      ${createCoverFallback(book)}
    </div>
  `;

  const buyBlock =
    book.status === "available"
      ? `<a href="${book.buyUrl || BUY_ALL_URL}" class="btn btn-primary" target="_blank" rel="noopener">Buy on Lulu</a>`
      : `<span class="btn btn-disabled">Coming Soon</span>`;

  const longText = (book.longBlurb || book.blurb).replace(/\n/g, "<br>");

  body.innerHTML = `
    ${coverHtml}
    <div class="modal-info">
      <p class="series-line">${series ? series.name : ""} · Book ${book.seriesOrder}</p>
      <h2 id="modalTitle">${book.title}</h2>
      <p class="blurb">${longText}</p>
      <div class="modal-meta">
        <span>${book.author || "Skyler Hensley"}</span>
        <span>${book.status === "coming" ? "Coming Soon" : "Available Now"}</span>
        ${book.isNew ? "<span>New Release</span>" : ""}
      </div>
      <div class="modal-actions">
        ${buyBlock}
        <a href="#contact" class="btn btn-outline" data-close>Join the Mission</a>
      </div>
    </div>
  `;

  modal.hidden = false;
  document.body.style.overflow = "hidden";
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
    if (e.key === "Escape" && modal && !modal.hidden) closeModal();
  });
}

function initForm() {
  const form = document.getElementById("missionForm");
  const note = document.getElementById("formNote");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get("name") || "Agent";
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

function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  window.addEventListener(
    "scroll",
    () => {
      header.classList.toggle("scrolled", window.scrollY > 40);
    },
    { passive: true }
  );
}

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".animate-in, .section-header, .mission-card, .about-card, .cta-banner, .contact-inner").forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });
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
  // slight delay so cards exist before observing
  requestAnimationFrame(() => initReveal());
});
