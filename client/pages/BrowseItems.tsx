import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Filter, MapPin, Calendar, Tag, Mail, Phone, SlidersHorizontal, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AutocompleteSearch } from '@/components/AutocompleteSearch';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

// Extended mock data
const allItems = [
  {
    id: 1,
    title: "iPhone 13 Pro - Blue",
    category: "Electronics",
    description: "Lost my blue iPhone 13 Pro in the library study area on the 3rd floor. Has a clear case with university stickers.",
    location: "Main Library - 3rd Floor",
    dateReported: "2024-01-15",
    status: "lost",
    contactEmail: "john.doe@university.edu",
    contactPhone: "+91 98765 43210",
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
    contactPhone: "+91 87654 32109"
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
    contactPhone: "+91 76543 21098"
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
    contactPhone: "+91 65432 10987"
  },
  {
    id: 5,
    title: "MacBook Air 13-inch",
    category: "Electronics",
    description: "Silver MacBook Air with various programming stickers. Found in engineering building computer lab.",
    location: "Engineering Building - Room 105",
    dateReported: "2024-01-11",
    status: "found",
    contactEmail: "security@university.edu",
    contactPhone: "+91 54321 09876"
  },
  {
    id: 6,
    title: "Blue Denim Jacket",
    category: "Clothing",
    description: "Light blue denim jacket, size Medium. Left in dining hall after lunch.",
    location: "Dining Hall",
    dateReported: "2024-01-10",
    status: "lost",
    contactEmail: "jane.adams@university.edu",
    contactPhone: "+91 43210 98765"
  },
  {
    id: 7,
    title: "Chemistry Textbook",
    category: "Books",
    description: "Organic Chemistry 8th Edition by McMurry. Has highlighting and notes.",
    location: "Science Building - Room 150",
    dateReported: "2024-01-09",
    status: "found",
    contactEmail: "chem.dept@university.edu",
    contactPhone: "+91 32109 87654"
  },
  {
    id: 8,
    title: "Wireless Earbuds - AirPods",
    category: "Electronics",
    description: "Apple AirPods Pro in white charging case. Lost during morning jog.",
    location: "Campus Grounds - Running Track",
    dateReported: "2024-01-08",
    status: "lost",
    contactEmail: "runner@university.edu",
    contactPhone: "(555) 777-8888"
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

const locations = [
  "All Locations",
  "Main Library",
  "Student Union Building",
  "Recreation Center",
  "Science Building",
  "Engineering Building",
  "Dining Hall",
  "Campus Grounds",
  "Other"
];

export default function BrowseItems() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedStatus, setSelectedStatus] = useState('All Items');
  const [sortBy, setSortBy] = useState('newest');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All Locations' || 
                           item.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesStatus = selectedStatus === 'All Items' || 
                         (selectedStatus === 'Lost Items' && item.status === 'lost') ||
                         (selectedStatus === 'Found Items' && item.status === 'found');
    
    return matchesSearch && matchesCategory && matchesLocation && matchesStatus;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.dateReported).getTime() - new Date(b.dateReported).getTime();
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'newest':
      default:
        return new Date(b.dateReported).getTime() - new Date(a.dateReported).getTime();
    }
  });

  // Extract search suggestions from existing data
  const searchSuggestions = React.useMemo(() => {
    const suggestions = new Set<string>();

    allItems.forEach(item => {
      suggestions.add(item.title);
      suggestions.add(item.category);

      // Add meaningful words from descriptions
      const words = item.description.split(/\s+/)
        .filter(word => word.length > 3)
        .map(word => word.replace(/[^a-zA-Z0-9]/g, ''))
        .filter(word => word.length > 3);

      words.forEach(word => suggestions.add(word));

      // Add location parts
      const locationParts = item.location.split(/[-,\s]+/)
        .filter(part => part.length > 2);

      locationParts.forEach(part => suggestions.add(part.trim()));
    });

    return Array.from(suggestions)
      .filter(suggestion => suggestion.length > 2)
      .sort((a, b) => a.localeCompare(b));
  }, []);

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
              <Link to="/browse" className="text-foreground font-medium">
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
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <AutocompleteSearch
                value={searchQuery}
                onChange={setSearchQuery}
                suggestions={searchSuggestions}
                placeholder="Search for items..."
                className="max-w-none"
                onSearch={() => {
                  console.log('Browse search performed:', searchQuery);
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 h-12">
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
                <SelectTrigger className="w-40 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Items">All Items</SelectItem>
                  <SelectItem value="Lost Items">Lost Items</SelectItem>
                  <SelectItem value="Found Items">Found Items</SelectItem>
                </SelectContent>
              </Select>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="h-12 flex items-center space-x-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Filters</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Advanced Filters</SheetTitle>
                  </SheetHeader>
                  <div className="py-6 space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-3 block">Location</label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-3 block">Sort By</label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="oldest">Oldest First</SelectItem>
                          <SelectItem value="alphabetical">Alphabetical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {sortedItems.length} item{sortedItems.length !== 1 ? 's' : ''} found
            </span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="alphabetical">A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Items Grid */}
        {sortedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedItems.map((item) => (
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
                        Contact via Email
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
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              No items found matching your search criteria.
            </div>
            <div className="space-x-4">
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Categories');
                setSelectedLocation('All Locations');
                setSelectedStatus('All Items');
              }}>
                Clear Filters
              </Button>
              <Button asChild>
                <Link to="/post">Report an Item</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
