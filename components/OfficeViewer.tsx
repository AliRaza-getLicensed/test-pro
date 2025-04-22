// "use client";

// import React, { useEffect, useRef, useState } from 'react';
// import { Loader2, FileIcon, RefreshCw } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface OfficeViewerProps {
//   fileUrl: string;
//   fileName: string;
// }

// declare global {
//   interface Window {
//     Office: any;
//     PowerPoint: any;
//   }
// }

// const OfficeViewer: React.FC<OfficeViewerProps> = ({ fileUrl, fileName }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [presentation, setPresentation] = useState<any>(null);
//   const [currentSlide, setCurrentSlide] = useState<number>(1);
//   const [totalSlides, setTotalSlides] = useState<number>(0);

//   useEffect(() => {
//     // Only run once when component mounts
//     const loadOfficeJS = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Load Office JS library
//         await loadScript('https://appsforoffice.microsoft.com/lib/1/hosted/office.js');

//         // Wait for Office to be ready
//         if (!window.Office) {
//           throw new Error('Failed to load Office JS API');
//         }

//         // Initialize Office
//         window.Office.onReady(() => {
//           initializePowerPoint();
//         });
//       } catch (err) {
//         console.error('Error loading Office JS:', err);
//         setError(`Failed to load Microsoft Office viewer: ${err instanceof Error ? err.message : 'Unknown error'}`);
//         setLoading(false);
//       }
//     };

//     const initializePowerPoint = async () => {
//       try {
//         // Get full URL for the file (needed for Office JS)
//         const fullFileUrl = new URL(fileUrl, window.location.origin).href;

//         // Create PowerPoint presentation
//         const pres = await window.PowerPoint.createPresentation(fullFileUrl);
//         setPresentation(pres);

//         // Get slide information
//         const slideInfo = await pres.getSlideCount();
//         setTotalSlides(slideInfo.totalSlides);
//         setCurrentSlide(1);

//         // Setup container and show presentation
//         if (containerRef.current) {
//           // Clear any existing content
//           containerRef.current.innerHTML = '';

//           // Add presentation container
//           const presContainer = document.createElement('div');
//           presContainer.id = 'powerpoint-container';
//           presContainer.style.width = '100%';
//           presContainer.style.height = '100%';
//           containerRef.current.appendChild(presContainer);

//           // Attach presentation to container
//           await pres.render('powerpoint-container');

//           // Add event listeners for slide changes
//           pres.on('slideChanged', (event: any) => {
//             setCurrentSlide(event.slideNumber);
//           });
//         }

//         setLoading(false);
//       } catch (err) {
//         console.error('Error initializing PowerPoint:', err);
//         setError(`Failed to load PowerPoint presentation: ${err instanceof Error ? err.message : 'Unknown error'}`);
//         setLoading(false);
//       }
//     };

//     loadOfficeJS();

//     // Cleanup function
//     return () => {
//       if (presentation) {
//         // Cleanup presentation resources
//         presentation.close();
//       }
//     };
//   }, [fileUrl]);

//   const loadScript = (src: string): Promise<void> => {
//     return new Promise((resolve, reject) => {
//       if (document.querySelector(`script[src="${src}"]`)) {
//         resolve();
//         return;
//       }

//       const script = document.createElement('script');
//       script.src = src;
//       script.onload = () => resolve();
//       script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
//       document.body.appendChild(script);
//     });
//   };

//   const goToNextSlide = async () => {
//     if (presentation && currentSlide < totalSlides) {
//       await presentation.goToSlide(currentSlide + 1);
//     }
//   };

//   const goToPreviousSlide = async () => {
//     if (presentation && currentSlide > 1) {
//       await presentation.goToSlide(currentSlide - 1);
//     }
//   };

//   // Render error state
//   if (error) {
//     return (
//       <div aria-live="assertive" className="error-message p-4 bg-red-50 text-red-600 rounded-md">
//         <div className="flex items-start">
//           <div className="flex-shrink-0">
//             <FileIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
//           </div>
//           <div className="ml-3">
//             <h3 className="text-sm font-medium text-red-800">PowerPoint Viewer Error</h3>
//             <div className="mt-2 text-sm text-red-700">
//               <p>{error}</p>
//             </div>
//             <div className="mt-4">
//               <Button
//                 onClick={() => window.location.reload()}
//                 variant="outline"
//                 size="sm"
//               >
//                 <RefreshCw className="h-4 w-4 mr-1" />
//                 Retry
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Render loading state
//   if (loading) {
//     return (
//       <div className="loading-message flex items-center justify-center h-[500px]">
//         <div className="flex flex-col items-center">
//           <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-2" />
//           <p>Loading PowerPoint presentation...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="office-pptx-viewer">
//       <div className="mb-4 flex items-center justify-between">
//         <div className="text-sm text-gray-700">
//           <span className="font-medium">{fileName}</span>
//           <span className="ml-2 text-gray-500">
//             Slide {currentSlide} of {totalSlides}
//           </span>
//         </div>

//         <div className="flex space-x-2">
//           <Button
//             onClick={goToPreviousSlide}
//             disabled={currentSlide <= 1}
//             variant="outline"
//             size="sm"
//           >
//             Previous
//           </Button>
//           <Button
//             onClick={goToNextSlide}
//             disabled={currentSlide >= totalSlides}
//             variant="outline"
//             size="sm"
//           >
//             Next
//           </Button>
//         </div>
//       </div>

//       <div
//         ref={containerRef}
//         className="powerpoint-container border rounded-md overflow-hidden bg-white"
//         style={{ height: "500px", position: "relative" }}
//       ></div>
//     </div>
//   );
// };

// export default OfficeViewer;
// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { Loader2, FileIcon, RefreshCw } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface OfficeViewerProps {
//   fileUrl: string;
//   fileName: string;
// }

// declare global {
//   interface Window {
//     Office: any;
//     PowerPoint: any;
//   }
// }

// const OfficeViewer: React.FC<OfficeViewerProps> = ({ fileUrl, fileName }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [presentation, setPresentation] = useState<any>(null);
//   const [currentSlide, setCurrentSlide] = useState<number>(1);
//   const [totalSlides, setTotalSlides] = useState<number>(0);

//   useEffect(() => {
//     const loadOfficeJS = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Load Office.js
//         await loadScript(
//           "https://appsforoffice.microsoft.com/lib/1/hosted/office.js"
//         );

//         // Wait for Office to be ready with retry logic
//         let attempts = 0;
//         const maxAttempts = 10;
//         while (!window.Office && attempts < maxAttempts) {
//           await new Promise((resolve) => setTimeout(resolve, 500));
//           attempts++;
//         }

//         if (!window.Office) {
//           throw new Error(
//             "Failed to load Office JS API after multiple attempts"
//           );
//         }

//         // Check if running in an Office context
//         if (!window.Office.context) {
//           throw new Error(
//             "Office.js is not running in an Office client. Please open this in PowerPoint or use Office Online."
//           );
//         }

//         // Initialize Office
//         window.Office.onReady(() => {
//           initializePowerPoint();
//         });
//       } catch (err) {
//         console.error("Error loading Office JS:", err);
//         setError(
//           `Failed to load Microsoft Office viewer: ${
//             err instanceof Error ? err.message : "Unknown error"
//           }`
//         );
//         setLoading(false);
//       }
//     };

//     const initializePowerPoint = async () => {
//       try {
//         // Validate PowerPoint API availability
//         if (!window.PowerPoint) {
//           throw new Error(
//             "PowerPoint API is not available in this environment"
//           );
//         }

//         // Get full URL for the file
//         const fullFileUrl = new URL(fileUrl, window.location.origin).href;

//         // Create PowerPoint presentation
//         const pres = await window.PowerPoint.createPresentation(fullFileUrl);
//         setPresentation(pres);

//         // Get slide information
//         const slideInfo = await pres.getSlideCount();
//         setTotalSlides(slideInfo.totalSlides);
//         setCurrentSlide(1);

//         // Setup container and show presentation
//         if (containerRef.current) {
//           containerRef.current.innerHTML = "";
//           const presContainer = document.createElement("div");
//           presContainer.id = "powerpoint-container";
//           presContainer.style.width = "100%";
//           presContainer.style.height = "100%";
//           containerRef.current.appendChild(presContainer);

//           await pres.render("powerpoint-container");

//           pres.on("slideChanged", (event: any) => {
//             setCurrentSlide(event.slideNumber);
//           });
//         }

//         setLoading(false);
//       } catch (err) {
//         console.error("Error initializing PowerPoint:", err);
//         setError(
//           `Failed to load PowerPoint presentation: ${
//             err instanceof Error ? err.message : "Unknown error"
//           }`
//         );
//         setLoading(false);
//       }
//     };

//     const loadScript = (src: string): Promise<void> => {
//       return new Promise((resolve, reject) => {
//         if (document.querySelector(`script[src="${src}"]`)) {
//           resolve();
//           return;
//         }

//         const script = document.createElement("script");
//         script.src = src;
//         script.async = true;
//         script.onload = () => resolve();
//         script.onerror = (event) => {
//           console.error(`Script load error for ${src}:`, event);
//           reject(new Error(`Failed to load script: ${src}`));
//         };
//         document.body.appendChild(script);
//       });
//     };

//     loadOfficeJS();

//     // Cleanup function
//     return () => {
//       if (presentation) {
//         try {
//           presentation.close();
//         } catch (err) {
//           console.warn("Error closing presentation:", err);
//         }
//       }
//     };
//   }, [fileUrl]);

//   const goToNextSlide = async () => {
//     if (presentation && currentSlide < totalSlides) {
//       try {
//         await presentation.goToSlide(currentSlide + 1);
//       } catch (err) {
//         console.error("Error navigating to next slide:", err);
//         setError("Failed to navigate to next slide");
//       }
//     }
//   };

//   const goToPreviousSlide = async () => {
//     if (presentation && currentSlide > 1) {
//       try {
//         await presentation.goToSlide(currentSlide - 1);
//       } catch (err) {
//         console.error("Error navigating to previous slide:", err);
//         setError("Failed to navigate to previous slide");
//       }
//     }
//   };

//   // Render error state with fallback suggestion
//   if (error) {
//     return (
//       <div
//         aria-live="assertive"
//         className="error-message p-4 bg-red-50 text-red-600 rounded-md"
//       >
//         <div className="flex items-start">
//           <div className="flex-shrink-0">
//             <FileIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
//           </div>
//           <div className="ml-3">
//             <h3 className="text-sm font-medium text-red-800">
//               PowerPoint Viewer Error
//             </h3>
//             <div className="mt-2 text-sm text-red-700">
//               <p>{error}</p>
//               {error.includes("Office client") && (
//                 <p className="mt-2">
//                   Try opening this file in{" "}
//                   <a
//                     href={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
//                       fileUrl
//                     )}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="underline"
//                   >
//                     Office Online
//                   </a>
//                   .
//                 </p>
//               )}
//             </div>
//             <div className="mt-4">
//               <Button
//                 onClick={() => window.location.reload()}
//                 variant="outline"
//                 size="sm"
//               >
//                 <RefreshCw className="h-4 w-4 mr-1" />
//                 Retry
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Render loading state
//   if (loading) {
//     return (
//       <div className="loading-message flex items-center justify-center h-[500px]">
//         <div className="flex flex-col items-center">
//           <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-2" />
//           <p>Loading PowerPoint presentation...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="office-pptx-viewer">
//       <div className="mb-4 flex items-center justify-between">
//         <div className="text-sm text-gray-700">
//           <span className="font-medium">{fileName}</span>
//           <span className="ml-2 text-gray-500">
//             Slide {currentSlide} of {totalSlides}
//           </span>
//         </div>

//         <div className="flex space-x-2">
//           <Button
//             onClick={goToPreviousSlide}
//             disabled={currentSlide <= 1}
//             variant="outline"
//             size="sm"
//           >
//             Previous
//           </Button>
//           <Button
//             onClick={goToNextSlide}
//             disabled={currentSlide >= totalSlides}
//             variant="outline"
//             size="sm"
//           >
//             Next
//           </Button>
//         </div>
//       </div>

//       <div
//         ref={containerRef}
//         className="powerpoint-container border rounded-md overflow-hidden bg-white"
//         style={{ height: "500px", position: "relative" }}
//       ></div>
//     </div>
//   );
// };

// export default OfficeViewer;

// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { Loader2, FileIcon, RefreshCw } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface OfficeViewerProps {
//   fileUrl: string;
//   fileName: string;
// }

// const OfficeViewer: React.FC<OfficeViewerProps> = ({ fileUrl, fileName }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);

//   useEffect(() => {
//     const initializeViewer = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Validate fileUrl
//         if (!fileUrl) {
//           throw new Error("No file URL provided");
//         }

//         // Ensure fileUrl is absolute
//         const fullFileUrl = new URL(fileUrl, window.location.origin).href;

//         // Check if file is accessible (optional, requires server-side CORS support)
//         try {
//           const response = await fetch(fullFileUrl, { method: "HEAD" });
//           if (!response.ok) {
//             throw new Error(
//               "Unable to access the PowerPoint file. Check the URL or CORS settings."
//             );
//           }
//         } catch (fetchErr) {
//           throw new Error(
//             `Failed to verify file access: ${
//               fetchErr instanceof Error ? fetchErr.message : "Unknown error"
//             }`
//           );
//         }

//         // Setup container
//         if (containerRef.current) {
//           containerRef.current.innerHTML = "";

//           // Create iframe for Office Online
//           const iframe = document.createElement("iframe");
//           iframe.src = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
//             fullFileUrl
//           )}`;
//           iframe.style.width = "100%";
//           iframe.style.height = "100%";
//           iframe.style.border = "none";
//           iframe.title = `PowerPoint Viewer: ${fileName}`;
//           iframe.onload = () => {
//             setIframeLoaded(true);
//             setLoading(false);
//           };
//           iframe.onerror = () => {
//             setError(
//               "Failed to load the PowerPoint viewer. Please try again or open in Office Online."
//             );
//             setLoading(false);
//           };
//           containerRef.current.appendChild(iframe);
//         }
//       } catch (err) {
//         console.error("Error initializing viewer:", err);
//         setError(
//           `Failed to load PowerPoint presentation: ${
//             err instanceof Error ? err.message : "Unknown error"
//           }`
//         );
//         setLoading(false);
//       }
//     };

//     initializeViewer();

//     // Cleanup
//     return () => {
//       if (containerRef.current) {
//         containerRef.current.innerHTML = "";
//       }
//     };
//   }, [fileUrl, fileName]);

//   // Render error state
//   if (error) {
//     return (
//       <div
//         aria-live="assertive"
//         className="error-message p-4 bg-red-50 text-red-600 rounded-md"
//       >
//         <div className="flex items-start">
//           <div className="flex-shrink-0">
//             <FileIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
//           </div>
//           <div className="ml-3">
//             <h3 className="text-sm font-medium text-red-800">
//               PowerPoint Viewer Error
//             </h3>
//             <div className="mt-2 text-sm text-red-700">
//               <p>{error}</p>
//               <p className="mt-2">
//                 Try opening this file in{" "}
//                 <a
//                   href={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
//                     fileUrl
//                   )}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="underline"
//                 >
//                   Office Online
//                 </a>
//                 .
//               </p>
//             </div>
//             <div className="mt-4">
//               <Button
//                 onClick={() => window.location.reload()}
//                 variant="outline"
//                 size="sm"
//               >
//                 <RefreshCw className="h-4 w-4 mr-1" />
//                 Retry
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Render loading state
//   if (loading || !iframeLoaded) {
//     return (
//       <div className="loading-message flex items-center justify-center h-[500px]">
//         <div className="flex flex-col items-center">
//           <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-2" />
//           <p>Loading PowerPoint presentation...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="office-pptx-viewer">
//       <div className="mb-4 flex items-center justify-between">
//         <div className="text-sm text-gray-700">
//           <span className="font-medium">{fileName}</span>
//         </div>
//         <div className="flex space-x-2">
//           <Button
//             onClick={() =>
//               window.open(
//                 `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
//                   fileUrl
//                 )}`,
//                 "_blank"
//               )
//             }
//             variant="outline"
//             size="sm"
//           >
//             Open in Office Online
//           </Button>
//         </div>
//       </div>

//       <div
//         ref={containerRef}
//         className="powerpoint-container border rounded-md overflow-hidden bg-white"
//         style={{ height: "500px", position: "relative" }}
//       ></div>
//     </div>
//   );
// };

// export default OfficeViewer;

// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { Loader2, FileIcon, RefreshCw } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface OfficeViewerProps {
//   fileUrl: string;
//   fileName: string;
// }

// const OfficeViewer: React.FC<OfficeViewerProps> = ({ fileUrl, fileName }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);

//   useEffect(() => {
//     let timeoutId: NodeJS.Timeout | null = null;

//     const initializeViewer = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Validate fileUrl
//         if (!fileUrl) {
//           throw new Error("No file URL provided");
//         }

//         // Ensure fileUrl is absolute
//         const fullFileUrl = new URL(fileUrl, window.location.origin).href;

//         // Check if file is accessible
//         try {
//           const response = await fetch(fullFileUrl, { method: "HEAD" });
//           if (!response.ok) {
//             throw new Error(
//               `Unable to access the PowerPoint file (HTTP ${response.status}). Ensure the file exists and CORS is enabled.`
//             );
//           }
//           // Check content-type to ensure it's a PowerPoint file
//           const contentType = response.headers.get("content-type");
//           if (
//             contentType &&
//             !contentType.includes("application/vnd.ms-powerpoint") &&
//             !contentType.includes(
//               "application/vnd.openxmlformats-officedocument.presentationml.presentation"
//             )
//           ) {
//             console.warn(`Unexpected content-type: ${contentType}`);
//           }
//         } catch (fetchErr) {
//           throw new Error(
//             `Failed to verify file access: ${
//               fetchErr instanceof Error ? fetchErr.message : "Unknown error"
//             }`
//           );
//         }

//         // Setup container
//         if (containerRef.current) {
//           containerRef.current.innerHTML = "";

//           // Create iframe for Office Online
//           const iframe = document.createElement("iframe");
//           iframe.src = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
//             fullFileUrl
//           )}`;
//           iframe.style.width = "100%";
//           iframe.style.height = "100%";
//           iframe.style.border = "none";
//           iframe.title = `PowerPoint Viewer: ${fileName}`;
//           iframe.onload = () => {
//             console.log("Iframe loaded successfully");
//             setIframeLoaded(true);
//             setLoading(false);
//             if (timeoutId) clearTimeout(timeoutId);
//           };
//           iframe.onerror = (event) => {
//             console.error("Iframe error:", event);
//             setError(
//               "Failed to load the PowerPoint viewer. Please try again or open in Office Online."
//             );
//             setLoading(false);
//             if (timeoutId) clearTimeout(timeoutId);
//           };
//           containerRef.current.appendChild(iframe);

//           // Set timeout to detect if iframe fails to load
//           timeoutId = setTimeout(() => {
//             if (!iframeLoaded) {
//               console.error("Iframe loading timed out after 30 seconds");
//               setError(
//                 "The PowerPoint viewer took too long to load. Please check the file URL or try opening in Office Online."
//               );
//               setLoading(false);
//             }
//           }, 30000); // 30 seconds timeout
//         }
//       } catch (err) {
//         console.error("Error initializing viewer:", err);
//         setError(
//           `Failed to load PowerPoint presentation: ${
//             err instanceof Error ? err.message : "Unknown error"
//           }`
//         );
//         setLoading(false);
//         if (timeoutId) clearTimeout(timeoutId);
//       }
//     };

//     initializeViewer();

//     // Cleanup
//     return () => {
//       if (timeoutId) clearTimeout(timeoutId);
//       if (containerRef.current) {
//         containerRef.current.innerHTML = "";
//       }
//     };
//   }, [fileUrl, fileName, iframeLoaded]);

//   // Render error state
//   if (error) {
//     return (
//       <div
//         aria-live="assertive"
//         className="error-message p-4 bg-red-50 text-red-600 rounded-md"
//       >
//         <div className="flex items-start">
//           <div className="flex-shrink-0">
//             <FileIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
//           </div>
//           <div className="ml-3">
//             <h3 className="text-sm font-medium text-red-800">
//               PowerPoint Viewer Error
//             </h3>
//             <div className="mt-2 text-sm text-red-700">
//               <p>{error}</p>
//               <p className="mt-2">
//                 Try opening this file in{" "}
//                 <a
//                   href={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
//                     fileUrl
//                   )}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="underline"
//                 >
//                   Office Online
//                 </a>
//                 .
//               </p>
//             </div>
//             <div className="mt-4">
//               <Button
//                 onClick={() => window.location.reload()}
//                 variant="outline"
//                 size="sm"
//               >
//                 <RefreshCw className="h-4 w-4 mr-1" />
//                 Retry
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Render loading state
//   if (loading || !iframeLoaded) {
//     return (
//       <div className="loading-message flex items-center justify-center h-[500px]">
//         <div className="flex flex-col items-center">
//           <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-2" />
//           <p>Loading PowerPoint presentation...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="office-pptx-viewer">
//       <div className="mb-4 flex items-center justify-between">
//         <div className="text-sm text-gray-700">
//           <span className="font-medium">{fileName}</span>
//         </div>
//         <div className="flex space-x-2">
//           <Button
//             onClick={() =>
//               window.open(
//                 `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
//                   fileUrl
//                 )}`,
//                 "_blank"
//               )
//             }
//             variant="outline"
//             size="sm"
//           >
//             Open in Office Online
//           </Button>
//         </div>
//       </div>

//       <div
//         ref={containerRef}
//         className="powerpoint-container border rounded-md overflow-hidden bg-white"
//         style={{ height: "500px", position: "relative" }}
//       ></div>
//     </div>
//   );
// };

// export default OfficeViewer;

// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { Loader2, FileIcon, RefreshCw } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface OfficeViewerProps {
//   fileUrl: string;
//   fileName: string;
// }

// const OfficeViewer: React.FC<OfficeViewerProps> = ({ fileUrl, fileName }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);

//   useEffect(() => {
//     let timeoutId: NodeJS.Timeout | null = null;

//     const initializeViewer = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Validate fileUrl
//         if (!fileUrl) {
//           throw new Error("No file URL provided");
//         }

//         // Ensure fileUrl is absolute
//         const fullFileUrl = fileUrl.startsWith("http")
//           ? fileUrl
//           : new URL(
//               fileUrl,
//               process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
//             ).href;

//         console.log("Using fileUrl:", fullFileUrl);

//         // Check if file is accessible
//         try {
//           const response = await fetch(fullFileUrl, { method: "HEAD" });
//           if (!response.ok) {
//             throw new Error(
//               `Unable to access the PowerPoint file (HTTP ${response.status}). Ensure the file exists and CORS is enabled.`
//             );
//           }
//           const contentType = response.headers.get("content-type");
//           if (
//             contentType &&
//             !contentType.includes("application/vnd.ms-powerpoint") &&
//             !contentType.includes(
//               "application/vnd.openxmlformats-officedocument.presentationml.presentation"
//             )
//           ) {
//             console.warn(`Unexpected content-type: ${contentType}`);
//           }
//         } catch (fetchErr) {
//           throw new Error(
//             `Failed to verify file access: ${
//               fetchErr instanceof Error ? fetchErr.message : "Unknown error"
//             }`
//           );
//         }

//         // Setup container
//         if (containerRef.current) {
//           containerRef.current.innerHTML = "";

//           // Create iframe for Office Online
//           const iframe = document.createElement("iframe");
//           iframe.src = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
//             fullFileUrl
//           )}`;
//           iframe.style.width = "100%";
//           iframe.style.height = "100%";
//           iframe.style.border = "none";
//           iframe.title = `PowerPoint Viewer: ${fileName}`;
//           iframe.onload = () => {
//             console.log("Iframe loaded successfully:", fullFileUrl);
//             setIframeLoaded(true);
//             setLoading(false);
//             if (timeoutId) clearTimeout(timeoutId);
//           };
//           iframe.onerror = (event) => {
//             console.error("Iframe error:", event);
//             setError(
//               "Failed to load the PowerPoint viewer. Ensure the file is accessible and try again."
//             );
//             setLoading(false);
//             if (timeoutId) clearTimeout(timeoutId);
//           };
//           containerRef.current.appendChild(iframe);

//           // Set timeout to detect if iframe fails to load
//           timeoutId = setTimeout(() => {
//             if (!iframeLoaded) {
//               console.error(
//                 "Iframe loading timed out after 15 seconds for:",
//                 fullFileUrl
//               );
//               setError(
//                 "The PowerPoint viewer took too long to load. Ensure the file is accessible or try opening in Office Online."
//               );
//               setLoading(false);
//             }
//           }, 15000); // Reduced to 15 seconds for faster feedback
//         }
//       } catch (err) {
//         console.error("Error initializing viewer:", err);
//         setError(
//           `Failed to load PowerPoint presentation: ${
//             err instanceof Error ? err.message : "Unknown error"
//           }`
//         );
//         setLoading(false);
//         if (timeoutId) clearTimeout(timeoutId);
//       }
//     };

//     initializeViewer();

//     // Cleanup
//     return () => {
//       if (timeoutId) clearTimeout(timeoutId);
//       if (containerRef.current) {
//         containerRef.current.innerHTML = "";
//       }
//     };
//   }, [fileUrl, fileName]);

//   // Render error state
//   if (error) {
//     return (
//       <div
//         aria-live="assertive"
//         className="error-message p-4 bg-red-50 text-red-600 rounded-md"
//       >
//         <div className="flex items-start">
//           <div className="flex-shrink-0">
//             <FileIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
//           </div>
//           <div className="ml-3">
//             <h3 className="text-sm font-medium text-red-800">
//               PowerPoint Viewer Error
//             </h3>
//             <div className="mt-2 text-sm text-red-700">
//               <p>{error}</p>
//               <p className="mt-2">
//                 Try opening this file in{" "}
//                 <a
//                   href={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
//                     fileUrl
//                   )}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="underline"
//                 >
//                   Office Online
//                 </a>
//                 .
//               </p>
//             </div>
//             <div className="mt-4">
//               <Button
//                 onClick={() => window.location.reload()}
//                 variant="outline"
//                 size="sm"
//               >
//                 <RefreshCw className="h-4 w-4 mr-1" />
//                 Retry
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Render loading state
//   if (loading || !iframeLoaded) {
//     return (
//       <div className="loading-message flex items-center justify-center h-[500px]">
//         <div className="flex flex-col items-center">
//           <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-2" />
//           <p>Loading PowerPoint presentation...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="office-pptx-viewer">
//       <div className="mb-4 flex items-center justify-between">
//         <div className="text-sm text-gray-700">
//           <span className="font-medium">{fileName}</span>
//         </div>
//         <div className="flex space-x-2">
//           <Button
//             onClick={() =>
//               window.open(
//                 `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
//                   fileUrl
//                 )}`,
//                 "_blank"
//               )
//             }
//             variant="outline"
//             size="sm"
//           >
//             Open in Office Online
//           </Button>
//         </div>
//       </div>

//       <div
//         ref={containerRef}
//         className="powerpoint-container border rounded-md overflow-hidden bg-white"
//         style={{ height: "500px", position: "relative" }}
//       ></div>
//     </div>
//   );
// };

// export default OfficeViewer;

// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { Loader2, FileIcon, RefreshCw } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface OfficeViewerProps {
//   fileUrl: string;
//   fileName: string;
// }

// const OfficeViewer: React.FC<OfficeViewerProps> = ({ fileUrl, fileName }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);

//   useEffect(() => {
//     let timeoutId: NodeJS.Timeout | null = null;

//     const initializeViewer = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Validate fileUrl
//         if (!fileUrl) {
//           throw new Error("No file URL provided");
//         }

//         // Ensure fileUrl is absolute
//         const fullFileUrl = fileUrl.startsWith("http")
//           ? fileUrl
//           : new URL(
//               fileUrl,
//               process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
//             ).href;

//         console.log("Using fileUrl:", fullFileUrl);

//         // Warn if using localhost
//         if (fullFileUrl.includes("localhost")) {
//           console.warn(
//             "Warning: Using localhost in fileUrl. Office Online cannot access localhost. Use a public URL (e.g., via ngrok)."
//           );
//           setError(
//             "Cannot load file from localhost. Please use a public URL or open in Office Online."
//           );
//           setLoading(false);
//           return;
//         }

//         // Check if file is accessible
//         try {
//           const response = await fetch(fullFileUrl, { method: "HEAD" });
//           if (!response.ok) {
//             throw new Error(
//               `Unable to access the PowerPoint file (HTTP ${response.status}). Ensure the file exists and CORS is enabled.`
//             );
//           }
//           const contentType = response.headers.get("content-type");
//           if (
//             contentType &&
//             !contentType.includes("application/vnd.ms-powerpoint") &&
//             !contentType.includes(
//               "application/vnd.openxmlformats-officedocument.presentationml.presentation"
//             )
//           ) {
//             console.warn(`Unexpected content-type: ${contentType}`);
//           }
//         } catch (fetchErr) {
//           throw new Error(
//             `Failed to verify file access: ${
//               fetchErr instanceof Error ? fetchErr.message : "Unknown error"
//             }`
//           );
//         }

//         // Setup container
//         if (containerRef.current) {
//           containerRef.current.innerHTML = "";

//           // Create iframe for Office Online
//           const iframe = document.createElement("iframe");
//           iframe.src = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
//             fullFileUrl
//           )}`;
//           iframe.style.width = "100%";
//           iframe.style.height = "100%";
//           iframe.style.border = "none";
//           iframe.title = `PowerPoint Viewer: ${fileName}`;
//           iframe.onload = () => {
//             console.log("Iframe loaded successfully:", fullFileUrl);
//             setIframeLoaded(true);
//             setLoading(false);
//             if (timeoutId) clearTimeout(timeoutId);
//           };
//           iframe.onerror = (event) => {
//             console.error("Iframe error:", event);
//             setError(
//               "Failed to load the PowerPoint viewer. Ensure the file is accessible and try again."
//             );
//             setLoading(false);
//             if (timeoutId) clearTimeout(timeoutId);
//           };
//           console.log("Attempting to load iframe with src:", iframe.src);
//           containerRef.current.appendChild(iframe);

//           // Set timeout to detect if iframe fails to load
//           timeoutId = setTimeout(() => {
//             if (!iframeLoaded) {
//               console.error(
//                 "Iframe loading timed out after 10 seconds for:",
//                 fullFileUrl
//               );
//               setError(
//                 "The PowerPoint viewer took too long to load. Ensure the file is publicly accessible or try opening in Office Online."
//               );
//               setLoading(false);
//             }
//           }, 10000); // 10 seconds timeout
//         }
//       } catch (err) {
//         console.error("Error initializing viewer:", err);
//         setError(
//           `Failed to load PowerPoint presentation: ${
//             err instanceof Error ? err.message : "Unknown error"
//           }`
//         );
//         setLoading(false);
//         if (timeoutId) clearTimeout(timeoutId);
//       }
//     };

//     initializeViewer();

//     // Cleanup
//     return () => {
//       if (timeoutId) clearTimeout(timeoutId);
//       if (containerRef.current) {
//         containerRef.current.innerHTML = "";
//       }
//     };
//   }, [fileUrl, fileName]);

//   // Render error state
//   if (error) {
//     return (
//       <div
//         aria-live="assertive"
//         className="error-message p-4 bg-red-50 text-red-600 rounded-md"
//       >
//         <div className="flex items-start">
//           <div className="flex-shrink-0">
//             <FileIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
//           </div>
//           <div className="ml-3">
//             <h3 className="text-sm font-medium text-red-800">
//               PowerPoint Viewer Error
//             </h3>
//             <div className="mt-2 text-sm text-red-700">
//               <p>{error}</p>
//               <p className="mt-2">
//                 Try opening this file in{" "}
//                 <a
//                   href={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
//                     fileUrl
//                   )}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="underline"
//                 >
//                   Office Online
//                 </a>
//                 .
//               </p>
//             </div>
//             <div className="mt-4">
//               <Button
//                 onClick={() => window.location.reload()}
//                 variant="outline"
//                 size="sm"
//               >
//                 <RefreshCw className="h-4 w-4 mr-1" />
//                 Retry
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Render loading state
//   if (loading || !iframeLoaded) {
//     return (
//       <div className="loading-message flex items-center justify-center h-[500px]">
//         <div className="flex flex-col items-center">
//           <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-2" />
//           <p>Loading PowerPoint presentation...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="office-pptx-viewer">
//       <div className="mb-4 flex items-center justify-between">
//         <div className="text-sm text-gray-700">
//           <span className="font-medium">{fileName}</span>
//         </div>
//         <div className="flex space-x-2">
//           <Button
//             onClick={() =>
//               window.open(
//                 `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
//                   fileUrl
//                 )}`,
//                 "_blank"
//               )
//             }
//             variant="outline"
//             size="sm"
//           >
//             Open in Office Online
//           </Button>
//         </div>
//       </div>

//       <div
//         ref={containerRef}
//         className="powerpoint-container border rounded-md overflow-hidden bg-white"
//         style={{ height: "500px", position: "relative" }}
//       ></div>
//     </div>
//   );
// };

// export default OfficeViewer;

"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2, FileIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OfficeViewerProps {
  fileUrl: string;
  fileName: string;
}

const OfficeViewer: React.FC<OfficeViewerProps> = ({ fileUrl, fileName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const initializeViewer = async () => {
      try {
        setLoading(true);
        setError(null);

        // Validate fileUrl
        if (!fileUrl) {
          throw new Error("No file URL provided");
        }

        // Ensure fileUrl is absolute
        const fullFileUrl = fileUrl.startsWith("http")
          ? fileUrl
          : new URL(
              fileUrl,
              process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"
            ).href;

        console.log("Using fileUrl:", fullFileUrl);

        // Warn if using localhost
        if (fullFileUrl.includes("localhost")) {
          console.warn(
            "Warning: Using localhost in fileUrl. Office Online cannot access localhost. Use a public URL (e.g., via ngrok)."
          );
          setError(
            "Cannot load file from localhost. Please use a public URL or open in Office Online."
          );
          setLoading(false);
          return;
        }

        // Check if file is accessible
        try {
          const response = await fetch(fullFileUrl, { method: "HEAD" });
          if (!response.ok) {
            throw new Error(
              `Unable to access the PowerPoint file (HTTP ${response.status}). Ensure the file exists and CORS is enabled.`
            );
          }
          const contentType = response.headers.get("content-type");
          if (
            contentType &&
            !contentType.includes("application/vnd.ms-powerpoint") &&
            !contentType.includes(
              "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            )
          ) {
            console.warn(`Unexpected content-type: ${contentType}`);
            setError(
              `Invalid file type. Expected a PowerPoint file (.pptx or .ppt).`
            );
            setLoading(false);
            return;
          }
          const corsHeader = response.headers.get(
            "access-control-allow-origin"
          );
          if (!corsHeader || corsHeader !== "*") {
            console.warn("Missing or incorrect CORS header:", corsHeader);
            setError(
              "File server does not allow cross-origin access. Please enable CORS (Access-Control-Allow-Origin: *)."
            );
            setLoading(false);
            return;
          }
        } catch (fetchErr) {
          throw new Error(
            `Failed to verify file access: ${
              fetchErr instanceof Error ? fetchErr.message : "Unknown error"
            }`
          );
        }

        // Test Office Online URL
        const officeOnlineUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
          fullFileUrl
        )}`;
        try {
          const testResponse = await fetch(officeOnlineUrl, { method: "HEAD" });
          if (!testResponse.ok) {
            console.warn(
              "Office Online test fetch failed:",
              testResponse.status
            );
          }
        } catch (testErr) {
          console.warn("Error testing Office Online URL:", testErr);
        }

        // Setup container
        if (containerRef.current) {
          containerRef.current.innerHTML = "";

          // Create iframe for Office Online
          const iframe = document.createElement("iframe");
          iframe.src = officeOnlineUrl;
          iframe.style.width = "100%";
          iframe.style.height = "100%";
          iframe.style.border = "none";
          iframe.title = `PowerPoint Viewer: ${fileName}`;
          iframe.onload = () => {
            console.log("Iframe loaded successfully:", fullFileUrl);
            setIframeLoaded(true);
            setLoading(false);
            if (timeoutId) clearTimeout(timeoutId);
          };
          iframe.onerror = (event) => {
            console.error("Iframe error:", event);
            setError(
              "Failed to load the PowerPoint viewer. Ensure the file is accessible and try again."
            );
            setLoading(false);
            if (timeoutId) clearTimeout(timeoutId);
          };
          console.log("Attempting to load iframe with src:", iframe.src);
          containerRef.current.appendChild(iframe);

          // Set timeout to detect if iframe fails to load
          timeoutId = setTimeout(() => {
            if (!iframeLoaded) {
              console.error(
                "Iframe loading timed out after 10 seconds for:",
                fullFileUrl
              );
              setError(
                "The PowerPoint viewer took too long to load. Ensure the file is publicly accessible or try opening in Office Online."
              );
              setLoading(false);
            }
          }, 10000); // 10 seconds timeout
        }
      } catch (err) {
        console.error("Error initializing viewer:", err);
        setError(
          `Failed to load PowerPoint presentation: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
        setLoading(false);
        if (timeoutId) clearTimeout(timeoutId);
      }
    };

    initializeViewer();

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [fileUrl, fileName]);

  // Render error state
  if (error) {
    return (
      <div
        aria-live="assertive"
        className="error-message p-4 bg-red-50 text-red-600 rounded-md"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FileIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              PowerPoint Viewer Error
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
              <p className="mt-2">
                Try opening this file in{" "}
                <a
                  href={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
                    fileUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Office Online
                </a>
                .
              </p>
            </div>
            <div className="mt-4">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render loading state
  if (loading || !iframeLoaded) {
    return (
      <div className="loading-message flex items-center justify-center h-[500px]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-2" />
          <p>Loading PowerPoint presentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="office-pptx-viewer">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          <span className="font-medium">{fileName}</span>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() =>
              window.open(
                `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
                  fileUrl
                )}`,
                "_blank"
              )
            }
            variant="outline"
            size="sm"
          >
            Open in Office Online
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="powerpoint-container border rounded-md overflow-hidden bg-white"
        style={{ height: "500px", position: "relative" }}
      ></div>
    </div>
  );
};

export default OfficeViewer;
