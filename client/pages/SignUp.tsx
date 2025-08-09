import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

// Check if Clerk is configured
const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const isClerkConfigured = CLERK_KEY && CLERK_KEY !== 'your_clerk_publishable_key_here' && CLERK_KEY.startsWith('pk_')

let SignUp: any = null
if (isClerkConfigured) {
  try {
    const clerkModule = require('@clerk/clerk-react')
    SignUp = clerkModule.SignUp
  } catch (error) {
    console.warn('Clerk not available:', error)
  }
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">FindIt</h1>
          <p className="text-muted-foreground">Create your account</p>
        </div>

        {isClerkConfigured && SignUp ? (
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
                card: 'bg-card border shadow-lg',
                headerTitle: 'text-foreground',
                headerSubtitle: 'text-muted-foreground',
                socialButtonsBlockButton: 'border-input bg-background hover:bg-accent hover:text-accent-foreground',
                formFieldInput: 'bg-background border-input',
                footerActionLink: 'text-primary hover:text-primary/90'
              }
            }}
          />
        ) : (
          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle>Authentication Not Configured</CardTitle>
              <CardDescription>
                Clerk authentication is not set up yet. The app is running in demo mode.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                To enable authentication:
              </p>
              <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                <li>Create a Clerk account at clerk.com</li>
                <li>Get your publishable key</li>
                <li>Set VITE_CLERK_PUBLISHABLE_KEY in your environment</li>
              </ol>
              <Link to="/">
                <Button className="w-full">
                  Continue to App (Demo Mode)
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
