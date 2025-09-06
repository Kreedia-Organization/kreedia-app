import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get('Authorization');

        if (!token) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Valider les données requises
        if (!body.pictures || !Array.isArray(body.pictures) || body.pictures.length === 0) {
            return NextResponse.json(
                { message: 'Pictures are required' },
                { status: 400 }
            );
        }

        if (!body.location || !body.location.latitude || !body.location.longitude) {
            return NextResponse.json(
                { message: 'Location coordinates are required' },
                { status: 400 }
            );
        }

        if (!body.address) {
            return NextResponse.json(
                { message: 'Address is required' },
                { status: 400 }
            );
        }

        // Préparer les données pour le backend
        const missionData = {
            pictures: body.pictures,
            location: {
                latitude: body.location.latitude,
                longitude: body.location.longitude,
            },
            address: body.address,
        };

        // Appeler le backend Laravel
        const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth-missions`;

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(missionData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { message: errorData.message || 'Failed to create mission' },
                { status: response.status }
            );
        }

        const result = await response.json();

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: 'Mission created successfully',
                data: result.data,
            });
        } else {
            return NextResponse.json(
                { message: result.message || 'Failed to create mission' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error creating mission:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
