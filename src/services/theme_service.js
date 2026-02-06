 // src/services/theme_service.js
const THEME_URL = "https://eelu-test.runasp.net/api/login_conntroller/login_theme";

let _themesCache = null;
let _themesPromise = null;

export const fetch_theme_colors = async (opts = {}) => {
  const { force = false } = opts;

  if (!force && _themesCache) return _themesCache;

  if (!force && _themesPromise) return _themesPromise;

  if (!force) {
    try {
      const cached = localStorage.getItem("theme_colors_cache_v1");
      if (cached) {
        _themesCache = JSON.parse(cached);
        return _themesCache;
      }
    } catch {}
  }

  _themesPromise = (async () => {
    try {
      const response = await fetch(THEME_URL, { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch theme colors");

      const data = await response.json();

      const themes = {};
      data.forEach((theme) => {
        themes[theme.mode] = {
          text_color: theme.text_color,
          background_color: theme.background_color,
          box_background_color: theme.box_background_color,
          header_text: theme.header_text,
          input_border_color: theme.input_border_color,
          primary_color: theme.primary_color,
          primary_color_hover: theme.primary_color_hover,
          button_text_color: theme.button_text_color,
          disabled_color: theme.disabled_color,
          error_color: theme.error_color,
          required_color: theme.required_color,
          left_text_color: theme.left_text_color,
          subtitle_text_color: theme.subtitle_text_color,
          main_submit_color: theme.main_submit_color,
          mobile_submit_color: theme.mobile_submit_color,
          footer_text_color: theme.footer_text_color,
          loogo_url: theme.logo_url,
          slogan: theme.slogan,
        };
      });

      _themesCache = themes;
      try {
        localStorage.setItem("theme_colors_cache_v1", JSON.stringify(themes));
      } catch {}

      return themes;
    } finally {
      _themesPromise = null;
    }
  })();

  return _themesPromise;
};  