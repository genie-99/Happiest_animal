const toast = document.querySelector("#toast");
    const shareBtn = document.querySelector("#shareBtn");
    const campaignBtn = document.querySelector("#campaignBtn");
    const goodsBtn = document.querySelector("#goodsBtn");

    const menuBtn = document.querySelector("#menuBtn");
    const navLinks = document.querySelector("#navLinks");
    const navItems = document.querySelectorAll(".nav-links a");

    function showToast(message) {
      toast.textContent = message;
      toast.classList.add("show");

      setTimeout(() => {
        toast.classList.remove("show");
      }, 1800);
    }

    function closeMenu() {
      menuBtn.classList.remove("active");
      navLinks.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "메뉴 열기");
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

    shareBtn.addEventListener("click", async () => {
      const shareData = {
        title: "Quokka Smile Project",
        text: "행복은 쿼카처럼 작고 따뜻하게 번집니다 ☺",
        url: window.location.href
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(shareData.text);
          showToast("공유 문구가 복사됐어요 ☺");
        }
      } catch (error) {
        showToast("공유를 취소했어요");
      }
    });

    campaignBtn.addEventListener("click", () => {
      window.location.href = "./campaign.html";
    });

    goodsBtn.addEventListener("click", () => {
    window.location.href = "./goods.html";
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
      const badge = document.querySelector("#dynamicBadge");
      if (!badge) return;

      const hour = new Date().getHours();
      const message = hour < 6
        ? "🌙 조용한 밤에도 행복을 전해요"
        : hour < 12
          ? "🌞 좋은 아침, 행복을 전하는 작은 친구"
          : hour < 18
            ? "🌿 오늘도 미소를 나누는 작은 친구"
            : "✨ 따뜻한 저녁을 만드는 작은 미소";

      badge.textContent = message;
    })();

(() => {
      const LANGUAGE_KEY = "quokkaSmileLanguage";
      const languageToggle = document.querySelector("#languageToggle");
      const typingTitle = document.querySelector("#typingTitle");
      const titleCopy = {"ko": "세상에 행복을 전하는\n작은 미소, 쿼카", "en": "A little smile that spreads happiness:\nthe quokka"};
      const pageTitleCopy = {"ko": "Quokka Smile Project", "en": "Quokka Smile Project"};
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