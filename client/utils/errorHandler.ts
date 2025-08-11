// Production-ready error handling utility

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const handleFirebaseError = (error: any): string => {
  console.error("Firebase Error:", error);

  if (error?.code) {
    switch (error.code) {
      case "permission-denied":
        return "You don't have permission to perform this action. Please sign in.";
      case "unavailable":
        return "Service temporarily unavailable. Please try again later.";
      case "invalid-argument":
        return "Invalid data provided. Please check your input.";
      case "not-found":
        return "The requested item was not found.";
      case "already-exists":
        return "This item already exists.";
      case "resource-exhausted":
        return "Too many requests. Please try again later.";
      case "unauthenticated":
        return "Please sign in to continue.";
      default:
        return `Firebase error: ${error.message}`;
    }
  }

  if (error?.message?.includes("network")) {
    return "Network error. Please check your internet connection.";
  }

  return "An unexpected error occurred. Please try again.";
};

export const handleClerkError = (error: any): string => {
  console.error("Clerk Error:", error);

  if (error?.errors?.[0]?.message) {
    return error.errors[0].message;
  }

  return "Authentication error. Please try again.";
};

export const logError = (
  context: string,
  error: any,
  additionalData?: Record<string, any>,
) => {
  const errorInfo = {
    context,
    message: error?.message || "Unknown error",
    stack: error?.stack,
    timestamp: new Date().toISOString(),
    ...additionalData,
  };

  console.error("Application Error:", errorInfo);

  // In production, you would send this to a logging service like Sentry
  // Example: Sentry.captureException(error, { extra: errorInfo });
};
