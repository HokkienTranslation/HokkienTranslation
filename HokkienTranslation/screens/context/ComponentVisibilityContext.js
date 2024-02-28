import React, { createContext, useState, useContext } from "react";

const ComponentVisibilityContext = createContext();

export const useComponentVisibility = () =>
  useContext(ComponentVisibilityContext);

export const ComponentVisibilityProvider = ({ children }) => {
  const [visibilityStates, setVisibilityStates] = useState({
    image: true,
    definition: true,
    hokkienSentence: true,
    chineseSentence: true,
    englishSentence: true,
    textToSpeech: true,
  });

  const toggleVisibility = (componentType) => {
    setVisibilityStates((prevStates) => ({
      ...prevStates,
      [componentType]: !prevStates[componentType],
    }));
  };

  return (
    <ComponentVisibilityContext.Provider
      value={{ visibilityStates, toggleVisibility }}
    >
      {children}
    </ComponentVisibilityContext.Provider>
  );
};
