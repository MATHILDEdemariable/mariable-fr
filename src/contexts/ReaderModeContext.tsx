
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type ReaderModeContextType = {
  isReaderMode: boolean;
  setReaderMode: (isReader: boolean) => void;
  shareToken: string | null;
  setShareToken: (token: string | null) => void;
  userId: string | null;
  setUserId: (userId: string | null) => void;
};

const ReaderModeContext = createContext<ReaderModeContextType | undefined>(undefined);

export const ReaderModeProvider = ({ children }: { children: ReactNode }) => {
  const [isReaderMode, setIsReaderMode] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const setReaderMode = (isReader: boolean) => {
    setIsReaderMode(isReader);
  };

  return (
    <ReaderModeContext.Provider value={{ 
      isReaderMode, 
      setReaderMode,
      shareToken, 
      setShareToken,
      userId,
      setUserId
    }}>
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
