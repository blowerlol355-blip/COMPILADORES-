// Simulador interactivo de Pipeline de Compilación
// Permite explorar las 7 etapas fundamentales de la compilación moderna

class CompilerPipelineSimulator {
  constructor() {
    this.stages = PIPELINE_STAGES;
    this.currentIndex = 0;
    this.isPlaying = false;
    this.autoPlayInterval = null;
    this.autoPlayDuration = 5000; // 5 segundos por fase

    // DOM Elements
    this.timelineContainer = document.getElementById("pipelineTimeline");
    this.stageCard = document.getElementById("pipelineStageCard");
    this.stageBadge = document.getElementById("stageBadge");
    this.stageTitle = document.getElementById("stageTitle");
    this.stageSubtitle = document.getElementById("stageSubtitle");
    this.stageDescription = document.getElementById("stageDescription");
    this.stageLangLabel = document.getElementById("stageLangLabel");
    this.stageCodeContent = document.getElementById("stageCodeContent");
    this.stageInsightText = document.getElementById("stageInsightText");
    
    this.prevBtn = document.getElementById("pipelinePrevBtn");
    this.nextBtn = document.getElementById("pipelineNextBtn");
    this.autoPlayBtn = document.getElementById("pipelineAutoPlayBtn");
    this.playIcon = document.getElementById("playIcon");
    this.playText = document.getElementById("playText");
    this.copyBtn = document.getElementById("copyStageCodeBtn");

    this.init();
  }

  init() {
    if (!this.timelineContainer || !this.stages || this.stages.length === 0) return;

    this.renderTimeline();
    this.attachEvents();
    this.updateStageView(0, false);
  }

  renderTimeline() {
    this.timelineContainer.innerHTML = "";

    this.stages.forEach((stage, idx) => {
      const stepBtn = document.createElement("button");
      stepBtn.className = `pipeline-step ${idx === 0 ? "active" : ""}`;
      stepBtn.setAttribute("role", "tab");
      stepBtn.setAttribute("aria-selected", idx === 0 ? "true" : "false");
      stepBtn.setAttribute("data-index", idx);
      
      stepBtn.innerHTML = `
        <span class="step-num">${idx + 1}</span>
        <span class="step-label">${stage.title.split(". ")[1] || stage.title}</span>
      `;

      stepBtn.addEventListener("click", () => {
        this.stopAutoPlay();
        this.updateStageView(idx, true);
      });

      this.timelineContainer.appendChild(stepBtn);
    });
  }

  attachEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => {
        this.stopAutoPlay();
        this.previousStage();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => {
        this.stopAutoPlay();
        this.nextStage();
      });
    }

    if (this.autoPlayBtn) {
      this.autoPlayBtn.addEventListener("click", () => {
        this.toggleAutoPlay();
      });
    }

    if (this.copyBtn) {
      this.copyBtn.addEventListener("click", () => {
        const currentStage = this.stages[this.currentIndex];
        if (currentStage && currentStage.codeSnippet) {
          navigator.clipboard.writeText(currentStage.codeSnippet).then(() => {
            showToast("Código de la fase copiado al portapapeles", "success");
            this.copyBtn.classList.add("copied");
            setTimeout(() => this.copyBtn.classList.remove("copied"), 2000);
          }).catch(() => {
            showToast("No se pudo copiar el código", "error");
          });
        }
      });
    }
  }

  updateStageView(index, animate = true) {
    if (index < 0 || index >= this.stages.length) return;
    this.currentIndex = index;
    const stage = this.stages[index];

    // Update buttons in timeline
    const buttons = this.timelineContainer.querySelectorAll(".pipeline-step");
    buttons.forEach((btn, idx) => {
      if (idx === index) {
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        // Scroll button into view on mobile
        btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      } else {
        btn.classList.remove("active");
        btn.setAttribute("aria-selected", "false");
      }
    });

    // Animate stage transition
    if (animate && this.stageCard) {
      this.stageCard.classList.add("fade-switch");
      setTimeout(() => {
        this.fillStageData(stage, index);
        this.stageCard.classList.remove("fade-switch");
      }, 180);
    } else {
      this.fillStageData(stage, index);
    }

    // Update Next / Prev button states
    if (this.prevBtn) {
      this.prevBtn.disabled = index === 0;
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = index === this.stages.length - 1;
    }
  }

  fillStageData(stage, index) {
    if (this.stageBadge) this.stageBadge.textContent = `Fase ${index + 1} de ${this.stages.length}`;
    if (this.stageTitle) this.stageTitle.textContent = stage.title;
    if (this.stageSubtitle) this.stageSubtitle.textContent = stage.subtitle;
    if (this.stageDescription) this.stageDescription.textContent = stage.description;
    if (this.stageLangLabel) this.stageLangLabel.textContent = stage.language.toUpperCase();
    if (this.stageInsightText) this.stageInsightText.textContent = stage.insight;

    if (this.stageCodeContent) {
      // Syntax-highlight code block representation
      this.stageCodeContent.innerHTML = this.formatCodePreview(stage.codeSnippet, stage.language);
    }
  }

  formatCodePreview(code, lang) {
    // Escape standard HTML characters
    let escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Simple yet beautiful syntax highlighter for various stage languages
    if (lang === "c" || lang === "rust") {
      escaped = escaped
        .replace(/\b(int|fn|let|return|define|void)\b/g, '<span class="tok-keyword">$1</span>')
        .replace(/\b(calcular_total|main|printf)\b/g, '<span class="tok-function">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="tok-number">$1</span>')
        .replace(/(\/\/.+)/g, '<span class="tok-comment">$1</span>');
    } else if (lang === "llvm") {
      escaped = escaped
        .replace(/\b(define|ret|add|mul|nsw|i32)\b/g, '<span class="tok-keyword">$1</span>')
        .replace(/(%[a-zA-Z0-9_]+|@[a-zA-Z0-9_]+)/g, '<span class="tok-variable">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="tok-number">$1</span>')
        .replace(/(;.+)/g, '<span class="tok-comment">$1</span>');
    } else if (lang === "json") {
      escaped = escaped
        .replace(/\[(KEYWORD|IDENTIFIER|PUNCTUATION|OPERATOR|LITERAL_INT)\]/g, '<span class="tok-tag">[$1]</span>')
        .replace(/&quot;([^&]+)&quot;/g, '<span class="tok-string">&quot;$1&quot;</span>');
    } else if (lang === "yaml") {
      escaped = escaped
        .replace(/\b(FunctionDeclaration|ReturnType|Parameters|Body|VarDecl|BinaryExpr|ReturnStmt|Identifier)\b/g, '<span class="tok-type">$1</span>')
        .replace(/(\bint\b)/g, '<span class="tok-keyword">$1</span>');
    } else if (lang === "nasm") {
      escaped = escaped
        .replace(/\b(lea|imul|ret|\.cfi_startproc|\.cfi_endproc)\b/g, '<span class="tok-keyword">$1</span>')
        .replace(/\b(eax|rdi|esi)\b/g, '<span class="tok-register">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="tok-number">$1</span>')
        .replace(/(;.+)/g, '<span class="tok-comment">$1</span>');
    }

    return escaped;
  }

  nextStage() {
    if (this.currentIndex < this.stages.length - 1) {
      this.updateStageView(this.currentIndex + 1);
    } else if (this.isPlaying) {
      // Loop back to start in autoplay
      this.updateStageView(0);
    }
  }

  previousStage() {
    if (this.currentIndex > 0) {
      this.updateStageView(this.currentIndex - 1);
    }
  }

  toggleAutoPlay() {
    if (this.isPlaying) {
      this.stopAutoPlay();
      showToast("Reproducción automática pausada", "info");
    } else {
      this.startAutoPlay();
      showToast("Reproducción del pipeline iniciada", "info");
    }
  }

  startAutoPlay() {
    this.isPlaying = true;
    if (this.playIcon) this.playIcon.innerHTML = "&#10074;&#10074;"; // Pause icon
    if (this.playText) this.playText.textContent = "Pausa";
    if (this.autoPlayBtn) this.autoPlayBtn.classList.add("playing");

    this.autoPlayInterval = setInterval(() => {
      this.nextStage();
    }, this.autoPlayDuration);
  }

  stopAutoPlay() {
    if (this.isPlaying) {
      this.isPlaying = false;
      if (this.playIcon) this.playIcon.innerHTML = "&#9658;"; // Play icon
      if (this.playText) this.playText.textContent = "Auto";
      if (this.autoPlayBtn) this.autoPlayBtn.classList.remove("playing");

      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
      }
    }
  }
}

// Global hook will be initialized on DOMContentLoaded in app.js

