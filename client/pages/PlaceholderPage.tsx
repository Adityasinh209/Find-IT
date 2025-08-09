import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
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
