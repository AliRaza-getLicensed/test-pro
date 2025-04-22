"use client";

import React, { useState, useRef } from 'react';
import { Loader2, Upload, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import OfficeViewer from './OfficeViewer';

const PowerPointUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if file is a PowerPoint file
      if (!selectedFile.name.endsWith('.pptx')) {
        setError('Please select a valid PowerPoint (.pptx) file');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Upload file to temporary storage
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'File upload failed');
      }

      // Set the uploaded file URL for the viewer
      setUploadedFileUrl(data.fileUrl);
      setUploading(false);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setUploading(false);
    }
  };

  return (
    <div className="powerpoint-uploader">
      {!uploadedFileUrl ? (
        <div className="upload-section p-6 border-2 border-dashed rounded-lg">
          <div className="flex flex-col items-center justify-center space-y-4">
            <File className="h-12 w-12 text-gray-400" />
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Upload a PowerPoint file</h3>
              <p className="text-sm text-gray-500 mt-1">
                Upload a .pptx file to view it using Microsoft Office viewer
              </p>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pptx"
            />
            
            <div className="flex space-x-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                disabled={uploading}
              >
                Choose File
              </Button>
              
              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
            
            {file && (
              <div className="text-sm text-gray-600">
                Selected file: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </div>
            )}
            
            {error && (
              <div className="text-sm text-red-600 mt-2">
                {error}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="viewer-section">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">PowerPoint Viewer</h2>
            <Button 
              onClick={() => {
                setUploadedFileUrl(null);
                setFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              variant="outline"
              size="sm"
            >
              Upload Different File
            </Button>
          </div>
          
          <OfficeViewer 
            fileUrl={uploadedFileUrl} 
            fileName={file?.name || 'Presentation'}
          />
        </div>
      )}
    </div>
  );
};

export default PowerPointUploader;