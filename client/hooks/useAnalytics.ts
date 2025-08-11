import { useCallback } from "react";

// Custom hook for analytics tracking
export const useAnalytics = () => {
  const trackEvent = useCallback(
    (eventName: string, properties?: Record<string, any>) => {
      // In production, integrate with analytics service like Google Analytics, Mixpanel, etc.
      console.log("Analytics Event:", { eventName, properties });
      
      // Example: gtag('event', eventName, properties);
      // Example: mixpanel.track(eventName, properties);
    },
    [],
  );

  const trackPageView = useCallback((pageName: string) => {
    trackEvent("page_view", { page: pageName });
  }, [trackEvent]);

  const trackItemSubmission = useCallback(
    (itemType: "lost" | "found", category: string) => {
      trackEvent("item_submitted", { 
        item_type: itemType, 
        category,
        timestamp: new Date().toISOString()
      });
    },
    [trackEvent],
  );

  const trackSearch = useCallback((searchTerm: string) => {
    trackEvent("search_performed", { 
      search_term: searchTerm,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackItemSubmission,
    trackSearch,
  };
};
