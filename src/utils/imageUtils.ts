/**
 * Converts an image URL to base64 string
 * @param imageUrl - The URL of the image to convert
 * @returns Promise<string> - Base64 encoded image string
 */
export async function imageUrlToBase64(imageUrl: string): Promise<string> {
  try {
    // Check if it's already a base64 string
    if (imageUrl.startsWith('data:image/')) {
      return imageUrl;
    }

    // Check if it's a blob URL
    if (imageUrl.startsWith('blob:')) {
      return imageUrl;
    }

    // Fetch the image with CORS handling
    const response = await fetch(imageUrl, {
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Accept': 'image/*',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    // Get the image as blob
    const blob = await response.blob();
    
    // Convert blob to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = () => {
        reject(new Error('Failed to convert image to base64'));
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image URL to base64:', error);
    throw error;
  }
}

/**
 * Converts multiple image URLs to base64 strings
 * @param imageUrls - Array of image URLs to convert
 * @returns Promise<string[]> - Array of base64 encoded image strings
 */
export async function imageUrlsToBase64(imageUrls: string[]): Promise<string[]> {
  try {
    const base64Promises = imageUrls.map(url => imageUrlToBase64(url));
    return await Promise.all(base64Promises);
  } catch (error) {
    console.error('Error converting image URLs to base64:', error);
    throw error;
  }
}

/**
 * Checks if a string is a valid image URL
 * @param url - The URL to check
 * @returns boolean - True if it's a valid image URL
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const pathname = urlObj.pathname.toLowerCase();
    return imageExtensions.some(ext => pathname.endsWith(ext));
  } catch {
    return false;
  }
}

/**
 * Converts image URL to base64 with error handling and fallback
 * @param imageUrl - The URL of the image to convert
 * @param fallbackUrl - Optional fallback URL if conversion fails
 * @returns Promise<string> - Base64 string or fallback URL
 */
export async function safeImageUrlToBase64(
  imageUrl: string, 
  fallbackUrl?: string
): Promise<string> {
  try {
    // If it's already a base64 or blob URL, return as is
    if (imageUrl.startsWith('data:image/') || imageUrl.startsWith('blob:')) {
      return imageUrl;
    }

    // Try to convert to base64
    return await imageUrlToBase64(imageUrl);
  } catch (error) {
    console.warn('Failed to convert image URL to base64, using fallback:', error);
    
    // If the error is CORS-related, log it specifically
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      console.warn('CORS error detected - using original URL as fallback');
    }
    
    return fallbackUrl || imageUrl;
  }
}

/**
 * Creates a simple image preview URL that works around CORS issues
 * @param imageUrl - The original image URL
 * @returns string - A URL that can be used for preview
 */
export function createImagePreviewUrl(imageUrl: string): string {
  // If it's already a data URL or blob URL, return as is
  if (imageUrl.startsWith('data:image/') || imageUrl.startsWith('blob:')) {
    return imageUrl;
  }

  // For Maya AI URLs, convert to base64 for better compatibility
  try {
    const url = new URL(imageUrl);
    
    // If it's a localhost URL, return as is
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      return imageUrl;
    }
    
    // For Maya AI URLs, use our proxy to handle CORS issues
    if (url.hostname === 'my.mayaai.online') {
      return `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
    }
    
    // For other external URLs, return as is
    return imageUrl;
  } catch {
    return imageUrl;
  }
}

/**
 * Creates a proxy URL for Maya AI images to handle CORS issues
 * @param imageUrl - The Maya AI image URL
 * @returns string - A proxy URL or the original URL
 */
export function createMayaImageProxyUrl(imageUrl: string): string {
  try {
    const url = new URL(imageUrl);
    
    // If it's a Maya AI URL, use our proxy
    if (url.hostname === 'my.mayaai.online') {
      return `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
    }
    
    return imageUrl;
  } catch {
    return imageUrl;
  }
}
