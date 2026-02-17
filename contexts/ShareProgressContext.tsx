import React, { createContext, useContext, useMemo } from 'react';
import { decodeSharePayload, getShareParam } from '../utils/codex';

interface ShareProgressContextType {
  isReadOnly: boolean;
  sharedProgress: Record<string, string>;
}

const ShareProgressContext = createContext<ShareProgressContextType>({
  isReadOnly: false,
  sharedProgress: {},
});

export const ShareProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useMemo<ShareProgressContextType>(() => {
    const encoded = getShareParam();
    const decoded = decodeSharePayload(encoded);
    if (!decoded) {
      return { isReadOnly: false, sharedProgress: {} };
    }
    return {
      isReadOnly: true,
      sharedProgress: decoded.checked,
    };
  }, []);

  return <ShareProgressContext.Provider value={value}>{children}</ShareProgressContext.Provider>;
};

export const useShareProgress = (): ShareProgressContextType => useContext(ShareProgressContext);
