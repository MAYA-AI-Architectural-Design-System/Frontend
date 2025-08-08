import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../public/locales/en/common.json";
import am from "../public/locales/am/common.json";

const resources = {
  en: { common: en },
  am: { common: am },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "am",
  fallbackLng: "am",
  debug: process.env.NODE_ENV === "development",
  interpolation: {
    escapeValue: false,
  },
  ns: ["common"],
  defaultNS: "common",
  react: {
    useSuspense: false,
  },
});

export default i18n;
