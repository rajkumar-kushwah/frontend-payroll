// HighlightContext.js
import { createContext, useState, useContext } from "react";

const HighlightContext = createContext();

export const HighlightProvider = ({ children }) => {
  const [highlightEmployeeId, setHighlightEmployeeId] = useState(null);
  return (
    <HighlightContext.Provider value={{ highlightEmployeeId, setHighlightEmployeeId }}>
      {children}
    </HighlightContext.Provider>
  );
};

export const useHighlight = () => useContext(HighlightContext);
