import React, { useState } from "react";
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Normally, you'd call your backend API here
    console.log("Password reset requested for:", email);

    setSuccess(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('forgotPassword.title')}</h2>
        <p className="text-gray-600 text-sm mb-6">{t('forgotPassword.description')}</p>

        {success ? (
          <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center">
            ✅ {t('forgotPassword.success')}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('forgotPassword.emailLabel')}
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('forgotPassword.placeholder')}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              {t('forgotPassword.send')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
