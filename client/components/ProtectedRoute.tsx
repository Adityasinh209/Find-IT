import { useAuth } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useAuth()

  // Debug logging
  console.log('ProtectedRoute - isLoaded:', isLoaded, 'isSignedIn:', isSignedIn)

  // Wait for auth to load
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    )
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    console.log('ProtectedRoute - User not signed in, redirecting to /sign-in')
    return <Navigate to="/sign-in" replace />
  }

  console.log('ProtectedRoute - User is signed in, allowing access')
  return <>{children}</>
}
