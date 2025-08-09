import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, MapPin, Calendar, Tag, Eye, Phone, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock data for recent items
const recentItems = [
  {
    id: 1,
    title: "iPhone 13 Pro - Blue",
    category: "Electronics",
    description: "Lost my blue iPhone 13 Pro in the library study area on the 3rd floor. Has a clear case with university stickers.",
    location: "Main Library - 3rd Floor",
    dateReported: "2024-01-15",
    status: "lost",
    contactEmail: "john.doe@university.edu",
    contactPhone: "(555) 123-4567",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    title: "Black North Face Backpack",
    category: "Bags",
    description: "Black North Face backpack with laptop compartment. Contains textbooks and a water bottle.",
    location: "Student Union Building",
    dateReported: "2024-01-14",
    status: "lost",
    contactEmail: "sarah.smith@university.edu",
    contactPhone: "(555) 987-6543"
  },
  {
    id: 3,
    title: "Silver Car Keys - Honda",
    category: "Keys",
    description: "Honda car keys with blue keychain that says 'Class of 2024'. Lost somewhere near the gym.",
    location: "Recreation Center",
    dateReported: "2024-01-13",
    status: "lost",
    contactEmail: "mike.wilson@university.edu",
    contactPhone: "(555) 456-7890"
  },
  {
    id: 4,
    title: "Red Water Bottle - Hydro Flask",
    category: "Personal Items",
    description: "Red Hydro Flask water bottle with university logo sticker. Left in chemistry lab.",
    location: "Science Building - Lab 201",
    dateReported: "2024-01-12",
    status: "found",
    contactEmail: "lab.assistant@university.edu",
    contactPhone: "(555) 234-5678"
  }
];

const categories = [
  "All Categories",
  "Electronics",
  "Bags",
  "Keys",
  "Personal Items",
  "Clothing",
  "Books",
  "Sports Equipment",
  "Jewelry",
  "Other"
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Items');

  const filteredItems = useMemo(() => {
    return recentItems.filter(item => {
      const lowerSearchQuery = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery ||
                           item.title.toLowerCase().includes(lowerSearchQuery) ||
                           item.description.toLowerCase().includes(lowerSearchQuery) ||
                           item.location.toLowerCase().includes(lowerSearchQuery);

      const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All Items' ||
                           (selectedStatus === 'Lost Items' && item.status === 'lost') ||
                           (selectedStatus === 'Found Items' && item.status === 'found');

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchQuery, selectedCategory, selectedStatus]);

  // Calculate real stats from the actual data with memoization
  const stats = useMemo(() => {
    const totalItemsPosted = recentItems.length;
    const itemsFound = recentItems.filter(item => item.status === 'found').length;
    const activeUsers = new Set(recentItems.map(item => item.contactEmail)).size;

    return { totalItemsPosted, itemsFound, activeUsers };
  }, [recentItems]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-primary">FindIt</h1>
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
              <Link to="/browse">
                <Button variant="ghost" size="sm">
                  Browse
                </Button>
              </Link>
              <ThemeToggle />
              <Link to="/post">
                <Button size="sm" className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Report Lost</span>
                </Button>
              </Link>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src="" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background to-muted/30 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-foreground mb-2">
            Lost Something?
          </h2>
          <h3 className="text-5xl font-bold text-primary mb-6">
            We're Here for You
          </h3>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Connect with your campus community to reunite lost items with their owners. Report
            what you've lost or found, and help make our campus a better place.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex gap-3 p-2 bg-card rounded-full shadow-sm border">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search for lost items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 border-0 bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Button className="h-12 px-8 rounded-full">
                Search
                <Search className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link to="/post">
              <Button size="lg" className="w-full sm:w-auto px-10 py-4 text-lg rounded-full h-14 shadow-lg hover:shadow-xl transition-all">
                <Plus className="w-5 h-5 mr-2" />
                Report Lost Item
              </Button>
            </Link>
            <Link to="/browse">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-10 py-4 text-lg rounded-full h-14 shadow-lg hover:shadow-xl transition-all">
                <Search className="w-5 h-5 mr-2" />
                Browse All Items
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{stats.totalItemsPosted}</div>
              <div className="text-muted-foreground text-sm">Items Posted</div>
            </div>
            <div className="text-center mr-1">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{stats.itemsFound}</div>
              <div className="text-muted-foreground text-sm">Items Found</div>
            </div>
            <div className="text-center hidden">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{activeUsers}</div>
              <div className="text-muted-foreground text-sm">Active Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Items */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Recent Reports</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what's been recently reported on campus. Your lost item might already be here!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.slice(0, 6).map((item) => (
              <Card key={item.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                    <Badge variant={item.status === 'lost' ? 'destructive' : 'default'}>
                      {item.status === 'lost' ? 'Lost' : 'Found'}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground space-x-4">
                    <div className="flex items-center space-x-1">
                      <Tag className="w-4 h-4" />
                      <span>{item.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(item.dateReported).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 line-clamp-3">
                    {item.description}
                  </CardDescription>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                      <a href={`mailto:${item.contactEmail}`} className="text-primary hover:underline">
                        {item.contactEmail}
                      </a>
                    </div>
                    {item.contactPhone && (
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                        <a href={`tel:${item.contactPhone}`} className="text-primary hover:underline">
                          {item.contactPhone}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">No items found matching your search criteria.</div>
              <Button asChild>
                <Link to="/post">Report a Lost Item</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center text-foreground mb-12">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-primary-foreground" />
              </div>
              <h4 className="text-lg font-semibold mb-2">1. Report an Item</h4>
              <p className="text-muted-foreground">
                Lost something? Found something? Create a detailed report with photos and location details.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary-foreground" />
              </div>
              <h4 className="text-lg font-semibold mb-2">2. Search & Browse</h4>
              <p className="text-muted-foreground">
                Browse through reported items or use our search filters to find exactly what you're looking for.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primary-foreground" />
              </div>
              <h4 className="text-lg font-semibold mb-2">3. Connect & Recover</h4>
              <p className="text-muted-foreground">
                Found a match? Contact the owner directly through the provided contact information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold text-primary mb-4">FindIt</h4>
              <p className="text-sm text-muted-foreground">
                Helping campus communities reunite with their lost belongings.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Quick Links</h5>
              <div className="space-y-2">
                <Link to="/browse" className="block text-sm text-muted-foreground hover:text-foreground">
                  Browse Items
                </Link>
                <Link to="/post" className="block text-sm text-muted-foreground hover:text-foreground">
                  Report Item
                </Link>
                <Link to="/help" className="block text-sm text-muted-foreground hover:text-foreground">
                  Help & Support
                </Link>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Features</h5>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Smart Search</div>
                <div className="text-sm text-muted-foreground">Real-time Updates</div>
                <div className="text-sm text-muted-foreground">Safe & Secure</div>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Support</h5>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Contact Us</div>
                <div className="text-sm text-muted-foreground">Privacy Policy</div>
                <div className="text-sm text-muted-foreground">Terms of Service</div>
              </div>
            </div>
          </div>
          <div className="border-t pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 FindIt. All rights reserved. Helping students reconnect with their belongings.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
