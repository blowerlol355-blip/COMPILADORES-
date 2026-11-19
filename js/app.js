/**
 * OpenCompilers Hub - Main Application Script
 * Control de animaciones, interactividad, estado de lectura y renderizado dinámico.
 */

// Estado global de la aplicación
const AppState = {
  activeCategory: "todos",
  searchQuery: "",
  bookmarkedIds: new Set(JSON.parse(localStorage.getItem("oc_bookmarks") || "[]")),
  likedIds: new Set(JSON.parse(localStorage.getItem("oc_likes") || "[]")),
  currentArticleModalId: null,
  theme: localStorage.getItem("oc_theme") || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
};

// ========================================================
// 1. INICIALIZACIÓN
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initASTCanvasAnimation();
  initPipelineSimulator();
  renderFeaturedArticle();
  renderArticlesList();
  renderComparisonTable();
  initSearchAndFilters();
  initGlossaryAccordion();
  initModalListeners();
  initScrollProgressBar();
  initMobileDrawer();
  updateBookmarkCountBadge();
});

// ========================================================
// 2. GESTIÓN DE TEMA (CLARO / OSCURO)
// ========================================================
function initTheme() {
  const root = document.documentElement;
  root.setAttribute("data-theme", AppState.theme);

  const themeToggleBtn = document.getElementById("themeToggleBtn");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const newTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", newTheme);
      AppState.theme = newTheme;
      localStorage.setItem("oc_theme", newTheme);
      showToast(`Tema cambiado a ${newTheme === "dark" ? "Oscuro" : "Claro"}`, "info");
    });
  }
}

// ========================================================
// 3. ANIMACIÓN HERO CANVAS (RED DE ÁRBOL DE SINTAXIS / AST)
// ========================================================
function initASTCanvasAnimation() {
  const canvas = document.getElementById("astCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width, height;
  let animationFrameId;
  const nodes = [];
  const totalNodes = window.innerWidth < 768 ? 32 : 65;
  const maxDistance = 140;

  const nodeLabels = ["AST", "SSA", "IR", "Lexer", "Parser", "MIR", "Type", "Phi", "Pass", "JIT", "CFG", "Reg"];

  const mouse = {
    x: null,
    y: null,
    radius: 130
  };

  function resizeCanvas() {
    width = canvas.parentElement.offsetWidth;
    height = canvas.parentElement.offsetHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
  });

  window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  resizeCanvas();

  // Crear nodos
  class Node {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 2;
      this.label = Math.random() > 0.65 ? nodeLabels[Math.floor(Math.random() * nodeLabels.length)] : null;
      this.baseAlpha = Math.random() * 0.4 + 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Interacción con el cursor
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }
    }

    draw() {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const nodeColor = isDark ? `rgba(56, 189, 248, ${this.baseAlpha})` : `rgba(14, 116, 144, ${this.baseAlpha})`;

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor;
      ctx.fill();

      // Dibujar etiqueta pequeña en nodos selectos
      if (this.label) {
        ctx.font = "9px 'Fira Code', monospace";
        ctx.fillStyle = isDark ? "rgba(148, 163, 184, 0.45)" : "rgba(71, 85, 105, 0.6)";
        ctx.fillText(this.label, this.x + 6, this.y - 4);
      }
    }
  }

  for (let i = 0; i < totalNodes; i++) {
    nodes.push(new Node());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute("data-theme") === "dark";

    // Conectar nodos cercanos emulando un grafo de dependencias / AST
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDistance) {
          const opacity = (1 - dist / maxDistance) * 0.18;
          ctx.strokeStyle = isDark ? `rgba(56, 189, 248, ${opacity})` : `rgba(14, 116, 144, ${opacity * 1.2})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Conectar nodos al cursor si está cerca
    if (mouse.x !== null && mouse.y !== null) {
      nodes.forEach(node => {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const opacity = (1 - dist / mouse.radius) * 0.25;
          ctx.strokeStyle = `rgba(129, 140, 248, ${opacity})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      });
    }

    // Actualizar y dibujar nodos
    nodes.forEach(node => {
      node.update();
      node.draw();
    });

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();
}

// ========================================================
// 4. INICIALIZACIÓN DEL SIMULADOR DE PIPELINE
// ========================================================
let pipelineInstance = null;
function initPipelineSimulator() {
  if (typeof CompilerPipelineSimulator !== "undefined") {
    pipelineInstance = new CompilerPipelineSimulator();
  }
}

// ========================================================
// 5. RENDERIZADO DEL ARTÍCULO DESTACADO (FEATURED)
// ========================================================
function renderFeaturedArticle() {
  const container = document.getElementById("featuredBanner");
  if (!container) return;

  const featured = ARTICLES_DATA.find(a => a.featured) || ARTICLES_DATA[0];
  if (!featured) return;

  const isLiked = AppState.likedIds.has(featured.id);
  const isBookmarked = AppState.bookmarkedIds.has(featured.id);

  container.innerHTML = `
    <div class="featured-card">
      <div class="featured-glow-line" aria-hidden="true"></div>
      <div class="featured-inner">
        <div class="featured-meta-header">
          <span class="badge-featured">⭐ Publicación Destacada</span>
          <span class="category-pill">${featured.categoryLabel}</span>
          <span class="read-time-pill">${featured.readTime}</span>
        </div>

        <h3 class="featured-title">${featured.title}</h3>
        <p class="featured-excerpt">${featured.excerpt}</p>

        <div class="featured-tags-row">
          ${featured.tags.map(tag => `<span class="tag-pill">#${tag}</span>`).join("")}
        </div>

        <div class="featured-footer-row">
          <div class="author-info">
            <div class="author-avatar">${featured.author.avatar}</div>
            <div>
              <span class="author-name">${featured.author.name}</span>
              <span class="author-role">${featured.author.role}</span>
            </div>
          </div>

          <div class="featured-actions">
            <button class="btn btn-primary" onclick="openArticleModal('${featured.id}')">
              Leer Artículo Completo &rarr;
            </button>
            <button class="btn-icon ${isLiked ? 'liked' : ''}" onclick="toggleLikeArticle('${featured.id}', event)" title="Me gusta">
              <svg viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>${featured.likes + (isLiked ? 1 : 0)}</span>
            </button>
            <button class="btn-icon ${isBookmarked ? 'bookmarked' : ''}" onclick="toggleBookmarkArticle('${featured.id}', event)" title="Guardar artículo">
              <svg viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ========================================================
// 6. RENDERIZADO DEL FEED DE ARTÍCULOS CON FILTRADO
// ========================================================
function renderArticlesList() {
  const grid = document.getElementById("articlesGrid");
  const emptyState = document.getElementById("emptyState");
  if (!grid) return;

  const filtered = filterArticles();

  if (filtered.length === 0) {
    grid.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (emptyState) emptyState.style.display = "none";

  grid.innerHTML = filtered.map((article, idx) => {
    const isLiked = AppState.likedIds.has(article.id);
    const isBookmarked = AppState.bookmarkedIds.has(article.id);
    const delay = (idx % 6) * 0.08;

    return `
      <article class="article-card" style="animation-delay: ${delay}s" data-id="${article.id}">
        <div class="card-glow" aria-hidden="true"></div>
        <div class="card-content">
          <div class="card-top-meta">
            <span class="category-pill">${article.categoryLabel}</span>
            <span class="card-date">${article.date}</span>
          </div>

          <h3 class="card-title">
            <a href="javascript:void(0)" onclick="openArticleModal('${article.id}')">${article.title}</a>
          </h3>

          <p class="card-excerpt">${article.excerpt}</p>

          <div class="card-tags">
            ${article.tags.slice(0, 3).map(tag => `<span class="tag-pill">#${tag}</span>`).join("")}
          </div>

          <div class="card-footer">
            <div class="author-micro">
              <div class="author-avatar small">${article.author.avatar}</div>
              <span class="author-name small">${article.author.name}</span>
            </div>

            <div class="card-actions">
              <button class="btn-card-action ${isLiked ? 'liked' : ''}" onclick="toggleLikeArticle('${article.id}', event)" title="Me gusta">
                <svg viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span>${article.likes + (isLiked ? 1 : 0)}</span>
              </button>

              <button class="btn-card-action ${isBookmarked ? 'bookmarked' : ''}" onclick="toggleBookmarkArticle('${article.id}', event)" title="Guardar">
                <svg viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </button>

              <button class="btn btn-sm btn-outline" onclick="openArticleModal('${article.id}')">
                Leer &rarr;
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function filterArticles() {
  return ARTICLES_DATA.filter(article => {
    // Categoría
    if (AppState.activeCategory === "guardados") {
      if (!AppState.bookmarkedIds.has(article.id)) return false;
    } else if (AppState.activeCategory !== "todos") {
      if (article.category !== AppState.activeCategory) return false;
    }

    // Búsqueda
    if (AppState.searchQuery.trim() !== "") {
      const q = AppState.searchQuery.toLowerCase().trim();
      const matchTitle = article.title.toLowerCase().includes(q);
      const matchExcerpt = article.excerpt.toLowerCase().includes(q);
      const matchTags = article.tags.some(t => t.toLowerCase().includes(q));
      const matchCategory = article.categoryLabel.toLowerCase().includes(q);
      if (!matchTitle && !matchExcerpt && !matchTags && !matchCategory) return false;
    }

    return true;
  });
}

// ========================================================
// 7. CONTROL DE BÚSQUEDA Y CHIPS DE CATEGORÍA
// ========================================================
function initSearchAndFilters() {
  const searchInput = document.getElementById("articleSearchInput");
  const clearBtn = document.getElementById("clearSearchBtn");
  const chips = document.querySelectorAll("#categoryChipsList .chip-btn");
  const bookmarkFilterBtn = document.getElementById("bookmarkFilterBtn");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      AppState.searchQuery = e.target.value;
      if (clearBtn) {
        clearBtn.style.display = AppState.searchQuery.length > 0 ? "block" : "none";
      }
      updateFilterBanner();
      renderArticlesList();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      AppState.searchQuery = "";
      clearBtn.style.display = "none";
      updateFilterBanner();
      renderArticlesList();
    });
  }

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      AppState.activeCategory = chip.getAttribute("data-category");
      updateFilterBanner();
      renderArticlesList();
    });
  });

  if (bookmarkFilterBtn) {
    bookmarkFilterBtn.addEventListener("click", () => {
      // Activar chip de guardados y scroll a artículos
      const bookmarkChip = document.querySelector(`.chip-btn[data-category="guardados"]`);
      if (bookmarkChip) {
        chips.forEach(c => c.classList.remove("active"));
        bookmarkChip.classList.add("active");
        AppState.activeCategory = "guardados";
        updateFilterBanner();
        renderArticlesList();
        document.getElementById("articulos").scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  const resetFiltersBtn = document.getElementById("resetFiltersBtn");
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", resetAllFilters);
  }
}

function updateFilterBanner() {
  const banner = document.getElementById("filterStatusBanner");
  const text = document.getElementById("filterStatusText");
  if (!banner || !text) return;

  const isFiltering = AppState.activeCategory !== "todos" || AppState.searchQuery.trim() !== "";
  if (isFiltering) {
    banner.style.display = "flex";
    const parts = [];
    if (AppState.activeCategory !== "todos") {
      parts.push(`categoría "${AppState.activeCategory}"`);
    }
    if (AppState.searchQuery.trim() !== "") {
      parts.push(`búsqueda "${AppState.searchQuery}"`);
    }
    text.textContent = `Mostrando resultados filtrados por: ${parts.join(" y ")}`;
  } else {
    banner.style.display = "none";
  }
}

function resetAllFilters() {
  AppState.activeCategory = "todos";
  AppState.searchQuery = "";
  
  const searchInput = document.getElementById("articleSearchInput");
  if (searchInput) searchInput.value = "";

  const clearBtn = document.getElementById("clearSearchBtn");
  if (clearBtn) clearBtn.style.display = "none";

  const chips = document.querySelectorAll("#categoryChipsList .chip-btn");
  chips.forEach(c => {
    if (c.getAttribute("data-category") === "todos") c.classList.add("active");
    else c.classList.remove("active");
  });

  updateFilterBanner();
  renderArticlesList();
}

// ========================================================
// 8. INTERACCIONES DE USUARIO: FAVORITOS & LIKES
// ========================================================
function toggleBookmarkArticle(articleId, event) {
  if (event) event.stopPropagation();

  if (AppState.bookmarkedIds.has(articleId)) {
    AppState.bookmarkedIds.delete(articleId);
    showToast("Artículo eliminado de guardados", "info");
  } else {
    AppState.bookmarkedIds.add(articleId);
    showToast("Artículo guardado para leer después", "success");
  }

  localStorage.setItem("oc_bookmarks", JSON.stringify(Array.from(AppState.bookmarkedIds)));
  updateBookmarkCountBadge();
  renderArticlesList();
  renderFeaturedArticle();
  updateModalBookmarkState();
}

function toggleLikeArticle(articleId, event) {
  if (event) event.stopPropagation();

  if (AppState.likedIds.has(articleId)) {
    AppState.likedIds.delete(articleId);
  } else {
    AppState.likedIds.add(articleId);
    showToast("¡Gracias por tu apoyo al contenido libre!", "success");
  }

  localStorage.setItem("oc_likes", JSON.stringify(Array.from(AppState.likedIds)));
  renderArticlesList();
  renderFeaturedArticle();
  updateModalLikeState();
}

function updateBookmarkCountBadge() {
  const badge = document.getElementById("bookmarkCount");
  if (badge) {
    badge.textContent = AppState.bookmarkedIds.size;
  }
}

// ========================================================
// 9. MODAL DE LECTURA COMPLETA DE ARTÍCULOS
// ========================================================
function openArticleModal(articleId) {
  const article = ARTICLES_DATA.find(a => a.id === articleId);
  if (!article) return;

  AppState.currentArticleModalId = articleId;

  const modal = document.getElementById("articleModal");
  const title = document.getElementById("modalArticleTitle");
  const categoryTag = document.getElementById("modalCategoryTag");
  const authorAvatar = document.getElementById("modalAuthorAvatar");
  const authorName = document.getElementById("modalAuthorName");
  const authorRole = document.getElementById("modalAuthorRole");
  const date = document.getElementById("modalArticleDate");
  const readTime = document.getElementById("modalArticleReadTime");
  const tagsList = document.getElementById("modalTagsList");
  const content = document.getElementById("modalArticleContent");

  if (title) title.textContent = article.title;
  if (categoryTag) categoryTag.textContent = article.categoryLabel;
  if (authorAvatar) authorAvatar.textContent = article.author.avatar;
  if (authorName) authorName.textContent = article.author.name;
  if (authorRole) authorRole.textContent = article.author.role;
  if (date) date.textContent = article.date;
  if (readTime) readTime.textContent = article.readTime;

  if (tagsList) {
    tagsList.innerHTML = article.tags.map(t => `<span class="tag-pill">#${t}</span>`).join("");
  }

  if (content) {
    content.innerHTML = article.content;
  }

  updateModalLikeState();
  updateModalBookmarkState();

  if (modal) {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Evita scroll de fondo
  }
}

function closeArticleModal() {
  const modal = document.getElementById("articleModal");
  if (modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    AppState.currentArticleModalId = null;
  }
}

function updateModalLikeState() {
  if (!AppState.currentArticleModalId) return;
  const article = ARTICLES_DATA.find(a => a.id === AppState.currentArticleModalId);
  if (!article) return;

  const likeBtn = document.getElementById("modalLikeBtn");
  const countEl = document.getElementById("modalLikesCount");
  const isLiked = AppState.likedIds.has(article.id);

  if (likeBtn) {
    likeBtn.classList.toggle("liked", isLiked);
    const svg = likeBtn.querySelector("svg");
    if (svg) svg.setAttribute("fill", isLiked ? "currentColor" : "none");
  }
  if (countEl) {
    countEl.textContent = article.likes + (isLiked ? 1 : 0);
  }
}

function updateModalBookmarkState() {
  if (!AppState.currentArticleModalId) return;
  const bookmarkBtn = document.getElementById("modalBookmarkBtn");
  const isBookmarked = AppState.bookmarkedIds.has(AppState.currentArticleModalId);

  if (bookmarkBtn) {
    bookmarkBtn.classList.toggle("bookmarked", isBookmarked);
    const svg = bookmarkBtn.querySelector("svg");
    if (svg) svg.setAttribute("fill", isBookmarked ? "currentColor" : "none");
  }
}

function initModalListeners() {
  const closeBtn = document.getElementById("closeModalBtn");
  const backdrop = document.getElementById("modalBackdrop");
  const modalLikeBtn = document.getElementById("modalLikeBtn");
  const modalBookmarkBtn = document.getElementById("modalBookmarkBtn");

  if (closeBtn) closeBtn.addEventListener("click", closeArticleModal);
  if (backdrop) backdrop.addEventListener("click", closeArticleModal);

  if (modalLikeBtn) {
    modalLikeBtn.addEventListener("click", () => {
      if (AppState.currentArticleModalId) {
        toggleLikeArticle(AppState.currentArticleModalId);
      }
    });
  }

  if (modalBookmarkBtn) {
    modalBookmarkBtn.addEventListener("click", () => {
      if (AppState.currentArticleModalId) {
        toggleBookmarkArticle(AppState.currentArticleModalId);
      }
    });
  }

  // Cerrar con tecla Escape
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && AppState.currentArticleModalId) {
      closeArticleModal();
    }
  });
}

function copyCurrentArticleUrl() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast("Enlace del artículo copiado al portapapeles", "success");
  }).catch(() => {
    showToast("No se pudo copiar el enlace", "error");
  });
}

// Función para copiar bloques de código genéricos
window.copyCodeSnippet = function(buttonElement) {
  const codeBox = buttonElement.closest(".code-box");
  if (!codeBox) return;
  const codeEl = codeBox.querySelector("code");
  if (!codeEl) return;

  navigator.clipboard.writeText(codeEl.innerText).then(() => {
    const originalText = buttonElement.textContent;
    buttonElement.textContent = "¡Copiado!";
    buttonElement.classList.add("copied");
    showToast("Código copiado al portapapeles", "success");
    setTimeout(() => {
      buttonElement.textContent = originalText;
      buttonElement.classList.remove("copied");
    }, 2000);
  });
};

// ========================================================
// 10. TABLA COMPARATIVA DE COMPILADORES
// ========================================================
function renderComparisonTable() {
  const tbody = document.getElementById("comparisonTableBody");
  if (!tbody || typeof COMPILER_COMPARISON_DATA === "undefined") return;

  tbody.innerHTML = COMPILER_COMPARISON_DATA.map(comp => `
    <tr>
      <td class="font-bold text-accent">${comp.name}</td>
      <td>${comp.creator}</td>
      <td><span class="badge-license">${comp.license}</span></td>
      <td><code>${comp.writtenIn}</code></td>
      <td><span class="text-mono-sm">${comp.ir}</span></td>
      <td><span class="text-sm">${comp.targetSupport}</span></td>
      <td class="text-sm">${comp.specialty}</td>
    </tr>
  `).join("");
}

// ========================================================
// 11. GLOSARIO INTERACTIVO (ACORDEÓN)
// ========================================================
function initGlossaryAccordion() {
  const items = document.querySelectorAll(".accordion-item");

  items.forEach(item => {
    const trigger = item.querySelector(".accordion-trigger");
    const body = item.querySelector(".accordion-body");

    if (trigger && body) {
      trigger.addEventListener("click", () => {
        const isExpanded = trigger.getAttribute("aria-expanded") === "true";

        // Cerrar otros acordeones si se desea comportamiento único
        items.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove("open");
            const otherTrigger = otherItem.querySelector(".accordion-trigger");
            if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
          }
        });

        // Alternar el actual
        if (isExpanded) {
          item.classList.remove("open");
          trigger.setAttribute("aria-expanded", "false");
        } else {
          item.classList.add("open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    }
  });
}

// ========================================================
// 12. BARRA DE PROGRESO DE LECTURA (SCROLL INDICATOR)
// ========================================================
function initScrollProgressBar() {
  const progressBar = document.getElementById("scrollProgressBar");
  if (!progressBar) return;

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${scrollPercent}%`;
  });
}

// ========================================================
// 13. MENÚ MÓVIL (DRAWER)
// ========================================================
function initMobileDrawer() {
  const menuBtn = document.getElementById("mobileMenuBtn");
  const drawer = document.getElementById("mobileDrawer");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  if (!menuBtn || !drawer) return;

  function toggleMenu() {
    const isOpen = drawer.classList.contains("active");
    drawer.classList.toggle("active", !isOpen);
    menuBtn.setAttribute("aria-expanded", (!isOpen).toString());
  }

  menuBtn.addEventListener("click", toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      drawer.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

// ========================================================
// 14. SISTEMA DE NOTIFICACIONES TOAST
// ========================================================
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast-message toast-${type}`;

  const iconSvg = type === "success" 
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;

  toast.innerHTML = `
    <span class="toast-icon">${iconSvg}</span>
    <span class="toast-text">${message}</span>
  `;

  container.appendChild(toast);

  // Animación de entrada
  setTimeout(() => toast.classList.add("visible"), 10);

  // Desvanecimiento y remoción
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 300);
  }, 3200);
}

// ========================================================
// 15. FORMULARIO NEWSLETTER SIMULADO
// ========================================================
window.handleNewsletterSubmit = function(event) {
  event.preventDefault();
  const form = document.getElementById("newsletterForm");
  const successEl = document.getElementById("newsletterSuccess");

  if (form && successEl) {
    form.style.display = "none";
    successEl.style.display = "block";
    showToast("¡Te has suscrito con éxito!", "success");
  }
};

