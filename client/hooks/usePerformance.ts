import { useEffect } from "react";
import { ENV } from "@/utils/constants";

// Performance monitoring for production optimization
export const usePerformance = () => {
  useEffect(() => {
    if (ENV.isProduction && "performance" in window) {
      // Monitor Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === "measure") {
            console.log(`${entry.name}: ${entry.duration}ms`);
          }
        });
      });

      observer.observe({ entryTypes: ["measure", "navigation"] });

      return () => observer.disconnect();
    }
  }, []);

  const measurePerformance = (name: string, fn: () => void) => {
    if (ENV.isDevelopment) {
      performance.mark(`${name}-start`);
      fn();
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    } else {
      fn();
    }
  };

  return { measurePerformance };
};
