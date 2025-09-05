import {
    COLLECTIONS,
    CreateLocationSubmissionData,
    GeoPoint,
    LocationStatus,
    LocationSubmission,
    UpdateLocationSubmissionData
} from '@/types/firebase';
import {
    collection,
    deleteDoc,
    doc,
    GeoPoint as FirestoreGeoPoint,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    QueryConstraint,
    serverTimestamp,
    setDoc,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from '../config';

export class LocationSubmissionService {
    private static collection = collection(db, COLLECTIONS.LOCATION_SUBMISSIONS);

    /**
     * Submit a new location
     */
    static async submitLocation(locationData: CreateLocationSubmissionData): Promise<string> {
        const locationRef = doc(this.collection);
        const now = serverTimestamp();

        const newLocation: Omit<LocationSubmission, 'id'> = {
            ...locationData,
            position: new FirestoreGeoPoint(
                locationData.position.latitude,
                locationData.position.longitude
            ) as any,
            status: LocationStatus.PENDING,
            submittedAt: now as Timestamp,
            createdAt: now as Timestamp,
            updatedAt: now as Timestamp,
        };

        await setDoc(locationRef, newLocation);
        return locationRef.id;
    }

    /**
     * Get location submission by ID
     */
    static async getLocationSubmissionById(locationId: string): Promise<LocationSubmission | null> {
        const locationRef = doc(this.collection, locationId);
        const locationSnap = await getDoc(locationRef);

        if (locationSnap.exists()) {
            const data = locationSnap.data();
            return {
                id: locationSnap.id,
                ...data,
                position: {
                    latitude: data.position.latitude,
                    longitude: data.position.longitude
                }
            } as LocationSubmission;
        }
        return null;
    }

    /**
     * Update location submission
     */
    static async updateLocationSubmission(
        locationId: string,
        updateData: UpdateLocationSubmissionData
    ): Promise<void> {
        const locationRef = doc(this.collection, locationId);
        const dataToUpdate: any = {
            ...updateData,
            updatedAt: serverTimestamp(),
        };

        // Convert GeoPoint if provided
        if (updateData.position) {
            dataToUpdate.position = new FirestoreGeoPoint(
                updateData.position.latitude,
                updateData.position.longitude
            );
        }

        await updateDoc(locationRef, dataToUpdate);
    }

    /**
     * Delete location submission
     */
    static async deleteLocationSubmission(locationId: string): Promise<void> {
        const locationRef = doc(this.collection, locationId);
        await deleteDoc(locationRef);
    }

    /**
     * Get location submissions with filters
     */
    static async getLocationSubmissions(filters?: {
        userId?: string;
        status?: LocationStatus;
        neighborhood?: string;
        limit?: number;
        orderByField?: keyof LocationSubmission;
        orderDirection?: 'asc' | 'desc';
    }): Promise<LocationSubmission[]> {
        const constraints: QueryConstraint[] = [];

        if (filters?.userId) {
            constraints.push(where('userId', '==', filters.userId));
        }

        if (filters?.status) {
            constraints.push(where('status', '==', filters.status));
        }

        if (filters?.neighborhood) {
            constraints.push(where('neighborhood', '==', filters.neighborhood));
        }

        if (filters?.orderByField) {
            constraints.push(orderBy(filters.orderByField, filters.orderDirection || 'desc'));
        } else {
            constraints.push(orderBy('submittedAt', 'desc'));
        }

        if (filters?.limit) {
            constraints.push(limit(filters.limit));
        }

        const q = query(this.collection, ...constraints);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                position: {
                    latitude: data.position.latitude,
                    longitude: data.position.longitude
                }
            } as LocationSubmission;
        });
    }

    /**
     * Get user's location submissions
     */
    static async getUserLocationSubmissions(
        userId: string,
        status?: LocationStatus
    ): Promise<LocationSubmission[]> {
        return this.getLocationSubmissions({
            userId,
            status,
            orderByField: 'submittedAt',
            orderDirection: 'desc'
        });
    }

    /**
     * Get pending location submissions for review
     */
    static async getPendingLocationSubmissions(limitResults = 20): Promise<LocationSubmission[]> {
        return this.getLocationSubmissions({
            status: LocationStatus.PENDING,
            limit: limitResults,
            orderByField: 'submittedAt',
            orderDirection: 'asc' // Oldest first for review
        });
    }

    /**
     * Get approved location submissions
     */
    static async getApprovedLocationSubmissions(limitResults = 20): Promise<LocationSubmission[]> {
        return this.getLocationSubmissions({
            status: LocationStatus.APPROVED,
            limit: limitResults
        });
    }

    /**
     * Approve location submission
     */
    static async approveLocationSubmission(
        locationId: string,
        reviewedBy: string
    ): Promise<void> {
        await this.updateLocationSubmission(locationId, {
            status: LocationStatus.APPROVED,
            reviewedAt: serverTimestamp() as Timestamp,
            reviewedBy,
        });
    }

    /**
     * Reject location submission
     */
    static async rejectLocationSubmission(
        locationId: string,
        rejectionReason: string,
        reviewedBy: string
    ): Promise<void> {
        await this.updateLocationSubmission(locationId, {
            status: LocationStatus.REJECTED,
            rejectionReason,
            reviewedAt: serverTimestamp() as Timestamp,
            reviewedBy,
        });
    }

    /**
     * Search location submissions by name or neighborhood
     */
    static async searchLocationSubmissions(
        searchTerm: string,
        limitResults = 10
    ): Promise<LocationSubmission[]> {
        const nameQuery = query(
            this.collection,
            where('name', '>=', searchTerm),
            where('name', '<=', searchTerm + '\uf8ff'),
            limit(limitResults)
        );

        const neighborhoodQuery = query(
            this.collection,
            where('neighborhood', '>=', searchTerm),
            where('neighborhood', '<=', searchTerm + '\uf8ff'),
            limit(limitResults)
        );

        const [nameResults, neighborhoodResults] = await Promise.all([
            getDocs(nameQuery),
            getDocs(neighborhoodQuery)
        ]);

        const locations = new Map<string, LocationSubmission>();

        // Combine results and remove duplicates
        [...nameResults.docs, ...neighborhoodResults.docs].forEach(doc => {
            const data = doc.data();
            locations.set(doc.id, {
                id: doc.id,
                ...data,
                position: {
                    latitude: data.position.latitude,
                    longitude: data.position.longitude
                }
            } as LocationSubmission);
        });

        return Array.from(locations.values()).slice(0, limitResults);
    }

    /**
     * Get location submissions near a point
     */
    static async getLocationSubmissionsNearLocation(
        location: GeoPoint,
        radiusKm: number = 10,
        limitResults = 20
    ): Promise<LocationSubmission[]> {
        // Note: This is a simplified implementation
        // For production, consider using geohashing or a specialized geospatial database

        const allLocations = await this.getLocationSubmissions({
            status: LocationStatus.APPROVED,
            limit: limitResults * 2 // Get more to filter by distance
        });

        // Filter by distance
        return allLocations.filter(submission => {
            const distance = this.calculateDistance(location, submission.position);
            return distance <= radiusKm;
        }).slice(0, limitResults);
    }

    /**
     * Get location submission statistics
     */
    static async getLocationSubmissionStats(): Promise<{
        totalSubmissions: number;
        pendingSubmissions: number;
        approvedSubmissions: number;
        rejectedSubmissions: number;
    }> {
        const [pending, approved, rejected] = await Promise.all([
            this.getLocationSubmissions({ status: LocationStatus.PENDING }),
            this.getLocationSubmissions({ status: LocationStatus.APPROVED }),
            this.getLocationSubmissions({ status: LocationStatus.REJECTED })
        ]);

        return {
            totalSubmissions: pending.length + approved.length + rejected.length,
            pendingSubmissions: pending.length,
            approvedSubmissions: approved.length,
            rejectedSubmissions: rejected.length,
        };
    }

    /**
     * Get user's location submission statistics
     */
    static async getUserLocationSubmissionStats(userId: string): Promise<{
        totalSubmissions: number;
        pendingSubmissions: number;
        approvedSubmissions: number;
        rejectedSubmissions: number;
    }> {
        const [pending, approved, rejected] = await Promise.all([
            this.getUserLocationSubmissions(userId, LocationStatus.PENDING),
            this.getUserLocationSubmissions(userId, LocationStatus.APPROVED),
            this.getUserLocationSubmissions(userId, LocationStatus.REJECTED)
        ]);

        return {
            totalSubmissions: pending.length + approved.length + rejected.length,
            pendingSubmissions: pending.length,
            approvedSubmissions: approved.length,
            rejectedSubmissions: rejected.length,
        };
    }

    /**
     * Get locations by neighborhood
     */
    static async getLocationsByNeighborhood(neighborhood: string): Promise<LocationSubmission[]> {
        return this.getLocationSubmissions({
            neighborhood,
            status: LocationStatus.APPROVED
        });
    }

    /**
     * Calculate distance between two points (Haversine formula)
     */
    private static calculateDistance(point1: GeoPoint, point2: GeoPoint): number {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRad(point2.latitude - point1.latitude);
        const dLon = this.toRad(point2.longitude - point1.longitude);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(point1.latitude)) * Math.cos(this.toRad(point2.latitude)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private static toRad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    /**
     * Check if user can submit more locations (rate limiting)
     */
    static async canUserSubmitLocation(userId: string): Promise<boolean> {
        // Example: Allow max 5 pending submissions per user
        const pendingSubmissions = await this.getUserLocationSubmissions(userId, LocationStatus.PENDING);
        return pendingSubmissions.length < 5;
    }

    /**
     * Get recent location submissions
     */
    static async getRecentLocationSubmissions(
        days: number = 7,
        limitResults = 20
    ): Promise<LocationSubmission[]> {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - days);

        const q = query(
            this.collection,
            where('submittedAt', '>=', Timestamp.fromDate(daysAgo)),
            orderBy('submittedAt', 'desc'),
            limit(limitResults)
        );

        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                position: {
                    latitude: data.position.latitude,
                    longitude: data.position.longitude
                }
            } as LocationSubmission;
        });
    }
}
