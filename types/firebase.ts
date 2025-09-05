import { Timestamp } from 'firebase/firestore';

// Base types for Firestore documents
export interface FirestoreDocument {
    id: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// User status enum
export enum UserStatus {
    ACTIVE = 'ACTIVE',
    BLOCKED = 'BLOCKED',
    IN_REVIEW = 'IN_REVIEW'
}

// User gender enum
export enum UserGender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
    PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY'
}

// User document interface
export interface User extends FirestoreDocument {
    name: string;
    email: string;
    phone?: string;
    gender?: UserGender;
    walletAddress?: string;
    ensName?: string;
    status: UserStatus;
    profileImage?: string;
    // Additional user fields
    totalMissionsCompleted?: number;
    totalRewardsEarned?: number;
    level?: number;
    badges?: string[];
}

// Mission difficulty enum
export enum MissionLevel {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
}

// Mission status enum
export enum MissionStatus {
    PENDING = 'PENDING',
    VERIFIED = 'VERIFIED',
    REJECTED = 'REJECTED',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    EXPIRED = 'EXPIRED'
}

// GeoPoint for Firestore
export interface GeoPoint {
    latitude: number;
    longitude: number;
}

// Mission document interface
export interface Mission extends FirestoreDocument {
    name: string;
    description: string;
    picture: string;
    position: GeoPoint;
    address: string;
    deadline: Timestamp;
    duration: number; // Duration in hours
    level: MissionLevel;
    status: MissionStatus;
    proposerId: string; // Reference to User ID
    isVisible: boolean;
    amount: number; // Reward amount
    validatedAt?: Timestamp;
    // Additional mission fields
    maxParticipants?: number;
    currentParticipants?: number;
    tags?: string[];
    requirements?: string[];
    completionCriteria?: string[];
}

// Mission user participation status enum
export enum MissionUserStatus {
    APPLIED = 'APPLIED',
    ACCEPTED = 'ACCEPTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    REJECTED = 'REJECTED',
    WITHDRAWN = 'WITHDRAWN'
}

// Mission-User relationship document interface
export interface MissionUser extends FirestoreDocument {
    userId: string; // Reference to User ID
    missionId: string; // Reference to Mission ID
    status: MissionUserStatus;
    appliedAt: Timestamp;
    acceptedAt?: Timestamp;
    completedAt?: Timestamp;
    rejectedAt?: Timestamp;
    rejectionReason?: string;
    // Proof of completion
    completionProof?: {
        images?: string[];
        description?: string;
        location?: GeoPoint;
        timestamp: Timestamp;
    };
    // Rating and feedback
    userRating?: number; // Rating given by mission proposer
    proposerRating?: number; // Rating given by user
    feedback?: string;
}

// Location submission status enum
export enum LocationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

// Location submission document interface
export interface LocationSubmission extends FirestoreDocument {
    userId: string; // Reference to User ID
    name: string;
    description?: string;
    image: string;
    position: GeoPoint;
    address: string;
    neighborhood: string;
    status: LocationStatus;
    submittedAt: Timestamp;
    reviewedAt?: Timestamp;
    reviewedBy?: string; // Reference to Admin User ID
    rejectionReason?: string;
    canWork: boolean; // User can work at this location
    // Additional metadata
    category?: string;
    estimatedCleanupTime?: number;
    difficultyLevel?: MissionLevel;
    priority?: number;
}

// NFT document interface
export interface NFT extends FirestoreDocument {
    name: string;
    description: string;
    image: string;
    tokenId: string;
    contractAddress: string;
    ownerId: string; // Reference to User ID
    metadata: Record<string, any>;
    mintedAt: Timestamp;
    // Environmental impact tracking
    missionId?: string; // Reference to Mission that earned this NFT
    impactData?: {
        co2Reduced?: number;
        wasteCollected?: number;
        treesPlanted?: number;
        waterSaved?: number;
    };
}

// Transaction document interface
export interface Transaction extends FirestoreDocument {
    userId: string; // Reference to User ID
    type: 'REWARD' | 'PAYMENT' | 'WITHDRAWAL' | 'STAKING';
    amount: number;
    currency: 'ETH' | 'USDT' | 'USDC' | 'DAI' | 'KREEDIA';
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    transactionHash?: string;
    missionId?: string; // Reference to Mission ID if applicable
    description: string;
    metadata?: Record<string, any>;
}

// Analytics and stats interfaces
export interface UserStats {
    userId: string;
    totalMissions: number;
    completedMissions: number;
    pendingMissions: number;
    rejectedMissions: number;
    totalRewards: number;
    totalNFTs: number;
    averageRating: number;
    carbonFootprintReduced: number;
    wasteCollected: number;
    lastUpdated: Timestamp;
}

export interface MissionStats {
    missionId: string;
    totalApplications: number;
    acceptedApplications: number;
    completedApplications: number;
    averageCompletionTime: number;
    averageRating: number;
    lastUpdated: Timestamp;
}

// Notification document interface
export interface Notification extends FirestoreDocument {
    userId: string; // Reference to User ID
    title: string;
    message: string;
    type: 'MISSION_UPDATE' | 'REWARD' | 'SYSTEM' | 'REMINDER';
    isRead: boolean;
    actionUrl?: string;
    metadata?: Record<string, any>;
}

// Collection names constants
export const COLLECTIONS = {
    USERS: 'users',
    MISSIONS: 'missions',
    MISSION_USERS: 'mission_users',
    LOCATION_SUBMISSIONS: 'location_submissions',
    NFTS: 'nfts',
    TRANSACTIONS: 'transactions',
    USER_STATS: 'user_stats',
    MISSION_STATS: 'mission_stats',
    NOTIFICATIONS: 'notifications'
} as const;

// Type helpers for Firestore operations
export type CreateUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserData = Partial<CreateUserData>;

export type CreateMissionData = Omit<Mission, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMissionData = Partial<CreateMissionData>;

export type CreateMissionUserData = Omit<MissionUser, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMissionUserData = Partial<CreateMissionUserData>;

export type CreateLocationSubmissionData = Omit<LocationSubmission, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateLocationSubmissionData = Partial<CreateLocationSubmissionData>;
