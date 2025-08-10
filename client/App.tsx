import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PostItem from "./pages/PostItem";
import BrowseItems from "./pages/BrowseItems";
import PlaceholderPage from "./pages/PlaceholderPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      <ThemeProvider defaultTheme="system" storageKey="findit-ui-theme">
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/post" element={
            <ProtectedRoute>
              <PostItem />
            </ProtectedRoute>
          } />
          <Route path="/browse" element={<BrowseItems />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/admin" element={
            <PlaceholderPage
              title="Admin Portal"
              description="Administrative tools for moderating posts and managing the Lost & Found system."
            />
          } />
          <Route path="/my-items" element={
            <PlaceholderPage
              title="My Items"
              description="Track your reported items and their status."
            />
          } />
          <Route path="/help" element={
            <PlaceholderPage
              title="Help & Support"
              description="Get help using the Lost & Found portal and contact support."
            />
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
      </ThemeProvider>
    </ClerkProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
