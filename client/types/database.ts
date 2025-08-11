export interface LostFoundItem {
  id?: string;
  title: string;
  category: string;
  description: string;
  location: string;
  dateReported: string;
  status: "lost" | "found";
  contactEmail: string;
  contactPhone?: string;
  contactName: string;
  image?: string;
  userId?: string; // Link to user who posted
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export type ItemStatus = "lost" | "found";
export type ItemCategory =
  | "Electronics"
  | "Bags"
  | "Keys"
  | "Personal Items"
  | "Clothing"
  | "Books"
  | "Sports Equipment"
  | "Jewelry"
  | "Other";
