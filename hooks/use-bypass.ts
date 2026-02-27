import { useState, useEffect, useCallback } from "react";
import { bypassRequestSchema, type BypassResponse } from "@/lib/schema";

interface UseBypassOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useBypass(options?: UseBypassOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csrfToken, setCSRFToken] = useState<string | null>(null);

  // Fetch CSRF token on mount
  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await fetch("/api/bypass", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch CSRF token");
        }

        const data = await response.json();
        setCSRFToken(data.csrfToken);
      } catch (err) {
        console.error("CSRF token fetch failed:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch CSRF token"
        );
      }
    };

    fetchCSRFToken();
  }, []);

  const submit = useCallback(
    async (cookie: string): Promise<BypassResponse | null> => {
      if (!csrfToken) {
        const errorMsg = "CSRF token not available";
        setError(errorMsg);
        options?.onError?.(errorMsg);
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        // Validate input
        const validated = bypassRequestSchema.parse({ cookie });

        const response = await fetch("/api/bypass", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken,
          },
          body: JSON.stringify(validated),
        });

        const result: BypassResponse = await response.json();

        if (!response.ok) {
          const errorMsg = result.message || result.error || "Bypass failed";
          setError(errorMsg);
          options?.onError?.(errorMsg);
          return null;
        }

        options?.onSuccess?.(result.data);
        return result;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMsg);
        options?.onError?.(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [csrfToken, options]
  );

  return { submit, loading, error, csrfToken };
}
