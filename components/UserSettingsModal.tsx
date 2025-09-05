"use client";

import { useAuth } from "@/hooks/useAuth";
import { UserService } from "@/lib/firebase/services/users";
import { UploadedFile } from "@/lib/upload/api";
import { UserGender } from "@/types/firebase";
import {
  AlertCircle,
  Camera,
  CheckCircle,
  Loader2,
  Save,
  X,
} from "lucide-react";
import React, { useState } from "react";
import Button from "./ui/Button";
import ImageUpload from "./ui/ImageUpload";

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserSettingsModal: React.FC<UserSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, userData, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: userData?.name || user?.displayName || "",
    phone: userData?.phone || "",
    gender: userData?.gender || "",
    profileImage: userData?.profileImage || user?.photoURL || "",
  });

  // Handle form field changes
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(false);
  };

  // Handle image upload success
  const handleImageUpload = (result: UploadedFile) => {
    setFormData((prev) => ({ ...prev, profileImage: result.url }));
    console.log("Profile image updated:", result.url);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !userData) {
      setError("User data not available");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log("Updating user profile:", formData);

      // Update user data in Firestore
      await UserService.updateUser(user.uid, {
        name: formData.name,
        phone: formData.phone || null,
        gender: (formData.gender as UserGender) || null,
        profileImage: formData.profileImage || null,
      });

      // Update Firebase Auth profile if needed
      if (
        formData.name !== user.displayName ||
        formData.profileImage !== user.photoURL
      ) {
        const { updateProfile } = await import("firebase/auth");
        await updateProfile(user, {
          displayName: formData.name,
          photoURL: formData.profileImage,
        });
      }

      // Refresh user data
      await refreshUserData();

      setSuccess(true);
      console.log("✅ Profile updated successfully");

      // Auto-close after success
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (loading || uploadingImage) return;

    // Reset form to original values
    setFormData({
      name: userData?.name || user?.displayName || "",
      phone: userData?.phone || "",
      gender: userData?.gender || "",
      profileImage: userData?.profileImage || user?.photoURL || "",
    });
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Profile Settings
          </h2>
          <button
            onClick={handleClose}
            disabled={loading || uploadingImage}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Picture
              </label>
              <div className="flex flex-col items-center space-y-4">
                {/* Current profile image */}
                <div className="relative">
                  {formData.profileImage ? (
                    <img
                      src={formData.profileImage}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                      <Camera className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Upload component */}
                <div className="w-full max-w-xs">
                  <ImageUpload
                    onUploadComplete={handleImageUpload}
                    onUploadError={(error) => {
                      setError(error);
                    }}
                    existingImageUrl={formData.profileImage}
                    placeholder="Upload profile picture"
                    maxFileSize={5}
                    acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                    Click to upload a new profile picture (max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">Select gender</option>
                <option value={UserGender.MALE}>Male</option>
                <option value={UserGender.FEMALE}>Female</option>
                <option value={UserGender.OTHER}>Other</option>
                <option value={UserGender.PREFER_NOT_TO_SAY}>
                  Prefer not to say
                </option>
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-md">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <p className="text-sm text-green-700 dark:text-green-300">
                  Profile updated successfully!
                </p>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading || uploadingImage}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || uploadingImage}
                className="flex-1 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsModal;
