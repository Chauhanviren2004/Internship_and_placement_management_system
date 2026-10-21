import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import { BACKEND_ROOT_URL, getApiError } from "./api";
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const endpoint = `/${form.role}/register`;
      await axios.post(`${BACKEND_ROOT_URL}${endpoint}`, {
        name: form.full_name,
        email: form.email,
        password: form.password,
      });
      navigate("/login");
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to register."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left-panel">
        <div className="auth-branding">
          <div className="auth-logo">
            <span>IntelliPlace</span>
          </div>
          <h1>Create your account</h1>
          <p>Students, companies, and admins can all use the same platform.</p>
        </div>
      </div>

      <div className="auth-right-panel">
        <div className="form-container">
          <Link to="/" className="back-home-btn">
            Back to home
          </Link>

          <h2>Create Account</h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>FULL NAME</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>I AM A</label>
              <div className="role-selector">
                {["student", "company", "admin"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    className={form.role === role ? "active" : ""}
                    onClick={() => setForm((current) => ({ ...current, role }))}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label>EMAIL</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>PASSWORD</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  minLength={6}
                  required
                />
              </div>
            </div>

            {error && <p className="resume-message error">{error}</p>}

            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="bottom-text">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
