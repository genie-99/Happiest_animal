const menuBtn = document.querySelector("#menuBtn");
    const navLinks = document.querySelector("#navLinks");
    const navItems = document.querySelectorAll(".nav-links a");
    const ideaBtn = document.querySelector("#ideaBtn");
    const toast = document.querySelector("#toast");

    function closeMenu() {
      menuBtn.classList.remove("active");
      navLinks.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "메뉴 열기");
    }

    function showToast(message) {
      toast.textContent = message;
      toast.classList.add("show");

      setTimeout(() => {
        toast.classList.remove("show");
      }, 1800);
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

    ideaBtn.addEventListener("click", () => {
      showToast("굿즈 아이디어 라인업이 완성됐어요 🎁");
    });

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
      const searchInput = document.querySelector("#goodsSearch");
      const filterButtons = [...document.querySelectorAll(".filter-btn")];
      const cards = [...document.querySelectorAll(".goods-card")];
      const resultCount = document.querySelector("#goodsResultCount");
      const emptyResult = document.querySelector("#emptyResult");
      let activeFilter = "all";

      function filterGoods() {
        const keyword = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        cards.forEach((card) => {
          const categoryMatch = activeFilter === "all" || card.dataset.category === activeFilter;
          const keywordMatch = !keyword || card.textContent.toLowerCase().includes(keyword);
          const isVisible = categoryMatch && keywordMatch;
          card.classList.toggle("is-hidden", !isVisible);
          if (isVisible) visibleCount += 1;
        });

        resultCount.textContent = `${visibleCount}개 굿즈`;
        emptyResult.classList.toggle("show", visibleCount === 0);
      }

      filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
          activeFilter = button.dataset.filter;
          filterButtons.forEach((item) => item.classList.toggle("active", item === button));
          filterGoods();
        });
      });

      searchInput.addEventListener("input", filterGoods);
      filterGoods();
    })();

(() => {
      const LANGUAGE_KEY = "quokkaSmileLanguage";
      const languageToggle = document.querySelector("#languageToggle");
      const typingTitle = document.querySelector("#typingTitle");
      const titleCopy = {"ko": "쿼카의 미소를\n일상 속 굿즈로", "en": "Bring the quokka smile\ninto everyday life"};
      const pageTitleCopy = {"ko": "쿼카 굿즈 아이디어", "en": "Quokka Goods Ideas"};
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
  const lang = event.detail.language;
  const input = document.querySelector("#goodsSearch");
  if (input) input.placeholder = lang === "en" ? input.dataset.placeholderEn : input.dataset.placeholderKo;
  input?.dispatchEvent(new Event("input"));
});