import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import hi from './locales/hi.json';
import ml from './locales/ml.json';
import kn from './locales/kn.json';

const resources = {
  en: { translation: en },
  ta: { translation: ta },
  te: { translation: te },
  hi: { translation: hi },
  ml: { translation: ml },
  kn: { translation: kn },
};

const savedLang = localStorage.getItem('appLanguage') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: { useSuspense: false },
  });

export default i18n;
