// src/pages/student/Login.jsx
import { useEffect, useState } from "react";
import { fetch_theme_colors } from "../../services/theme_service";
import "../student/login.css";
import { login } from "../../services/auth_service";
import * as FaIcons from "react-icons/fa";
import ThemeToggle from "../../components/ThemeToggle";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);
  const navigate = useNavigate();

  const [header_text, setHeader_text] = useState("");
  const [student_id, setStudent_id] = useState("");
  const [password, setPassword] = useState("");
  const [error_message, setError_message] = useState("");
  const [theme_colors, setTheme_colors] = useState({});
  const [current_theme, setCurrent_theme] = useState("light");
  const [is_loading, setIs_loading] = useState(false);
  const [loogo_url, setLoogo_url] = useState("");
  const [slogan, setSlogan] = useState("");

  const [theme_loading, setTheme_loading] = useState(true);
  const [theme_error, setTheme_error] = useState("");
  const [all_colors, setAll_colors] = useState(null);

  useEffect(() => {
    const get_colors = async () => {
      try {
        setTheme_loading(true);
        setTheme_error("");
        const colors = await fetch_theme_colors();
        setAll_colors(colors);
      } catch (error) {
        console.error("Error loading theme colors:", error);
        setTheme_error("Failed to load theme colors");
      } finally {
        setTheme_loading(false);
      }
    };
    get_colors();
  }, []);

  useEffect(() => {
    if (all_colors) {
      const themeData = all_colors[current_theme] || {};
      setTheme_colors(themeData);
      setLoogo_url(themeData.loogo_url || "");
      setSlogan(themeData.slogan || "");
      setHeader_text(themeData.header_text || "");

      document.documentElement.setAttribute("data-theme", current_theme);
      Object.entries(themeData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          document.documentElement.style.setProperty(`--${key}`, value);
        }
      });
    }
  }, [current_theme, all_colors]);

  const handle_submit = async (e) => {
    e.preventDefault();
    setIs_loading(true);
    setError_message("");

    try {
      const result = await login(student_id, password);

      if (result?.token) localStorage.setItem("token", result.token);
      if (result?.refreshToken) localStorage.setItem("refreshToken", result.refreshToken);
      if (result?.refreshTokenExpires) localStorage.setItem("refreshTokenExpires", result.refreshTokenExpires);

      if (result?.profile) {
        localStorage.setItem("profileData", JSON.stringify(result.profile));
      }

      if (result?.token || result?.profile) {
        localStorage.setItem("student_id", student_id);
        navigate("/dashboard", { replace: true });
      } else {
        setError_message("Invalid Student ID or Password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError_message(
        error?.status === 401
          ? "Invalid Student ID or Password"
          : "Something went wrong, please try again later"
      );
    } finally {
      setIs_loading(false);
    }
  };

  if (theme_loading) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading theme...</p>;
  }

  if (theme_error) {
    return (
      <p style={{ color: "red", textAlign: "center", marginTop: "50px" }}>
        {theme_error}
      </p>
    );
  }

  return (
    <div className="login">
      <div className="top_header">
        <span className="header_text_left">{header_text}</span>
        <div className="header_right">
          <span className="support_text">Help & Support</span>
          <ThemeToggle currentTheme={current_theme} setCurrentTheme={setCurrent_theme} />
        </div>
      </div>

      <div className="background_circle top_left_circle"></div>
      <div className="background_circle bottom_right_circle"></div>

      <div className="login_page_container ">
        <div className="left_side">
          <div className="logo_wrapper">
            <img
              alt="EELU_Logo"
              src={loogo_url }
              className="logo_left"
            
            />
            <p className="left_text">{slogan}</p>
          </div>
        </div>

        <div className="right_side">
          <div className="login_container fade-in-up-login ">
            <h2 className="title">Administration Portal</h2>
            <p className="subtitle">Sign in to access your dashboard</p>

            <form onSubmit={handle_submit}>
              <div className="input_group input-with-icon">
                <label htmlFor="student_id" className="input_label">
                  Student ID <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  id="student_id"
                  name="student_id"
                  type="text"
                  required
                  autoComplete="username"
                  className={`input_field ${error_message ? "input_error" : ""}`}
                  value={student_id}
                  onChange={(e) => setStudent_id(e.target.value)}
                />
                <FaIcons.FaUser className="input_icon" />
              </div>

              <div className="input_group input-with-icon">
                <label htmlFor="password" className="input_label">
                  Password <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className={`input_field ${error_message ? "input_error" : ""}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FaIcons.FaLock className="input_icon" />
                <span className="eye_icon" onClick={togglePassword}>
                  {showPassword ? <FaIcons.FaEye /> : <FaIcons.FaEyeSlash />}
                </span>
              </div>

              <p className={`error_message${error_message ? " visible" : ""}`}>
                {error_message && (
                  <>
                    <FaIcons.FaExclamationCircle style={{ marginRight: "5px" }} />
                    {error_message}
                  </>
                )}
              </p>

              <div className="options_row">
                <label>
                  <input type="checkbox" name="remember_me" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="forgot_password_link">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" className="submit_button" disabled={is_loading}>
                {is_loading ? "Loading..." : "Sign in"}
              </button>
            </form>

            <p className="footer_note">
              This is a secure system for authorized personnel only. Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>© 2025 University Administration Portal. All rights reserved.</p>
        <div className="footer_links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
}
