import { useState, useEffect } from 'react';
import { ImageItem } from '../types';
import { ImageCache } from '../lib/imageCache';

interface ImageLoaderProps {
  image: ImageItem;
  onLoad: (image: ImageItem) => void;
  forceRefresh?: boolean;
}

export default function ImageLoader({ image, onLoad, forceRefresh = false }: ImageLoaderProps) {
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastLoadTime, setLastLoadTime] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      if (!image.url) return;
      
      setIsLoading(true);
      try {
        const imageCache = ImageCache.getInstance();
        
        // If force refresh is requested, bypass cache
        const cachedUrl = forceRefresh 
          ? await imageCache.forceRefresh(image.url) 
          : await imageCache.getImage(image.url);
        
        setLoadedUrl(cachedUrl);
        
        // Get last fetch time for this URL
        const fetchTime = imageCache.getLastFetchTime(image.url);
        if (fetchTime) {
          setLastLoadTime(new Date(fetchTime).toLocaleString());
        }
        
        onLoad({ ...image, cachedUrl, loaded: true });
      } catch (err) {
        console.error("Error loading image:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
    
    // Cleanup function
    return () => {
      if (loadedUrl && loadedUrl.startsWith('blob:')) {
        // Don't revoke URL since we're caching it
        // URL.revokeObjectURL(loadedUrl);
      }
    };
  }, [image.url, forceRefresh]);

  if (isLoading) {
    return <div className="w-full h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {loadedUrl ? (
        <>
          <img 
            src={loadedUrl} 
            alt="Slideshow image"
            className="max-h-full max-w-full object-contain"
          />
          {lastLoadTime && (
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs p-1 rounded">
              Last fetched: {lastLoadTime}
            </div>
          )}
        </>
      ) : (
        <div className="text-red-500">Failed to load image</div>
      )}
    </div>
  );
}
