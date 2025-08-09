import React from 'react'
import { Link } from 'react-router-dom'
import { User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  FallbackSignedIn, 
  FallbackSignedOut, 
  FallbackUserButton, 
  useFallbackAuth,
  FallbackAuthProvider 
} from './fallback-auth'

// Check if Clerk is available
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const isClerkAvailable = PUBLISHABLE_KEY && 
  PUBLISHABLE_KEY !== 'your_clerk_publishable_key_here' && 
  PUBLISHABLE_KEY.startsWith('pk_')

// Dynamic imports for Clerk components (only when available)
let ClerkSignedIn: any = null
let ClerkSignedOut: any = null  
let ClerkUserButton: any = null

if (isClerkAvailable) {
  try {
    const clerkModule = await import('@clerk/clerk-react')
    ClerkSignedIn = clerkModule.SignedIn
    ClerkSignedOut = clerkModule.SignedOut
    ClerkUserButton = clerkModule.UserButton
  } catch (error) {
    console.warn('Failed to load Clerk components:', error)
  }
}

// Unified components that work with or without Clerk
export function SignedIn({ children }: { children: React.ReactNode }) {
  if (isClerkAvailable && ClerkSignedIn) {
    return <ClerkSignedIn>{children}</ClerkSignedIn>
  }
  return <FallbackSignedIn>{children}</FallbackSignedIn>
}

export function SignedOut({ children }: { children: React.ReactNode }) {
  if (isClerkAvailable && ClerkSignedOut) {
    return <ClerkSignedOut>{children}</ClerkSignedOut>
  }
  return <FallbackSignedOut>{children}</FallbackSignedOut>
}

export function UserButton() {
  if (isClerkAvailable && ClerkUserButton) {
    return (
      <ClerkUserButton 
        appearance={{
          elements: {
            avatarBox: "h-8 w-8"
          }
        }}
      />
    )
  }
  return <FallbackUserButton />
}

export function AuthAvatar() {
  const fallbackAuth = useFallbackAuth()
  
  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <Link 
          to="/sign-in"
          onClick={() => {
            // For fallback auth, just sign in immediately
            if (!isClerkAvailable) {
              fallbackAuth.signIn()
            }
          }}
        >
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src="" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Link>
      </SignedOut>
    </>
  )
}

// Provider wrapper
export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (isClerkAvailable) {
    return <>{children}</>
  }
  return <FallbackAuthProvider>{children}</FallbackAuthProvider>
}
