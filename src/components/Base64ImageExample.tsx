"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { imageUrlToBase64, safeImageUrlToBase64 } from "@/utils/imageUtils";

interface Base64ImageExampleProps {
  imageUrl: string;
}

export default function Base64ImageExample({
  imageUrl,
}: Base64ImageExampleProps) {
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertToBase64 = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const base64 = await safeImageUrlToBase64(imageUrl);
      setBase64Data(base64);
      console.log("Converted to base64:", base64.substring(0, 100) + "...");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert image");
      console.error("Conversion error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!base64Data) return;

    try {
      await navigator.clipboard.writeText(base64Data);
      alert("Base64 data copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      alert("Failed to copy to clipboard");
    }
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">Base64 Image Converter</h3>

      <div className="space-y-2">
        <p className="text-sm text-gray-600">Original URL:</p>
        <p className="text-xs break-all bg-gray-100 p-2 rounded">{imageUrl}</p>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={convertToBase64}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? "Converting..." : "Convert to Base64"}
        </Button>

        {base64Data && (
          <Button onClick={copyToClipboard} variant="outline">
            Copy Base64
          </Button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {base64Data && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Base64 Result:</p>
          <div className="max-h-40 overflow-y-auto">
            <img
              src={base64Data}
              alt="Converted image"
              className="max-w-full h-auto rounded border"
            />
          </div>
          <p className="text-xs text-gray-500">
            Length: {base64Data.length} characters
          </p>
        </div>
      )}
    </div>
  );
}
