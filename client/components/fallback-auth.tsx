import React, { createContext, useContext, useState } from 'react'
import { User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

// Mock auth context for when Clerk is not available
interface FallbackAuthContextType {
  isSignedIn: boolean
  signIn: () => void
  signOut: () => void
}

const FallbackAuthContext = createContext<FallbackAuthContextType>({
  isSignedIn: false,
  signIn: () => {},
  signOut: () => {},
})

export function FallbackAuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false)

  const signIn = () => setIsSignedIn(true)
  const signOut = () => setIsSignedIn(false)

  return (
    <FallbackAuthContext.Provider value={{ isSignedIn, signIn, signOut }}>
      {children}
    </FallbackAuthContext.Provider>
  )
}

export function useFallbackAuth() {
  return useContext(FallbackAuthContext)
}

// Fallback components that mimic Clerk's API
export function FallbackSignedIn({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useFallbackAuth()
  return isSignedIn ? <>{children}</> : null
}

export function FallbackSignedOut({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useFallbackAuth()
  return !isSignedIn ? <>{children}</> : null
}

export function FallbackUserButton() {
  const { signOut } = useFallbackAuth()
  
  return (
    <div className="relative">
      <button
        onClick={signOut}
        className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium hover:bg-primary/90 transition-colors"
        title="Sign out (Demo)"
      >
        U
      </button>
    </div>
  )
}
