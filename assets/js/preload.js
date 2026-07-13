(() => {
      try {
        const savedTheme = localStorage.getItem("quokkaSmileTheme");
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const theme = savedTheme || systemTheme;
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme;
      } catch (error) {
        document.documentElement.dataset.theme = "light";
      }
    })();
  
try { document.documentElement.lang = localStorage.getItem("quokkaSmileLanguage") || "ko"; } catch (e) { document.documentElement.lang = "ko"; }