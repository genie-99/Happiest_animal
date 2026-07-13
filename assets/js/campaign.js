const menuBtn = document.querySelector("#menuBtn");
    const navLinks = document.querySelector("#navLinks");
    const navItems = document.querySelectorAll(".nav-links a");

    const pledgeForm = document.querySelector("#pledgeForm");
    const nicknameInput = document.querySelector("#nickname");
    const checkboxes = [...document.querySelectorAll('input[name="promise"]')];
    const resetBtn = document.querySelector("#resetBtn");
    const resultCard = document.querySelector("#resultCard");
    const resultTitle = document.querySelector("#resultTitle");
    const resultMessage = document.querySelector("#resultMessage");
    const shareCampaignBtn = document.querySelector("#shareCampaignBtn");
    const editPledgeBtn = document.querySelector("#editPledgeBtn");

    const progressText = document.querySelector("#progressText");
    const progressTrack = document.querySelector("#progressTrack");
    const progressBar = document.querySelector("#progressBar");
    const toast = document.querySelector("#toast");

    const STORAGE_KEY = "quokkaSmileCampaignPledge";

    function closeMenu() {
      menuBtn.classList.remove("active");
      navLinks.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "메뉴 열기");
    }

    function showToast(message) {
      toast.textContent = message;
      toast.classList.add("show");

      window.setTimeout(() => {
        toast.classList.remove("show");
      }, 1800);
    }

    function updateProgress() {
      const checkedCount = checkboxes.filter((checkbox) => checkbox.checked).length;
      const percentage = (checkedCount / checkboxes.length) * 100;

      progressText.textContent = `${checkedCount} / ${checkboxes.length}`;
      progressBar.style.width = `${percentage}%`;
      progressTrack.setAttribute("aria-valuenow", String(checkedCount));
    }

    function showResult(nickname) {
      pledgeForm.style.display = "none";
      resultCard.classList.add("show");
      resultTitle.textContent = `${nickname}님, 참여 완료!`;
      resultMessage.textContent =
        "네 가지 약속이 현재 브라우저에 저장되었습니다. 쿼카를 만날 때 오늘의 약속을 기억해 주세요.";
    }

    function showForm() {
      resultCard.classList.remove("show");
      pledgeForm.style.display = "block";
    }

    function resetForm() {
      pledgeForm.reset();
      localStorage.removeItem(STORAGE_KEY);
      showForm();
      updateProgress();
      nicknameInput.focus();
      showToast("약속서를 새로 작성할 수 있어요");
    }

    function loadSavedPledge() {
      const savedValue = localStorage.getItem(STORAGE_KEY);

      if (!savedValue) {
        updateProgress();
        return;
      }

      try {
        const savedPledge = JSON.parse(savedValue);

        nicknameInput.value = savedPledge.nickname || "";
        checkboxes.forEach((checkbox) => {
          checkbox.checked = savedPledge.promises?.includes(checkbox.value) ?? false;
        });

        updateProgress();

        if (savedPledge.completed && savedPledge.nickname) {
          showResult(savedPledge.nickname);
        }
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
        updateProgress();
      }
    }

    menuBtn.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuBtn.classList.toggle("active", isOpen);
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      menuBtn.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
    });

    navItems.forEach((item) => {
      item.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 700) {
        closeMenu();
      }
    });

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", updateProgress);
    });

    pledgeForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const nickname = nicknameInput.value.trim();
      const selectedPromises = checkboxes
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value);

      if (!nickname) {
        showToast("닉네임을 입력해 주세요");
        nicknameInput.focus();
        return;
      }

      if (selectedPromises.length !== checkboxes.length) {
        showToast("네 가지 약속을 모두 확인해 주세요");
        return;
      }

      const pledgeData = {
        nickname,
        promises: selectedPromises,
        completed: true,
        savedAt: new Date().toISOString()
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(pledgeData));
      showResult(nickname);
      showToast("캠페인 참여가 저장됐어요 🌱");
    });

    resetBtn.addEventListener("click", resetForm);

    editPledgeBtn.addEventListener("click", () => {
      showForm();
      document.querySelector("#join").scrollIntoView({ behavior: "smooth" });
    });

    shareCampaignBtn.addEventListener("click", async () => {
      const nickname = nicknameInput.value.trim() || "Smile Keeper";
      const shareData = {
        title: "Quokka Smile Campaign",
        text: `${nickname}님이 쿼카를 위한 네 가지 약속에 참여했어요. 만지지 않기, 먹이와 물 주지 않기, 안전거리 지키기, 지정된 길 이용하기 🌱`,
        url: window.location.href
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
          showToast("캠페인 문구와 주소가 복사됐어요");
        } else {
          showToast("이 브라우저에서는 공유 기능을 지원하지 않아요");
        }
      } catch (error) {
        showToast("공유를 취소했어요");
      }
    });

    loadSavedPledge();

(() => {
      const root = document.documentElement;
      const themeToggle = document.querySelector("#themeToggle");
      const THEME_KEY = "quokkaSmileTheme";

      function setTheme(theme, persist = true) {
        root.dataset.theme = theme;
        root.style.colorScheme = theme;

        if (persist) {
          try {
            localStorage.setItem(THEME_KEY, theme);
          } catch (error) {
            // 저장을 막은 브라우저에서도 화면 전환은 유지합니다.
          }
        }

        if (themeToggle) {
          const isDark = theme === "dark";
          themeToggle.setAttribute("aria-pressed", String(isDark));
          themeToggle.setAttribute("aria-label", isDark ? "라이트 모드로 변경" : "다크 모드로 변경");
          themeToggle.querySelector(".theme-icon").textContent = isDark ? "☀️" : "🌙";
          themeToggle.querySelector(".theme-text").textContent = isDark ? "라이트 모드" : "다크 모드";
        }
      }

      setTheme(root.dataset.theme || "light", false);

      themeToggle?.addEventListener("click", () => {
        setTheme(root.dataset.theme === "dark" ? "light" : "dark");
      });

      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
      systemTheme.addEventListener?.("change", (event) => {
        try {
          if (!localStorage.getItem(THEME_KEY)) {
            setTheme(event.matches ? "dark" : "light", false);
          }
        } catch (error) {
          setTheme(event.matches ? "dark" : "light", false);
        }
      });

      const revealTargets = document.querySelectorAll(
        "main section, .card, .goods-card, .promise-card, .intro-box, .idea-box, .source-box"
      );

      revealTargets.forEach((target, index) => {
        target.dataset.reveal = "";
        target.style.transitionDelay = `${Math.min(index % 5, 4) * 55}ms`;
      });

      if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12 });

        revealTargets.forEach((target) => revealObserver.observe(target));
      } else {
        revealTargets.forEach((target) => target.classList.add("revealed"));
      }

      const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
      const sections = sectionLinks
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

      if (sections.length && "IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

          if (!visible) return;

          sectionLinks.forEach((link) => {
            link.classList.toggle("active-section", link.getAttribute("href") === `#${visible.target.id}`);
          });
        }, { rootMargin: "-25% 0px -60%", threshold: [0.05, 0.25, 0.5] });

        sections.forEach((section) => sectionObserver.observe(section));
      }
    })();

(() => {
      const pledgeForm = document.querySelector("#pledgeForm");
      const nicknameInput = document.querySelector("#nickname");
      const checkboxes = [...document.querySelectorAll('input[name="promise"]')];
      const resultCard = document.querySelector("#resultCard");
      const keeperCount = document.querySelector("#keeperCount");
      const todayLabel = document.querySelector("#todayLabel");
      const draftStatus = document.querySelector("#draftStatus");
      const PLEDGE_KEY = "quokkaSmileCampaignPledge";
      const COUNT_KEY = "quokkaSmileCampaignCompletionCount";
      const COUNTED_AT_KEY = "quokkaSmileCampaignCountedAt";
      let draftTimer;

      function readCount() {
        const count = Number(localStorage.getItem(COUNT_KEY) || 0);
        keeperCount.textContent = `${count}회`;
        return count;
      }

      function updateCheckedStyles() {
        checkboxes.forEach((checkbox) => {
          checkbox.closest(".check-item")?.classList.toggle("is-checked", checkbox.checked);
        });
      }

      function saveDraft() {
        window.clearTimeout(draftTimer);
        draftTimer = window.setTimeout(() => {
          const nickname = nicknameInput.value.trim();
          const promises = checkboxes.filter((item) => item.checked).map((item) => item.value);
          const existing = JSON.parse(localStorage.getItem(PLEDGE_KEY) || "{}");

          localStorage.setItem(PLEDGE_KEY, JSON.stringify({
            nickname,
            promises,
            completed: false,
            savedAt: existing.savedAt || null,
            draftSavedAt: new Date().toISOString()
          }));

          draftStatus.textContent = "작성 중인 내용이 이 브라우저에 자동 저장됐어요.";
        }, 300);
      }

      function celebrate() {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const layer = document.createElement("div");
        layer.className = "celebration-layer";
        const icons = ["🌱", "✨", "☺", "🍃"];

        for (let index = 0; index < 24; index += 1) {
          const piece = document.createElement("span");
          piece.className = "celebration-piece";
          piece.textContent = icons[index % icons.length];
          piece.style.left = `${Math.random() * 100}%`;
          piece.style.animationDelay = `${Math.random() * 0.45}s`;
          piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 180}px`);
          layer.appendChild(piece);
        }

        document.body.appendChild(layer);
        window.setTimeout(() => layer.remove(), 2500);
      }

      function syncCompletedPledge() {
        const raw = localStorage.getItem(PLEDGE_KEY);
        if (!raw) return;

        try {
          const pledge = JSON.parse(raw);
          if (!pledge.completed || !pledge.savedAt) return;

          const lastCountedAt = localStorage.getItem(COUNTED_AT_KEY);
          if (lastCountedAt !== pledge.savedAt) {
            const nextCount = readCount() + 1;
            localStorage.setItem(COUNT_KEY, String(nextCount));
            localStorage.setItem(COUNTED_AT_KEY, pledge.savedAt);
            keeperCount.textContent = `${nextCount}회`;
            celebrate();
          }
        } catch (error) {
          // 기존 참여 기능에서 잘못된 저장값을 정리합니다.
        }
      }

      todayLabel.textContent = new Intl.DateTimeFormat("ko-KR", {
        month: "short",
        day: "numeric"
      }).format(new Date());

      readCount();
      updateCheckedStyles();

      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
          updateCheckedStyles();
          saveDraft();
        });
      });

      nicknameInput.addEventListener("input", saveDraft);

      pledgeForm.addEventListener("submit", () => {
        window.setTimeout(() => {
          syncCompletedPledge();
          draftStatus.textContent = "네 가지 약속이 완료 상태로 저장됐어요.";
        }, 0);
      });

      document.querySelector("#resetBtn")?.addEventListener("click", () => {
        updateCheckedStyles();
        draftStatus.textContent = "새 약속서를 작성해 주세요.";
      });

      const resultObserver = new MutationObserver(() => {
        if (resultCard.classList.contains("show")) syncCompletedPledge();
      });
      resultObserver.observe(resultCard, { attributes: true, attributeFilter: ["class"] });

      syncCompletedPledge();
    })();

(() => {
      const LANGUAGE_KEY = "quokkaSmileLanguage";
      const languageToggle = document.querySelector("#languageToggle");
      const typingTitle = document.querySelector("#typingTitle");
      const titleCopy = {"ko": "미소는 가까이,\n야생은 안전하게", "en": "Keep the smile close,\nkeep wildlife safe"};
      const pageTitleCopy = {"ko": "쿼카 스마일 캠페인", "en": "Quokka Smile Campaign"};
      let typingTimer;

      function getLanguage() {
        try { return localStorage.getItem(LANGUAGE_KEY) || "ko"; }
        catch (error) { return "ko"; }
      }

      function typeTitle(text) {
        if (!typingTitle) return;
        clearTimeout(typingTimer);
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) { typingTitle.textContent = text; return; }
        typingTitle.textContent = "";
        let index = 0;
        const write = () => {
          typingTitle.textContent = text.slice(0, index);
          index += 1;
          if (index <= text.length) typingTimer = setTimeout(write, text.charCodeAt(index - 1) === 10 ? 180 : 55);
        };
        write();
      }

      function applyLanguage(language, persist = true) {
        const lang = language === "en" ? "en" : "ko";
        document.documentElement.lang = lang;
        if (persist) { try { localStorage.setItem(LANGUAGE_KEY, lang); } catch (error) {} }
        document.querySelectorAll("[data-i18n]").forEach((element) => {
          if (element.matches(".name-field, .check-item")) return;

          const value = element.dataset[lang];
          if (value) element.textContent = value;
        });
        document.title = pageTitleCopy[lang];
        if (languageToggle) {
          const isEnglish = lang === "en";
          languageToggle.setAttribute("aria-pressed", String(isEnglish));
          languageToggle.setAttribute("aria-label", isEnglish ? "한국어로 변경" : "Switch to English");
          languageToggle.querySelector(".language-text").textContent = isEnglish ? "KO" : "EN";
        }
        const themeText = document.querySelector("#themeToggle .theme-text");
        const themeToggle = document.querySelector("#themeToggle");
        if (themeText && themeToggle) {
          const dark = document.documentElement.dataset.theme === "dark";
          themeText.textContent = lang === "en" ? (dark ? "Light mode" : "Dark mode") : (dark ? "라이트 모드" : "다크 모드");
          themeToggle.setAttribute("aria-label", lang === "en" ? (dark ? "Switch to light mode" : "Switch to dark mode") : (dark ? "라이트 모드로 변경" : "다크 모드로 변경"));
        }
        typeTitle(titleCopy[lang]);
        window.dispatchEvent(new CustomEvent("quokka-language-change", { detail: { language: lang } }));
      }

      languageToggle?.addEventListener("click", () => applyLanguage(getLanguage() === "ko" ? "en" : "ko"));
      document.querySelector("#themeToggle")?.addEventListener("click", () => setTimeout(() => applyLanguage(getLanguage(), false), 0));
      applyLanguage(getLanguage(), false);
    })();

window.addEventListener("quokka-language-change", (event) => {
  const input = document.querySelector("#nickname");
  if (input) input.placeholder = event.detail.language === "en" ? input.dataset.placeholderEn : input.dataset.placeholderKo;
});
