import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Wifi } from "lucide-react";

interface AuthFallbackProps {
  error?: Error;
  onRetry?: () => void;
}

export function AuthFallback({ error, onRetry }: AuthFallbackProps) {
  const isNetworkError = error?.message?.includes("fetch") || 
                        error?.message?.includes("network") ||
                        error?.message?.includes("Failed to fetch");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
            {isNetworkError ? (
              <Wifi className="w-6 h-6 text-orange-600" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            )}
          </div>
          <CardTitle className="text-xl">
            {isNetworkError ? "Connection Issue" : "Authentication Error"}
          </CardTitle>
          <CardDescription>
            {isNetworkError 
              ? "Unable to connect to authentication service. This might be a temporary network issue."
              : "There was a problem with authentication. Please try again."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md font-mono">
              {error.message}
            </div>
          )}
          <div className="flex gap-2">
            <Button 
              onClick={() => window.location.reload()} 
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload Page
            </Button>
            {onRetry && (
              <Button variant="outline" onClick={onRetry} className="flex-1">
                Try Again
              </Button>
            )}
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              If this problem persists, please check your internet connection.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
