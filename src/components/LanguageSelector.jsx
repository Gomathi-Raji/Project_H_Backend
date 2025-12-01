import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = ({ className }) => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'ml', label: 'മലയാളം' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
  ];

  const handleChange = (e) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    try { localStorage.setItem('appLanguage', lng); } catch (err) { /* ignore */ }
  };

  return (
    <div className={className}>
      <select
        aria-label="Select language"
        value={i18n.language || 'en'}
        onChange={handleChange}
        className="border border-input rounded-md px-2 py-1 bg-background text-sm"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
