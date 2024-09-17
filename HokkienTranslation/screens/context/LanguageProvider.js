import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [languages, setLanguages] = useState(['English', 'Hokkien']);

  return (
    <LanguageContext.Provider value={{ languages, setLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
