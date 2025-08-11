// Environment validation and configuration

export const ENV = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
} as const;

export const validateEnvironment = (): void => {
  const requiredClerkVars = [
    "VITE_CLERK_PUBLISHABLE_KEY"
  ];

  const requiredFirebaseVars = [
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN", 
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_STORAGE_BUCKET",
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    "VITE_FIREBASE_APP_ID"
  ];

  const missingVars: string[] = [];

  // Check Clerk variables
  requiredClerkVars.forEach(varName => {
    const value = import.meta.env[varName];
    if (!value || value.includes("your-") || value.includes("pk_test_your")) {
      missingVars.push(varName);
    }
  });

  // Check Firebase variables
  requiredFirebaseVars.forEach(varName => {
    const value = import.meta.env[varName];
    if (!value || value.includes("your-")) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0 && ENV.isProduction) {
    throw new Error(
      `Missing or invalid environment variables in production: ${missingVars.join(", ")}`
    );
  }

  if (missingVars.length > 0 && ENV.isDevelopment) {
    console.warn(
      `Missing or invalid environment variables: ${missingVars.join(", ")}`
    );
  }
};

export const getEnvironmentConfig = () => ({
  clerkKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  },
});
