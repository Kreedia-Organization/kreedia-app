import cloudinary from '@/lib/cloudinary/config';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
    try {
        const { publicId } = await request.json();

        if (!publicId) {
            return NextResponse.json(
                { error: 'Public ID is required' },
                { status: 400 }
            );
        }

        // Supprimer l'image de Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'ok') {
            return NextResponse.json(
                { message: 'Image deleted successfully' },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { error: 'Failed to delete image' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
