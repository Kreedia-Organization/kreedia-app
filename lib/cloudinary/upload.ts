"use client";

import { cloudinaryConfig, UPLOAD_PRESETS } from './config';

export interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
    url: string;
}

export interface UploadOptions {
    preset: keyof typeof UPLOAD_PRESETS;
    folder?: string;
    tags?: string[];
    context?: Record<string, string>;
}

/**
 * Upload d'image vers Cloudinary (côté client)
 */
export const uploadToCloudinary = async (
    file: File,
    options: UploadOptions
): Promise<CloudinaryUploadResult> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESETS[options.preset]);
        formData.append('cloud_name', cloudinaryConfig.cloudName!);

        // Ajouter le dossier si spécifié
        if (options.folder) {
            formData.append('folder', options.folder);
        }

        // Ajouter les tags si spécifiés
        if (options.tags && options.tags.length > 0) {
            formData.append('tags', options.tags.join(','));
        }

        // Ajouter le contexte si spécifié
        if (options.context) {
            formData.append('context', Object.entries(options.context)
                .map(([key, value]) => `${key}=${value}`)
                .join('|')
            );
        }

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        const result = await response.json();
        return result as CloudinaryUploadResult;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
};

/**
 * Upload multiple images
 */
export const uploadMultipleToCloudinary = async (
    files: File[],
    options: UploadOptions
): Promise<CloudinaryUploadResult[]> => {
    try {
        const uploadPromises = files.map(file => uploadToCloudinary(file, options));
        return await Promise.all(uploadPromises);
    } catch (error) {
        console.error('Multiple upload error:', error);
        throw error;
    }
};

/**
 * Supprimer une image de Cloudinary
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
    try {
        // Cette opération nécessite une route API côté serveur pour des raisons de sécurité
        const response = await fetch('/api/cloudinary/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ publicId }),
        });

        if (!response.ok) {
            throw new Error(`Delete failed: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw new Error('Failed to delete image from Cloudinary');
    }
};

/**
 * Validation des fichiers avant upload
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'Type de fichier non supporté. Utilisez JPG, PNG ou WebP.',
        };
    }

    // Vérifier la taille (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        return {
            valid: false,
            error: 'Le fichier est trop volumineux. Taille maximum : 10MB.',
        };
    }

    return { valid: true };
};

/**
 * Prévisualisation d'image avant upload
 */
export const createImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                resolve(e.target.result as string);
            } else {
                reject(new Error('Failed to create preview'));
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};
