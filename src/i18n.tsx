import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from 'translations/en.json';
import ko from 'translations/ko.json';
import vi from 'translations/vi.json';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  EN: {
    translation: en,
  },
  VI: {
    translation: vi,
  },
  KO: {
    translation: ko,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'EN',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
