import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">FindIt</h1>
          <p className="text-muted-foreground">Sign in to report lost items</p>
        </div>
        <SignIn 
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
      </div>
    </div>
  )
}
