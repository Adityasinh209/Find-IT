// This file provides auth components that work with or without Clerk
import { SignedIn as ClerkSignedIn, SignedOut as ClerkSignedOut, UserButton as ClerkUserButton, useUser as useClerkUser } from '@clerk/clerk-react';
import { FallbackSignedIn, FallbackSignedOut, FallbackUserButton, useFallbackAuth } from './fallback-auth';

// Check if Clerk is available
const hasValidClerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY && 
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY !== 'pk_test_your-clerk-key-here' && 
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.startsWith('pk_');

// Export the appropriate components based on Clerk availability
export const SignedIn = hasValidClerkKey ? ClerkSignedIn : FallbackSignedIn;
export const SignedOut = hasValidClerkKey ? ClerkSignedOut : FallbackSignedOut;
export const UserButton = hasValidClerkKey ? ClerkUserButton : FallbackUserButton;

// Hook that works with or without Clerk
export const useUser = () => {
  if (hasValidClerkKey) {
    return useClerkUser();
  } else {
    const { user } = useFallbackAuth();
    return { user, isSignedIn: false };
  }
};
