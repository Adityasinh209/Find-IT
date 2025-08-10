import { FirebaseService } from '../services/firebaseService';

// Sample data to populate Firebase database
const sampleItems = [
  {
    title: "iPhone 13 Pro - Blue",
    category: "Electronics",
    description: "Lost my blue iPhone 13 Pro in the library study area on the 3rd floor. Has a clear case with university stickers.",
    location: "Main Library - 3rd Floor",
    dateReported: "2024-01-15",
    status: "lost" as const,
    contactEmail: "john.doe@university.edu",
    contactPhone: "+91 98765 43210",
    contactName: "John Doe"
  },
  {
    title: "Black North Face Backpack",
    category: "Bags",
    description: "Black North Face backpack with laptop compartment. Contains textbooks and a water bottle.",
    location: "Student Union Building",
    dateReported: "2024-01-14",
    status: "lost" as const,
    contactEmail: "sarah.smith@university.edu",
    contactPhone: "+91 87654 32109",
    contactName: "Sarah Smith"
  },
  {
    title: "Silver Car Keys - Honda",
    category: "Keys",
    description: "Honda car keys with blue keychain that says 'Class of 2024'. Lost somewhere near the gym.",
    location: "Recreation Center",
    dateReported: "2024-01-13",
    status: "lost" as const,
    contactEmail: "mike.wilson@university.edu",
    contactPhone: "+91 76543 21098",
    contactName: "Mike Wilson"
  },
  {
    title: "Red Water Bottle - Hydro Flask",
    category: "Personal Items",
    description: "Red Hydro Flask water bottle with university logo sticker. Left in chemistry lab.",
    location: "Science Building - Lab 201",
    dateReported: "2024-01-12",
    status: "found" as const,
    contactEmail: "lab.assistant@university.edu",
    contactPhone: "+91 65432 10987",
    contactName: "Lab Assistant"
  },
  {
    title: "MacBook Air 13-inch",
    category: "Electronics",
    description: "Silver MacBook Air with various programming stickers. Found in engineering building computer lab.",
    location: "Engineering Building - Room 105",
    dateReported: "2024-01-11",
    status: "found" as const,
    contactEmail: "security@university.edu",
    contactPhone: "+91 54321 09876",
    contactName: "Security Team"
  }
];

export async function migrateData() {
  console.log('Starting data migration to Firebase...');
  
  try {
    for (const item of sampleItems) {
      const itemId = await FirebaseService.createItem(item);
      console.log(`Created item: ${item.title} with ID: ${itemId}`);
    }
    
    console.log('Data migration completed successfully!');
  } catch (error) {
    console.error('Error during data migration:', error);
  }
}

// Uncomment the line below to run the migration when this file is executed
// migrateData();
