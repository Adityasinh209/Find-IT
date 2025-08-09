import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  showBackButton?: boolean;
  currentPage?: 'home' | 'browse' | 'post' | 'help';
  title?: string;
}

export const Header = React.memo<HeaderProps>(({ 
  showBackButton = false, 
  currentPage = 'home',
  title 
}) => {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Link to="/" aria-label="Back to home">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ArrowLeft className="w-5 h-5 text-primary-foreground" />
              </div>
            </Link>
          )}
          <Link to="/" className="text-2xl font-bold text-primary">
            {title || 'FindIt'}
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          <nav className="hidden md:flex items-center space-x-6 text-sm" role="navigation">
            <Link 
              to="/browse" 
              className={`transition-colors ${
                currentPage === 'browse' 
                  ? 'text-foreground font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Browse Items
            </Link>
            <Link 
              to="/post" 
              className={`transition-colors ${
                currentPage === 'post' 
                  ? 'text-foreground font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Report Lost Item
            </Link>
            <Link 
              to="/help" 
              className={`transition-colors ${
                currentPage === 'help' 
                  ? 'text-foreground font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              About
            </Link>
          </nav>
          
          <div className="flex items-center space-x-2">
            {currentPage !== 'post' && (
              <Link to="/browse">
                <Button variant="ghost" size="sm">
                  Browse
                </Button>
              </Link>
            )}
            <ThemeToggle />
            {currentPage !== 'post' && (
              <Link to="/post">
                <Button size="sm" className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Report Item</span>
                </Button>
              </Link>
            )}
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src="" alt="User avatar" />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
