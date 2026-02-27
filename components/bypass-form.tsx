"use client";

import { useState } from "react";
import { useBypass } from "@/hooks/use-bypass";

export function BypassForm() {
  const [cookie, setCookie] = useState("");
  const [result, setResult] = useState<any>(null);
  const { submit, loading, error, csrfToken } = useBypass({
    onSuccess: (data) => {
      setResult(data);
      setCookie("");
    },
    onError: (err) => {
      console.error("Bypass error:", err);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cookie.trim()) {
      alert("Please enter a cookie");
      return;
    }
    await submit(cookie);
  };

  if (!csrfToken) {
    return <div>Loading security token...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Roblox Cookie Bypass</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="cookie"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            .ROBLOSECURITY Cookie
          </label>
          <textarea
            id="cookie"
            value={cookie}
            onChange={(e) => setCookie(e.target.value)}
            placeholder="Paste your .ROBLOSECURITY cookie here..."
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !cookie.trim()}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
          <strong>Success!</strong>
          <pre className="mt-2 text-xs bg-white p-2 rounded border border-green-300 overflow-auto max-h-40">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
