import { ClerkProvider } from '@clerk/clerk-react'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

export default function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  // Check if we have a valid Clerk key
  if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'your_clerk_publishable_key_here') {
    console.warn('Add your Clerk Publishable Key to the .env file')
    // Return children without Clerk wrapper for demo mode
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
