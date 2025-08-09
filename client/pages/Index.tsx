import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, MapPin, Calendar, Tag, Eye, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

  const filteredItems = recentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All Items' || 
                         (selectedStatus === 'Lost Items' && item.status === 'lost') ||
                         (selectedStatus === 'Found Items' && item.status === 'found');
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Campus Lost & Found</h1>
          </div>
          <Link to="/post">
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Report Item</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent to-accent/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Lost Something? Found Something?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our campus Lost & Found portal helps you reconnect with your belongings. 
            Report lost items, browse found items, or help others find what they've lost.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-col lg:flex-row gap-4 p-6 bg-card rounded-lg shadow-lg border">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search for items by name, description, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-40 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Items">All Items</SelectItem>
                    <SelectItem value="Lost Items">Lost Items</SelectItem>
                    <SelectItem value="Found Items">Found Items</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-card rounded-lg p-6 border">
              <div className="text-3xl font-bold text-primary mb-2">47</div>
              <div className="text-muted-foreground">Items Reported</div>
            </div>
            <div className="bg-card rounded-lg p-6 border">
              <div className="text-3xl font-bold text-green-600 mb-2">23</div>
              <div className="text-muted-foreground">Successfully Returned</div>
            </div>
            <div className="bg-card rounded-lg p-6 border">
              <div className="text-3xl font-bold text-orange-600 mb-2">12</div>
              <div className="text-muted-foreground">Waiting to be Claimed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Items */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-foreground">Recent Reports</h3>
            <Link to="/browse">
              <Button variant="outline" className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>View All Items</span>
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.slice(0, 6).map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
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
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Campus Lost & Found. Helping students reconnect with their belongings.
          </p>
        </div>
      </footer>
    </div>
  );
}
