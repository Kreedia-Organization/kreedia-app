"use client";

import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  MapPin,
  Plus,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface SubmittedLocation {
  id: string;
  image: string;
  neighborhood: string;
  fullAddress: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: Date;
  reviewedAt?: Date;
  rejectionReason?: string;
  location: {
    lat: number;
    lng: number;
  };
}

// Mock data for submitted locations
const mockSubmittedLocations: SubmittedLocation[] = [
  {
    id: "1",
    image: "/icon.png",
    neighborhood: "Central Park West",
    fullAddress: "Central Park West, New York, NY 10023, USA",
    status: "approved",
    submittedAt: new Date("2024-03-10"),
    reviewedAt: new Date("2024-03-11"),
    location: { lat: 40.7829, lng: -73.9654 },
  },
  {
    id: "2",
    image: "/icon.png",
    neighborhood: "Brooklyn Bridge Park",
    fullAddress: "Brooklyn Bridge Park, Brooklyn, NY 11201, USA",
    status: "pending",
    submittedAt: new Date("2024-03-15"),
    location: { lat: 40.7024, lng: -73.9969 },
  },
  {
    id: "3",
    image: "/icon.png",
    neighborhood: "Times Square",
    fullAddress: "Times Square, New York, NY 10036, USA",
    status: "rejected",
    submittedAt: new Date("2024-03-08"),
    reviewedAt: new Date("2024-03-09"),
    rejectionReason:
      "Location is too crowded and may pose safety risks for cleanup activities. Please consider a nearby park or less busy area.",
    location: { lat: 40.758, lng: -73.9855 },
  },
  {
    id: "4",
    image: "/icon.png",
    neighborhood: "Washington Square Park",
    fullAddress: "Washington Square Park, New York, NY 10012, USA",
    status: "pending",
    submittedAt: new Date("2024-03-16"),
    location: { lat: 40.7308, lng: -73.9973 },
  },
];

const MyLocationsPage: React.FC = () => {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] =
    useState<SubmittedLocation | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Under Review
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            Unknown
          </Badge>
        );
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Locations</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track the status of your submitted locations
          </p>
        </div>
        <Button
          onClick={() => router.push("/add-location")}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Location</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Submitted
                </p>
                <p className="text-xl font-bold text-foreground">
                  {mockSubmittedLocations.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Approved
                </p>
                <p className="text-xl font-bold text-foreground">
                  {
                    mockSubmittedLocations.filter(
                      (l) => l.status === "approved"
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pending
                </p>
                <p className="text-xl font-bold text-foreground">
                  {
                    mockSubmittedLocations.filter((l) => l.status === "pending")
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Rejected
                </p>
                <p className="text-xl font-bold text-foreground">
                  {
                    mockSubmittedLocations.filter(
                      (l) => l.status === "rejected"
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Locations List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockSubmittedLocations.map((location) => (
          <Card key={location.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={location.image}
                    alt={location.neighborhood}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">
                      {location.neighborhood}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {location.fullAddress.length > 40
                        ? `${location.fullAddress.substring(0, 40)}...`
                        : location.fullAddress}
                    </p>
                  </div>
                </div>
                {getStatusBadge(location.status)}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Status Details */}
              <div className="flex items-center space-x-2">
                {getStatusIcon(location.status)}
                <div className="flex-1">
                  {location.status === "pending" && (
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Under Review
                      </p>
                      <p className="text-xs text-gray-500">
                        Submitted {getTimeAgo(location.submittedAt)}
                      </p>
                    </div>
                  )}

                  {location.status === "approved" && (
                    <div>
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">
                        Location Approved
                      </p>
                      <p className="text-xs text-gray-500">
                        Reviewed on {formatDate(location.reviewedAt!)}
                      </p>
                    </div>
                  )}

                  {location.status === "rejected" && (
                    <div>
                      <p className="text-sm font-medium text-red-700 dark:text-red-300">
                        Location Rejected
                      </p>
                      <p className="text-xs text-gray-500">
                        Reviewed on {formatDate(location.reviewedAt!)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Rejection Reason */}
              {location.status === "rejected" && location.rejectionReason && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    <strong>Rejection Reason:</strong>{" "}
                    {location.rejectionReason}
                  </p>
                </div>
              )}

              {/* Submission Details */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Submitted: {formatDate(location.submittedAt)}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLocation(location)}
                  className="h-7 px-2"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockSubmittedLocations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No Locations Submitted
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start by adding your first location for environmental cleanup
            </p>
            <Button onClick={() => router.push("/add-location")}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Location
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Location Details Modal (simplified) */}
      {selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Location Details</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLocation(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <img
                src={selectedLocation.image}
                alt={selectedLocation.neighborhood}
                className="w-full h-48 object-cover rounded-lg"
              />

              <div>
                <h3 className="font-semibold text-foreground">
                  {selectedLocation.neighborhood}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedLocation.fullAddress}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm">Status:</span>
                {getStatusBadge(selectedLocation.status)}
              </div>

              <div className="text-sm">
                <p>
                  <strong>Coordinates:</strong>{" "}
                  {selectedLocation.location.lat.toFixed(6)},{" "}
                  {selectedLocation.location.lng.toFixed(6)}
                </p>
                <p>
                  <strong>Submitted:</strong>{" "}
                  {formatDate(selectedLocation.submittedAt)}
                </p>
                {selectedLocation.reviewedAt && (
                  <p>
                    <strong>Reviewed:</strong>{" "}
                    {formatDate(selectedLocation.reviewedAt)}
                  </p>
                )}
              </div>

              {selectedLocation.rejectionReason && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    <strong>Rejection Reason:</strong>{" "}
                    {selectedLocation.rejectionReason}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MyLocationsPage;
