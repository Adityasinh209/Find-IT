import { SignUp } from '@clerk/clerk-react'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 bg-card/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border">
          <h1 className="text-4xl font-bold text-primary mb-3">FindIt</h1>
          <p className="text-lg text-foreground font-medium">Create an account to report lost items</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              // Card styling
              card: 'bg-card/90 backdrop-blur-sm border-2 shadow-2xl rounded-xl',

              // Header styling
              headerTitle: 'text-foreground text-xl font-bold text-center',
              headerSubtitle: 'text-muted-foreground text-center',

              // Form field styling
              formFieldInput: 'bg-background/90 border-2 border-border text-foreground placeholder:text-muted-foreground font-medium',
              formFieldLabel: 'text-foreground font-semibold text-sm',

              // Button styling
              formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all',

              // Social buttons styling
              socialButtonsBlockButton: 'border-2 border-border bg-background/90 hover:bg-accent hover:text-accent-foreground text-foreground font-medium shadow-md hover:shadow-lg transition-all',
              socialButtonsBlockButtonText: 'text-foreground font-medium',
              socialButtonsBlockButtonArrow: 'text-foreground',

              // Links and text
              footerActionLink: 'text-primary hover:text-primary/80 font-medium',
              identityPreviewText: 'text-foreground font-medium',
              formFieldSuccessText: 'text-green-600 font-medium',
              formFieldErrorText: 'text-destructive font-medium',

              // Divider
              dividerLine: 'bg-border',
              dividerText: 'text-muted-foreground font-medium',

              // Additional text elements
              formHeaderTitle: 'text-foreground font-bold',
              formHeaderSubtitle: 'text-muted-foreground',
              formFieldHintText: 'text-muted-foreground font-medium',
              formResendCodeLink: 'text-primary font-medium',

              // Loading and states
              spinner: 'text-primary',

              // Root container
              rootBox: 'w-full'
            },
            layout: {
              showOptionalFields: true,
              socialButtonsPlacement: 'top'
            }
          }}
        />
      </div>
    </div>
  )
}
