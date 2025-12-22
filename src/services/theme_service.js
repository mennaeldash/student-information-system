export const fetch_theme_colors = async () => {
  try {
    const response = await fetch("https://eelu-test.runasp.net/api/login_conntroller/login_theme");

    if (!response.ok) {
      throw new Error("Failed to fetch theme colors");
    }

    const data = await response.json();

    // API بيرجع Array [ {mode: light}, {mode: dark} ]
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
        logo_url: theme.logo_url,
        slogan: theme.slogan,
      };
    });

    return themes;
  } catch (error) {
    // console.error("Fetch theme colors error:", error);

    // // fallback (لو السيرفر وقع نستخدم default theme)
    // return {
    //   light: {
    //     text_color: "#1E1E1E",
    //     background_color: "#FFFFFF",
    //     box_background_color: "#f3f3f3",
    //     header_text: "Academic Year 2025-2024",
    //     input_border_color: "#D1D5DB",
    //     primary_color: "#103977",
    //     primary_color_hover: "#d2d2d5ff",
    //     button_text_color: "#ffffff",
    //     disabled_color: "#999999",
    //     error_color: "#845d5dff",
    //     required_color: "#c11b1b",
    //     left_text_color: "#ffffff",
    //     subtitle_text_color: "#555555",
    //     main_submit_color: "#1C2742",
    //     mobile_submit_color: "#1C2742",
    //     footer_text_color: "#999999",
    //     logo_url: "../../public/final EELU logo-01.png",
    //     slogan: "تعليم يقرب المسافات",
    //   },
    //   dark: {
    //     text_color: "#000000ff",
    //     background_color: "#0F172A",
    //     box_background_color: "#0E1A2F",
    //     header_text: "Academic Year 2025-2024",
    //     input_border_color: "#444",
    //     primary_color: "#103977",
    //     primary_color_hover: "#3a7bd5",
    //     button_text_color: "#000000",
    //     disabled_color: "#555555",
    //     error_color: "#ff6b6b",
    //     required_color: "#d9b6b6ff",
    //     left_text_color: "#ffffff",
    //     subtitle_text_color: "#dddddd",
    //     main_submit_color: "#1C2742",
    //     mobile_submit_color: "#FAFAFA",
    //     footer_text_color: "#aaaaaa",
    //     logo_url: "../../public/final EELU logo-01.png",
    //     slogan: "تعليم يقرب المسافات",
    //   }
    // };
  }
};