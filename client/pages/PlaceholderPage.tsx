import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Construction, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// Conditionally import Clerk components
const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const isClerkConfigured = CLERK_KEY && CLERK_KEY !== 'your_clerk_publishable_key_here' && CLERK_KEY.startsWith('pk_')

let SignedIn: any = () => null
let SignedOut: any = ({ children }: { children: React.ReactNode }) => <>{children}</>
let UserButton: any = () => null

if (isClerkConfigured) {
  try {
    const clerkModule = require('@clerk/clerk-react')
    SignedIn = clerkModule.SignedIn
    SignedOut = clerkModule.SignedOut
    UserButton = clerkModule.UserButton
  } catch (error) {
    console.warn('Clerk not available:', error)
  }
}

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ArrowLeft className="w-5 h-5 text-primary-foreground" />
              </div>
            </Link>
            <Link to="/" className="text-2xl font-bold text-primary">FindIt</Link>
          </div>
          <div className="flex items-center space-x-3">
            <nav className="hidden md:flex items-center space-x-6 text-sm">
              <Link to="/browse" className="text-muted-foreground hover:text-foreground transition-colors">
                Browse Items
              </Link>
              <Link to="/post" className="text-muted-foreground hover:text-foreground transition-colors">
                Report Lost Item
              </Link>
              <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Link to="/post">
                <Button size="sm" className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Report Item</span>
                </Button>
              </Link>
              {isClerkConfigured ? (
                <>
                  <SignedIn>
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "h-8 w-8"
                        }
                      }}
                    />
                  </SignedIn>
                  <SignedOut>
                    <Link to="/sign-in">
                      <Avatar className="h-8 w-8 cursor-pointer">
                        <AvatarImage src="" />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  </SignedOut>
                </>
              ) : (
                <Avatar className="h-8 w-8 cursor-pointer" title="Demo Mode - Clerk not configured">
                  <AvatarImage src="" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Construction className="w-8 h-8 text-muted-foreground" />
              </div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                This page is coming soon! Continue prompting to help fill in this page's content.
              </p>
              <Button asChild>
                <Link to="/">Return to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
