// lib/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';

// Add relative time plugin to dayjs
dayjs.extend(relativeTime);

// Initialize i18next for React
i18n
  // load translations via http
  .use(Backend)
  // detect user language
  .use(LanguageDetector)
  // hook into react
  .use(initReactI18next)
  // init with config
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr', 'es'],
    debug: import.meta.env.DEV,
    ns: ['common', 'calendar', 'notifications'],
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false, // react already does escaping
      format: (value, formatStr, lng) => {
        if (value instanceof Date) {
          dayjs.locale(lng || 'en');
          if (formatStr === 'relative') {
            return dayjs(value).fromNow();
          }
          return dayjs(value).format(formatStr);
        }
        return value;
      },
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      lookupCookie: 'i18next',
      caches: ['localStorage', 'cookie'],
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;

/**
 * Change application language at runtime
 * Also updates dayjs and persists preference
 */
export function changeLanguage(language) {
  i18n.changeLanguage(language);
  dayjs.locale(language);
  localStorage.setItem('i18nextLng', language);
  // inform backend of locale change
  fetch('/api/user/locale', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ locale: language }),
    credentials: 'include',
  }).catch((err) => {
    console.error('Failed to update server locale:', err);
  });
  return language;
}
