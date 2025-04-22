// "use client";

// import { useState } from "react";
// import Slideshow from "./components/Slideshow";

// export default function Home() {
//   const [imageUrls, setImageUrls] = useState<string[]>([]);
//   const [inputUrl, setInputUrl] = useState("");

//   const addImage = () => {
//     if (inputUrl && !imageUrls.includes(inputUrl)) {
//       setImageUrls([...imageUrls, inputUrl]);
//       setInputUrl("");
//     }
//   };

//   // Sample images for testing
//   const useTestImages = () => {
//     const testImages = [
//       // 'https://media.giphy.com/media/3oKIPtjElfqwMOTbH2/giphy.gif',
//       // 'https://media.giphy.com/media/l0MYJnJQ4EiYLxvQ4/giphy.gif',
//       // 'https://media.giphy.com/media/xUPGcguWZHRC2HyBRS/giphy.gif',
//       // 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif',
//       // 'https://media.giphy.com/media/l0HlGRDhPTqVEvhCw/giphy.gif'
//       "https://s3.eu-central-1.amazonaws.com/qualhub.org/Get+Licensed+-+Level+2+Award+For+Door+Supervisors+V5.0+Mar+25.gif",
//       "https://media.giphy.com/media/xUPGcguWZHRC2HyBRS/giphy.gif",
//       "https://s3.eu-central-1.amazonaws.com/qualhub.org/Get+Licensed+-+Level+2+Award+For+Door+Supervisors+V5.0+Mar+25.gif",
//     ];
//     setImageUrls(testImages);
//   };

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-4">
//       <div className="w-full max-w-5xl bg-white rounded-lg shadow p-6">
//         <h1 className="text-2xl font-bold mb-6">
//           Image Slideshow with Caching
//         </h1>

//         <div className="mb-6">
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={inputUrl}
//               onChange={(e) => setInputUrl(e.target.value)}
//               placeholder="Enter image URL"
//               className="flex-grow p-2 border rounded"
//             />
//             <button
//               onClick={addImage}
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               Add Image
//             </button>
//             <button
//               onClick={useTestImages}
//               className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//             >
//               Use Test Images
//             </button>
//           </div>
//         </div>

//         {imageUrls.length > 0 ? (
//           <div className="h-96">
//             <Slideshow images={imageUrls} />
//           </div>
//         ) : (
//           <div className="text-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
//             <p>Add image URLs to start the slideshow</p>
//           </div>
//         )}

//         {imageUrls.length > 0 && (
//           <div className="mt-6">
//             <h2 className="text-lg font-semibold mb-2">Image List</h2>
//             <ul className="space-y-2">
//               {imageUrls.map((url, index) => (
//                 <li key={index} className="flex items-center justify-between">
//                   <span className="truncate max-w-md">{url}</span>
//                   <button
//                     onClick={() =>
//                       setImageUrls(imageUrls.filter((_, i) => i !== index))
//                     }
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     Remove
//                   </button>
//                 </li>
//               ))}
//             </ul>
//             <button
//               onClick={() => setImageUrls([])}
//               className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//             >
//               Clear All
//             </button>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { ImageCache } from "./lib/imageCache";
import Slideshow from "./components/Slideshow";

export default function Home() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [inputUrl, setInputUrl] = useState("");
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [cacheStats, setCacheStats] = useState<{
    memoryItems: number;
    fetchTimes: { [url: string]: string };
  }>({
    memoryItems: 0,
    fetchTimes: {},
  });

  const addImage = () => {
    if (inputUrl && !imageUrls.includes(inputUrl)) {
      setImageUrls([...imageUrls, inputUrl]);
      setInputUrl("");
    }
  };

  // Sample images for testing
  const useTestImages = () => {
    const testImages = [
      // 'https://media.giphy.com/media/3oKIPtjElfqwMOTbH2/giphy.gif',
      // 'https://media.giphy.com/media/l0MYJnJQ4EiYLxvQ4/giphy.gif',
      // 'https://media.giphy.com/media/xUPGcguWZHRC2HyBRS/giphy.gif',
      // 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif',
      // 'https://media.giphy.com/media/l0HlGRDhPTqVEvhCw/giphy.gif'
      "https://s3.eu-central-1.amazonaws.com/qualhub.org/Get+Licensed+-+Level+2+Award+For+Door+Supervisors+V5.0+Mar+25.gif",
      "https://airforshare.com/files/lEEOXk.gif",
      "https://www.airforshare.com/files/mFkwLd.jpg",
      "https://www.airforshare.com/files/mZcHPw.jpg",
    ];
    setImageUrls(testImages);
  };

  // Refresh all images in the slideshow
  const refreshAllImages = async () => {
    setImagesLoaded(false);
    const imageCache = ImageCache.getInstance();

    // Force refresh all images
    const refreshPromises = imageUrls.map((url) =>
      imageCache.forceRefresh(url)
    );
    await Promise.all(refreshPromises);

    // This will trigger a slideshow reload
    setImageUrls([...imageUrls]);
    updateCacheStats();
  };

  // Clean old cached images
  const cleanCache = async () => {
    const imageCache = ImageCache.getInstance();
    await imageCache.cleanupCache();
    updateCacheStats();
  };

  const handleImagesLoaded = () => {
    setImagesLoaded(true);
    updateCacheStats();
  };

  const updateCacheStats = () => {
    const stats = ImageCache.getInstance().getCacheStats();
    setCacheStats(stats);
  };

  useEffect(() => {
    // Update cache stats periodically
    const interval = setInterval(() => {
      updateCacheStats();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">
          Image Slideshow with Intelligent Caching
        </h1>

        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter image URL"
              className="flex-grow p-2 border rounded"
            />
            <button
              onClick={addImage}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Image
            </button>
            <button
              onClick={useTestImages}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Use Test Images
            </button>
          </div>
        </div>

        {imageUrls.length > 0 ? (
          <div className="h-96">
            <Slideshow images={imageUrls} onImagesLoaded={handleImagesLoaded} />
          </div>
        ) : (
          <div className="text-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
            <p>Add image URLs to start the slideshow</p>
          </div>
        )}

        {imageUrls.length > 0 && (
          <div className="mt-6">
            <div className="flex gap-4 mb-4">
              <button
                onClick={refreshAllImages}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={!imagesLoaded}
              >
                Refresh All Images
              </button>

              <button
                onClick={cleanCache}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Clean Old Cache
              </button>
            </div>

            <h2 className="text-lg font-semibold mb-2">Image List</h2>
            <ul className="space-y-2">
              {imageUrls.map((url, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="truncate max-w-md">{url}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {cacheStats.fetchTimes[url]
                        ? `Fetched: ${cacheStats.fetchTimes[url]}`
                        : "Not cached"}
                    </span>
                    <button
                      onClick={() =>
                        setImageUrls(imageUrls.filter((_, i) => i !== index))
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setImageUrls([])}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Cache Stats */}
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold">Cache Status</h3>
          <p>Images in memory cache: {cacheStats.memoryItems}</p>
          <p className="text-xs mt-2">
            Images are cached in memory and IndexedDB. They will be loaded from
            cache when possible. Use the "Refresh" button to manually fetch
            fresh images from the server.
          </p>
        </div>
      </div>
    </main>
  );
}
