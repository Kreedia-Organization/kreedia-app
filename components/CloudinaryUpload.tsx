"use client";

import { Loader2, Upload, X } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import React, { useState } from "react";

interface CloudinaryUploadProps {
  onUploadSuccess: (url: string, publicId: string) => void;
  onUploadError?: (error: any) => void;
  uploadPreset: string;
  folder?: string;
  maxFiles?: number;
  maxFileSize?: number; // en bytes
  acceptedFormats?: string[];
  showPreview?: boolean;
  className?: string;
  buttonText?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  uploadPreset,
  folder = "uploads",
  maxFiles = 1,
  maxFileSize = 10000000, // 10MB par défaut
  acceptedFormats = ["jpg", "png", "jpeg", "gif", "webp"],
  showPreview = false,
  className = "",
  buttonText = "Upload File",
  disabled = false,
  children,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleSuccess = (result: any) => {
    if (result.event === "success") {
      const url = result.info.secure_url;
      const publicId = result.info.public_id;

      setUploadedUrl(url);
      setIsUploading(false);
      onUploadSuccess(url, publicId);

      console.log("✅ Upload successful:", { url, publicId });
    }
  };

  const handleError = (error: any) => {
    console.error("❌ Upload error:", error);
    setIsUploading(false);
    if (onUploadError) {
      onUploadError(error);
    }
  };

  const removeImage = () => {
    setUploadedUrl(null);
  };

  return (
    <div className={`cloudinary-upload ${className}`}>
      <CldUploadWidget
        uploadPreset={uploadPreset}
        options={{
          maxFiles,
          maxImageFileSize: maxFileSize,
          resourceType: "auto",
          folder,
          clientAllowedFormats: acceptedFormats,
          quality: "auto",
          format: "auto",
        }}
        onUpload={() => {
          setIsUploading(true);
        }}
        onSuccess={handleSuccess}
        onError={handleError}
      >
        {({ open }) => (
          <div className="space-y-4">
            {/* Upload Button */}
            {children ? (
              <div onClick={() => open()} className="cursor-pointer">
                {children}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => open()}
                disabled={disabled || isUploading}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>{buttonText}</span>
                  </>
                )}
              </button>
            )}

            {/* Preview */}
            {showPreview && uploadedUrl && (
              <div className="relative inline-block">
                <img
                  src={uploadedUrl}
                  alt="Uploaded"
                  className="max-w-xs max-h-48 rounded-lg border border-gray-200 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                  title="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </CldUploadWidget>
    </div>
  );
};

export default CloudinaryUpload;
