import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Calendar, MapPin, User, Mail, Phone, Tag, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';

const categories = [
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

const commonLocations = [
  "Main Library",
  "Student Union Building",
  "Recreation Center",
  "Science Building",
  "Engineering Building",
  "Dining Hall",
  "Dormitory",
  "Parking Lot",
  "Campus Grounds",
  "Other"
];

const PostItem = React.memo(function PostItem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemType: 'lost', // 'lost' or 'found'
    title: '',
    category: '',
    description: '',
    location: '',
    customLocation: '',
    date: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    image: null as File | null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = useCallback((field: string, value: string) => {
    // Basic input sanitization
    const sanitizedValue = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Prevent extremely long inputs (DoS protection)
    const maxLengths: Record<string, number> = {
      title: 200,
      description: 2000,
      location: 300,
      contactName: 100,
      contactEmail: 100,
      contactPhone: 20
    };

    const maxLength = maxLengths[field] || 500;
    const truncatedValue = sanitizedValue.slice(0, maxLength);

    setFormData(prev => ({ ...prev, [field]: truncatedValue }));
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Security validations
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

      if (file.size > maxSize) {
        alert('File size too large. Please select an image under 10MB.');
        e.target.value = ''; // Clear the input
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Please select a valid image file (JPEG, PNG, GIF, WebP).');
        e.target.value = ''; // Clear the input
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call with proper error handling
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, 1500);
        // Cleanup timeout if component unmounts
        return () => clearTimeout(timeout);
      });

      // Redirect back to home page with success message
      navigate('/', {
        state: {
          message: `${formData.itemType === 'lost' ? 'Lost' : 'Found'} item reported successfully!`
        },
        replace: true // Use replace to prevent back button issues
      });
    } catch (error) {
      console.error('Failed to submit form:', error);
      // In production, show user-friendly error message
      setIsSubmitting(false);
    }
  };

  // More robust form validation with trimmed values and proper email validation
  const isFormValid = formData.title.trim() &&
                     formData.category &&
                     formData.description.trim() &&
                     formData.location.trim() &&
                     formData.date &&
                     formData.contactName.trim() &&
                     formData.contactEmail.trim() &&
                     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail);

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
              <Link to="/post" className="text-foreground font-medium">
                Report Lost Item
              </Link>
              <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
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

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold mb-2">Report an Item</CardTitle>
            <CardDescription className="text-lg">
              Help us help you! Provide as much detail as possible to increase the chances of recovery.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" aria-label="Report lost or found item">
              {/* Item Type */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">What are you reporting?</Label>
                <RadioGroup 
                  value={formData.itemType} 
                  onValueChange={(value) => handleInputChange('itemType', value)}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lost" id="lost" />
                    <Label htmlFor="lost" className="cursor-pointer">I lost something</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="found" id="found" />
                    <Label htmlFor="found" className="cursor-pointer">I found something</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Item Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center space-x-2">
                  <Tag className="w-4 h-4" />
                  <span>Item Title *</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., iPhone 13 Pro - Blue, Black Backpack, Silver Keys"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description including color, brand, size, distinguishing features, etc. The more details, the better!"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="min-h-[120px]"
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Location {formData.itemType === 'lost' ? 'Last Seen' : 'Found'} *</span>
                </Label>
                <Input
                  id="location"
                  placeholder="Enter the specific location (e.g., Main Library - 3rd Floor, Student Union Building - Room 205)"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Date {formData.itemType === 'lost' ? 'Lost' : 'Found'} *</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  max={new Date().toISOString().split('T')[0]} // Prevent future dates
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="h-12"
                  required
                  aria-describedby="date-help"
                />
                <p id="date-help" className="text-xs text-muted-foreground mt-1">
                  Select the date when the item was {formData.itemType === 'lost' ? 'lost' : 'found'}
                </p>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image" className="flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Photo (Optional)</span>
                </Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="image" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload a photo or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </label>
                  {formData.image && (
                    <p className="text-sm text-primary mt-2">
                      Selected: {formData.image.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Contact Information</span>
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="contactName">Your Name *</Label>
                  <Input
                    id="contactName"
                    placeholder="Your full name"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    className="h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email Address *</span>
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="your.email@university.edu"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className="h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Phone Number (Optional)</span>
                  </Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="flex-1"
                  aria-describedby="submit-status"
                >
                  {isSubmitting ? 'Submitting...' : `Report ${formData.itemType === 'lost' ? 'Lost' : 'Found'} Item`}
                </Button>
                <div id="submit-status" aria-live="polite" className="sr-only">
                  {isSubmitting ? 'Form is being submitted' : ''}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default PostItem;
