import { useCallback } from "react";
import { ENV } from "@/utils/constants";

// Lightweight analytics tracking hook
export const useAnalytics = () => {
  const trackEvent = useCallback(
    (eventName: string, properties?: Record<string, any>) => {
      if (ENV.isDevelopment) {
        console.log("📊 Analytics:", { eventName, properties });
      }
      // In production, integrate with analytics service
      // gtag?.('event', eventName, properties);
    },
    [],
  );

  const trackItemSubmission = useCallback(
    (itemType: "lost" | "found", category: string) => {
      trackEvent("item_submitted", { item_type: itemType, category });
    },
    [trackEvent],
  );

  const trackSearch = useCallback((searchTerm: string) => {
    if (searchTerm.length > 2) { // Only track meaningful searches
      trackEvent("search_performed", { search_term: searchTerm });
    }
  }, [trackEvent]);

  return { trackEvent, trackItemSubmission, trackSearch };
};
