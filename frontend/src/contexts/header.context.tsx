// src/contexts/header.context.tsx
import React, { createContext, useContext, useState } from "react";

interface HeaderContextType {
  headerName: string;
  setHeaderName: (name: string) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [headerName, setHeaderName] = useState<string>("");

  return <HeaderContext.Provider value={{ headerName, setHeaderName }}>{children}</HeaderContext.Provider>;
};

export const useHeader = (): HeaderContextType => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
};
