import { useState, useEffect, useCallback } from 'react';
import ImageLoader from './ImageLoader';
import { ImageItem } from '../types';
import { ImageCache } from '../lib/imageCache';

interface SlideshowProps {
  images: string[];
  onImagesLoaded?: () => void;
}

export default function Slideshow({ images, onImagesLoaded }: SlideshowProps) {
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [slideshowRef, setSlideshowRef] = useState<HTMLDivElement | null>(null);
  const [forceRefresh, setForceRefresh] = useState(false);
  const [cacheStats, setCacheStats] = useState<{memoryItems: number}>({ memoryItems: 0 });

  // Initialize or update image items when images array changes
  useEffect(() => {
    // Keep existing image items that are still in the images array
    const existingItems = imageItems.filter(item => 
      images.includes(item.url)
    );
    
    // Create new items for new URLs
    const existingUrls = existingItems.map(item => item.url);
    const newItems = images
      .filter(url => !existingUrls.includes(url))
      .map((url, index) => ({
        id: `image-${existingItems.length + index}`,
        url,
        loaded: false
      }));

    const updatedItems = [...existingItems, ...newItems];
    setImageItems(updatedItems);
    
    // Reset current index if we have a completely new set
    if (newItems.length === images.length) {
      setCurrentIndex(0);
    }
    
    // Update cache stats
    updateCacheStats();
  }, [images]);

  // Handle image load
  const handleImageLoad = useCallback((loadedImage: ImageItem) => {
    setImageItems(prev => 
      prev.map(img => img.id === loadedImage.id ? loadedImage : img)
    );
    
    // Check if all images are loaded
    const allLoaded = imageItems.every(img => img.loaded);
    if (allLoaded && onImagesLoaded) {
      onImagesLoaded();
    }
    
    // Update cache stats after loading
    updateCacheStats();
  }, [imageItems, onImagesLoaded]);

  const updateCacheStats = () => {
    const stats = ImageCache.getInstance().getCacheStats();
    setCacheStats(stats);
  };

  // Auto-advance slideshow
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isPlaying && imageItems.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % imageItems.length);
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, imageItems.length]);

  // Preload next images
  useEffect(() => {
    const preloadCount = 2; // Preload next 2 images
    
    if (imageItems.length === 0) return;
    
    for (let i = 1; i <= preloadCount; i++) {
      const nextIndex = (currentIndex + i) % imageItems.length;
      // This triggers the preloading in background
      if (imageItems[nextIndex] && !imageItems[nextIndex].loaded) {
        const imageCache = ImageCache.getInstance();
        imageCache.getImage(imageItems[nextIndex].url).catch(err => {
          console.error("Error preloading image:", err);
        });
      }
    }
  }, [currentIndex, imageItems]);

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!slideshowRef) return;
    
    if (!isFullscreen) {
      if (slideshowRef.requestFullscreen) {
        slideshowRef.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + imageItems.length) % imageItems.length);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % imageItems.length);
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const refreshCurrentImage = () => {
    setForceRefresh(true);
    setTimeout(() => setForceRefresh(false), 100);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case ' ':
          togglePlay();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'r':
          refreshCurrentImage();
          break;
        case 'Escape':
          if (isFullscreen) {
            document.exitFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, imageItems.length]);

  if (imageItems.length === 0) {
    return <div>No images to display</div>;
  }

  return (
    <div 
      ref={ref => setSlideshowRef(ref)}
      className={`slideshow-container flex flex-col ${isFullscreen ? 'fixed inset-0 bg-black z-50' : 'relative'}`}
    >
      <div className="flex-grow flex items-center justify-center p-4 relative">
        {imageItems.length > 0 && imageItems[currentIndex] && (
          <ImageLoader 
            image={imageItems[currentIndex]} 
            onLoad={handleImageLoad}
            forceRefresh={forceRefresh}
          />
        )}
        
        {/* Side navigation arrows */}
        <button 
          onClick={goToPrevious}
          className="absolute left-4 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full transition-all"
        >
          ←
        </button>
        <button 
          onClick={goToNext}
          className="absolute right-4 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full transition-all"
        >
          →
        </button>
      </div>
      
      {/* Controls */}
      <div className={`controls flex justify-center items-center p-4 gap-4 ${isFullscreen ? 'bg-black text-white' : 'bg-gray-100'}`}>
        <button 
          onClick={goToPrevious}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Previous
        </button>
        
        <button 
          onClick={togglePlay}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        
        <button 
          onClick={goToNext}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Next
        </button>

        <button 
          onClick={refreshCurrentImage}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Refresh
        </button>
        
        <button 
          onClick={toggleFullscreen}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
        
        <div className="text-sm">
          {currentIndex + 1} / {imageItems.length}
        </div>
      </div>

      {/* Cache info display */}
      <div className={`text-xs p-2 ${isFullscreen ? 'bg-black text-white' : 'text-gray-500'}`}>
        <span>Images in cache: {cacheStats.memoryItems}</span>
        <span className="ml-4">Press 'R' to refresh current image</span>
      </div>
    </div>
  );
}