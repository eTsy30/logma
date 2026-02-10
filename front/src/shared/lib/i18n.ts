// Simple i18n utility for the project
interface TranslationDict {
  [key: string]: string;
}

const translations: Record<string, TranslationDict> = {
  en: {
    'password.hide': 'Hide password',
    'password.show': 'Show password',
  },
  ru: {
    'password.hide': 'Скрыть пароль',
    'password.show': 'Показать пароль',
  },
};

export const getLanguage = (): string => {
  if (typeof window !== 'undefined') {
    return navigator.language.split('-')[0] || 'en';
  }
  return 'en';
};

export const t = (key: string): string => {
  const lang = getLanguage();
  const langDict = translations[lang];
  const enDict = translations.en as TranslationDict;

  return langDict?.[key] ?? enDict[key] ?? key;
};
