import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Check if we have a valid Clerk key (not placeholder or empty)
const isValidClerkKey = PUBLISHABLE_KEY &&
  PUBLISHABLE_KEY !== 'your_clerk_publishable_key_here' &&
  PUBLISHABLE_KEY.startsWith('pk_')

export default function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  // If no valid Clerk key, just render children without Clerk
  if (!isValidClerkKey) {
    console.warn('Clerk not configured - running without authentication. Add VITE_CLERK_PUBLISHABLE_KEY to enable Clerk authentication.')
    return <>{children}</>
  }

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      {children}
    </ClerkProvider>
  )
}
