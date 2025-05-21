
import React, { createContext, useContext, useState, ReactNode } from 'react';

type ReaderModeContextType = {
  isReaderMode: boolean;
  setReaderMode: (isReader: boolean) => void;
};

const ReaderModeContext = createContext<ReaderModeContextType | undefined>(undefined);

export const ReaderModeProvider = ({ children }: { children: ReactNode }) => {
  const [isReaderMode, setIsReaderMode] = useState(false);

  const setReaderMode = (isReader: boolean) => {
    setIsReaderMode(isReader);
  };

  return (
    <ReaderModeContext.Provider value={{ isReaderMode, setReaderMode }}>
      {children}
    </ReaderModeContext.Provider>
  );
};

export const useReaderMode = () => {
  const context = useContext(ReaderModeContext);
  if (context === undefined) {
    throw new Error('useReaderMode must be used within a ReaderModeProvider');
  }
  return context;
};
