import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  Tag,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { FirebaseService } from "@/services/firebaseService";
import { LostFoundItem } from "@/types/database";
import { CATEGORIES } from "@/utils/constants";
import { isFirebaseEnabled } from "@/lib/firebase";
import { toast } from "sonner";

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
  "Other",
];

const PostItem = React.memo(function PostItem() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    itemType: "lost", // 'lost' or 'found'
    title: "",
    category: "",
    description: "",
    location: "",
    customLocation: "",
    date: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill contact information from Clerk user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        contactName:
          user.fullName ||
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          "",
        contactEmail: user.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [user]);

  const handleInputChange = useCallback((field: string, value: string) => {
    // Basic input sanitization
    const sanitizedValue = value.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      "",
    );

    // Prevent extremely long inputs (DoS protection)
    const maxLengths: Record<string, number> = {
      title: 200,
      description: 2000,
      location: 300,
      contactName: 100,
      contactEmail: 100,
      contactPhone: 20,
    };

    const maxLength = maxLengths[field] || 500;
    const truncatedValue = sanitizedValue.slice(0, maxLength);

    setFormData((prev) => ({ ...prev, [field]: truncatedValue }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check if Firebase is configured
    if (!isFirebaseEnabled) {
      // In demo mode, simulate successful submission
      toast.success("Demo: Item submitted successfully! (Note: This is demo data and won't persist)");

      // Wait a moment for user to see the success message, then redirect
      setTimeout(() => {
        navigate("/", {
          replace: true,
        });
      }, 2000);

      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare data for Firebase (filter out undefined values)
      const itemData: Omit<LostFoundItem, "id" | "createdAt" | "updatedAt"> = {
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        location: formData.location.trim(),
        dateReported: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
        status: formData.itemType as "lost" | "found",
        contactEmail: formData.contactEmail.trim(),
        contactName: formData.contactName.trim(),
      };

      // Only add optional fields if they have values
      const phoneNumber = formData.contactPhone.trim();
      if (phoneNumber) {
        itemData.contactPhone = phoneNumber;
      }

      if (user?.id) {
        itemData.userId = user.id;
      }

      // Save to Firebase
      const itemId = await FirebaseService.createItem(itemData);
      console.log("Item successfully created with ID:", itemId);

      // Show success message
      toast.success(
        `${formData.itemType === "lost" ? "Lost" : "Found"} item reported successfully! Redirecting...`,
      );

      // Wait a moment for user to see the success message, then redirect
      setTimeout(() => {
        navigate("/", {
          replace: true, // Use replace to prevent back button issues
        });
      }, 1500);
    } catch (error: any) {
      console.error("Failed to submit form:", error);

      // More specific error messages
      let errorMessage = "Failed to submit item. Please try again.";
      if (error?.message?.includes("permission")) {
        errorMessage = "Permission denied. Please check your authentication.";
      } else if (error?.message?.includes("network")) {
        errorMessage = "Network error. Please check your connection.";
      } else if (error?.message?.includes("quota")) {
        errorMessage =
          "Service temporarily unavailable. Please try again later.";
      }

      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  // More robust form validation with trimmed values and proper email validation
  const isFormValid =
    formData.title.trim() &&
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
            <Link to="/" className="text-2xl font-bold text-primary">
              FindIt
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <nav className="hidden md:flex items-center space-x-6 text-sm">
              <Link
                to="/browse"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Browse Items
              </Link>
              <Link to="/post" className="text-foreground font-medium">
                Report Lost Item
              </Link>
              <Link
                to="/help"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8",
                    },
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
            <CardTitle className="text-3xl font-bold mb-2">
              Report Lost Item
            </CardTitle>
            <CardDescription className="text-lg">
              Help us help you find your lost item! Provide as much detail as
              possible to increase the chances of recovery.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              aria-label="Report lost item"
            >
              {/* Item Type - Only Lost Items */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Report Lost Item
                </Label>
                <div className="flex items-center space-x-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground font-medium">
                    I lost something
                  </span>
                </div>
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
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.filter((cat) => cat !== "All Categories").map(
                      (category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ),
                    )}
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
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="min-h-[120px]"
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="flex items-center space-x-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>
                    Location{" "}
                    {formData.itemType === "lost" ? "Last Seen" : "Found"} *
                  </span>
                </Label>
                <Input
                  id="location"
                  placeholder="Enter the specific location (e.g., Main Library - 3rd Floor, Student Union Building - Room 205)"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="h-12"
                  required
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Date {formData.itemType === "lost" ? "Lost" : "Found"} *
                  </span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  max={new Date().toISOString().split("T")[0]} // Prevent future dates
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="h-12"
                  required
                  aria-describedby="date-help"
                />
                <p
                  id="date-help"
                  className="text-xs text-muted-foreground mt-1"
                >
                  Select the date when the item was{" "}
                  {formData.itemType === "lost" ? "lost" : "found"}
                </p>
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
                    onChange={(e) =>
                      handleInputChange("contactName", e.target.value)
                    }
                    className="h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="contactEmail"
                    className="flex items-center space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Address *</span>
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="your.email@university.edu"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      handleInputChange("contactEmail", e.target.value)
                    }
                    className="h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="contactPhone"
                    className="flex items-center space-x-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Phone Number (Optional)</span>
                  </Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="+91 98XXXXXXXX"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      handleInputChange("contactPhone", e.target.value)
                    }
                    className="h-12"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
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
                  {isSubmitting ? "Submitting..." : "Report Lost Item"}
                </Button>
                <div id="submit-status" aria-live="polite" className="sr-only">
                  {isSubmitting ? "Form is being submitted" : ""}
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
