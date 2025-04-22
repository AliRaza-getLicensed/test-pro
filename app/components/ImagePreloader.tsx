import { useEffect, useState } from 'react';
import { ImageCache } from '../lib/imageCache';

interface ImagePreloaderProps {
  urls: string[];
  onProgress: (progress: number) => void;
  onComplete: () => void;
}

export default function ImagePreloader({ urls, onProgress, onComplete }: ImagePreloaderProps) {
  const [loadedCount, setLoadedCount] = useState(0);
  
  useEffect(() => {
    if (!urls.length) return;
    
    let mounted = true;
    const imageCache = ImageCache.getInstance();
    
    // Start preloading all images concurrently
    const tasks = urls.map((url) => {
      return imageCache.getImage(url)
        .then(() => {
          if (mounted) {
            setLoadedCount(prev => {
              const newCount = prev + 1;
              onProgress(newCount / urls.length * 100);
              if (newCount === urls.length) {
                onComplete();
              }
              return newCount;
            });
          }
        })
        .catch(err => {
          console.error(`Error preloading image ${url}:`, err);
          // Still increment counter even on error
          if (mounted) {
            setLoadedCount(prev => {
              const newCount = prev + 1;
              onProgress(newCount / urls.length * 100);
              if (newCount === urls.length) {
                onComplete();
              }
              return newCount;
            });
          }
        });
    });

    return () => {
      mounted = false;
    };
  }, [urls, onProgress, onComplete]);

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="w-64 h-2 bg-gray-200 rounded-full my-4">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${(loadedCount / urls.length) * 100}%` }}
        ></div>
      </div>
      <div className="text-sm text-gray-500">
        Loading {loadedCount} of {urls.length} images...
      </div>
    </div>
  );
}
