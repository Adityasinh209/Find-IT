import React from 'react'
import { Link } from 'react-router-dom'
import { User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Check if Clerk is available
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const isClerkAvailable = PUBLISHABLE_KEY && 
  PUBLISHABLE_KEY !== 'your_clerk_publishable_key_here' && 
  PUBLISHABLE_KEY.startsWith('pk_')

// Mock auth state for fallback
let mockSignedIn = false

// Unified components that work with or without Clerk
export function UnifiedSignedIn({ children }: { children: React.ReactNode }) {
  if (isClerkAvailable) {
    // Import Clerk components only when needed
    try {
      const { SignedIn } = require('@clerk/clerk-react')
      return <SignedIn>{children}</SignedIn>
    } catch {
      return mockSignedIn ? <>{children}</> : null
    }
  }
  return mockSignedIn ? <>{children}</> : null
}

export function UnifiedSignedOut({ children }: { children: React.ReactNode }) {
  if (isClerkAvailable) {
    try {
      const { SignedOut } = require('@clerk/clerk-react')
      return <SignedOut>{children}</SignedOut>
    } catch {
      return !mockSignedIn ? <>{children}</> : null
    }
  }
  return !mockSignedIn ? <>{children}</> : null
}

export function UnifiedUserButton() {
  if (isClerkAvailable) {
    try {
      const { UserButton } = require('@clerk/clerk-react')
      return (
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "h-8 w-8"
            }
          }}
        />
      )
    } catch {
      // Fallback to simple button
    }
  }
  
  // Fallback user button
  return (
    <button
      onClick={() => { mockSignedIn = false; window.location.reload() }}
      className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium hover:bg-primary/90 transition-colors"
      title="Sign out (Demo)"
    >
      U
    </button>
  )
}

export function UnifiedAuthAvatar() {
  return (
    <>
      <UnifiedSignedIn>
        <UnifiedUserButton />
      </UnifiedSignedIn>
      <UnifiedSignedOut>
        <Link 
          to="/sign-in"
          onClick={(e) => {
            // For fallback (no Clerk), just mock sign in
            if (!isClerkAvailable) {
              e.preventDefault()
              mockSignedIn = true
              window.location.reload()
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
      </UnifiedSignedOut>
    </>
  )
}
