import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LostFoundItem } from "@/types/database";
import { handleFirebaseError, logError } from "@/utils/errorHandler";
import { APP_CONFIG } from "@/utils/constants";

export class FirebaseService {
  // Helper function to remove undefined values
  private static removeUndefinedValues(obj: any): any {
    const cleaned: any = {};
    Object.keys(obj).forEach((key) => {
      if (obj[key] !== undefined) {
        cleaned[key] = obj[key];
      }
    });
    return cleaned;
  }

  // Create a new item
  static async createItem(
    itemData: Omit<LostFoundItem, "id" | "createdAt" | "updatedAt">,
  ): Promise<string> {
    try {
      const now = new Date();

      // Remove any undefined values to prevent Firebase errors
      const cleanedData = this.removeUndefinedValues(itemData);

      const docRef = await addDoc(collection(db, APP_CONFIG.collectionName), {
        ...cleanedData,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
      });
      console.log("Item created with ID: ", docRef.id);
      return docRef.id;
    } catch (error) {
      logError("FirebaseService.createItem", error, { itemData });
      throw new Error(handleFirebaseError(error));
    }
  }

  // Get all items
  static async getAllItems(): Promise<LostFoundItem[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy("createdAt", "desc"),
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as LostFoundItem[];
    } catch (error) {
      console.error("Error fetching items: ", error);
      throw error;
    }
  }

  // Get items with real-time updates
  static subscribeToItems(
    callback: (items: LostFoundItem[]) => void,
  ): () => void {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as LostFoundItem[];

        callback(items);
      },
      (error) => {
        console.error("Error in real-time subscription: ", error);
      },
    );

    return unsubscribe;
  }

  // Get recent items (limit 6 for homepage)
  static async getRecentItems(
    limitCount: number = 6,
  ): Promise<LostFoundItem[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy("createdAt", "desc"),
        limit(limitCount),
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as LostFoundItem[];
    } catch (error) {
      console.error("Error fetching recent items: ", error);
      throw error;
    }
  }

  // Get items by status
  static async getItemsByStatus(
    status: "lost" | "found",
  ): Promise<LostFoundItem[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("status", "==", status),
        orderBy("createdAt", "desc"),
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as LostFoundItem[];
    } catch (error) {
      console.error("Error fetching items by status: ", error);
      throw error;
    }
  }

  // Get items by category
  static async getItemsByCategory(category: string): Promise<LostFoundItem[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("category", "==", category),
        orderBy("createdAt", "desc"),
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as LostFoundItem[];
    } catch (error) {
      console.error("Error fetching items by category: ", error);
      throw error;
    }
  }

  // Update an item
  static async updateItem(
    itemId: string,
    updates: Partial<LostFoundItem>,
  ): Promise<void> {
    try {
      const itemRef = doc(db, COLLECTION_NAME, itemId);

      // Remove any undefined values to prevent Firebase errors
      const cleanedUpdates = this.removeUndefinedValues(updates);

      await updateDoc(itemRef, {
        ...cleanedUpdates,
        updatedAt: Timestamp.fromDate(new Date()),
      });
      console.log("Item updated successfully");
    } catch (error) {
      console.error("Error updating item: ", error);
      throw error;
    }
  }

  // Delete an item
  static async deleteItem(itemId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, itemId));
      console.log("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item: ", error);
      throw error;
    }
  }

  // Search items by text
  static async searchItems(searchText: string): Promise<LostFoundItem[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a basic implementation - for production, consider using Algolia or similar
      const allItems = await this.getAllItems();

      const searchLower = searchText.toLowerCase();
      return allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.location.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower),
      );
    } catch (error) {
      console.error("Error searching items: ", error);
      throw error;
    }
  }

  // Get statistics
  static async getStats(): Promise<{
    totalItems: number;
    lostItems: number;
    foundItems: number;
  }> {
    try {
      const allItems = await this.getAllItems();
      const totalItems = allItems.length;
      const lostItems = allItems.filter(
        (item) => item.status === "lost",
      ).length;
      const foundItems = allItems.filter(
        (item) => item.status === "found",
      ).length;

      return { totalItems, lostItems, foundItems };
    } catch (error) {
      console.error("Error fetching stats: ", error);
      throw error;
    }
  }
}
