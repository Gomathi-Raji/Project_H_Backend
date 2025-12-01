import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import apiFetch, { setToken } from "@/lib/apiClient";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    confirmPassword: "",
    role: "tenant"
  });
  const { t } = useTranslation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    (async () => {
      try {
        const res = await apiFetch("/auth/register", {
          method: "POST",
          body: { name: formData.name, email: formData.email, phone: formData.number, password: formData.password, role: formData.role },
        });
        if (res.token) setToken(res.token);
        alert("Account created successfully!");
      } catch (err) {
        console.error(err);
        alert(err?.message || "Registration failed");
      }
    })();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-card shadow-card rounded-lg p-8 max-w-md w-full border border-border">
  <h2 className="text-2xl font-bold text-center text-foreground mb-6">{t('register.title')}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('register.name')}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('register.placeholders.name')}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('register.email')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('register.placeholders.email')}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('register.phone')}</label>
            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              placeholder={t('register.placeholders.phone')}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('register.role')}</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              required
            >
              <option value="tenant">{t('register.roleOptions.tenant')}</option>
              <option value="staff">{t('register.roleOptions.staff')}</option>
              <option value="admin">{t('register.roleOptions.admin')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('register.password')}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t('register.placeholders.password')}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('register.confirmPassword')}</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={t('register.placeholders.confirmPassword')}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('register.signup')}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          {t('register.haveAccount')} {" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            {t('register.login')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
