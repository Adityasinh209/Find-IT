import React, { createContext, useContext } from 'react';

// Fallback user object when Clerk is not available
const mockUser = {
  id: 'fallback-user',
  fullName: 'Guest User',
  firstName: 'Guest',
  lastName: 'User',
  primaryEmailAddress: {
    emailAddress: 'guest@example.com'
  }
};

// Context for fallback auth state
const FallbackAuthContext = createContext({
  user: mockUser,
  isSignedIn: false
});

export const FallbackAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <FallbackAuthContext.Provider value={{ user: mockUser, isSignedIn: false }}>
      {children}
    </FallbackAuthContext.Provider>
  );
};

export const useFallbackAuth = () => useContext(FallbackAuthContext);

// Fallback components that match Clerk's API
export const FallbackSignedIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return null; // Never show authenticated content in fallback mode
};

export const FallbackSignedOut: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>; // Always show non-authenticated content in fallback mode
};

export const FallbackUserButton: React.FC<any> = () => {
  return (
    <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
      <span className="text-xs text-muted-foreground">G</span>
    </div>
  );
};
