import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import he from './locales/he.json'

const LANGUAGE_STORAGE_KEY = 'applyboard-lang'

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    he: { translation: he },
  },
  lng: localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (language) => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
})

export default i18n
