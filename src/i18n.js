import React from 'react';
import homeContent from './content/home';
import { getCmsPreviewData } from './content/cmsPreview';

export const translations = homeContent;

export const I18nContext = React.createContext({ lang: 'it', dict: translations.it, setLang: () => {} });

export function I18nProvider({ children }) {
  const [lang, setLang] = React.useState('it');
  React.useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const value = React.useMemo(() => {
    const baseDict = translations[lang] || translations.it;
    const previewDict = getCmsPreviewData('path_home', lang, baseDict);
    return { lang, setLang, dict: previewDict };
  }, [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return React.useContext(I18nContext);
}
