import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import pl from './locales/pl.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { pl, en },
    fallbackLng: 'pl',
    supportedLngs: ['pl', 'en'],
    defaultNS: 'common',
    ns: ['common', 'nav', 'theme', 'dashboard', 'simulator', 'pets', 'cars', 'accounts', 'settings'],
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'language',
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
  })

export default i18n
