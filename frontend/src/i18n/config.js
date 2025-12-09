import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        welcome: "Welcome to Rwanda Crime Report",
        login: "Login",
        register: "Register",
        reportCrime: "Report Crime",
        viewReports: "View Reports",
        logout: "Logout",
      },
    },
    fr: {
      translation: {
        welcome: "Bienvenue à Rwanda Crime Report",
        login: "Connexion",
        register: "S'inscrire",
        reportCrime: "Signaler un crime",
        viewReports: "Voir les rapports",
        logout: "Déconnexion",
      },
    },
    rw: {
      translation: {
        welcome: "Murakaza neza kuri Rwanda Crime Report",
        login: "Injira",
        register: "Iyandikishe",
        reportCrime: "Tangaza icyaha",
        viewReports: "Reba raporo",
        logout: "Sohoka",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
