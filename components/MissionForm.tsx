"use client";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import ImageUpload from "@/components/ui/ImageUpload";
import { useAuth } from "@/hooks/useAuth";
import { MissionService } from "@/lib/firebase/services/missions";
import { UploadedFile } from "@/lib/upload/api";
import { MissionLevel, MissionStatus } from "@/types/firebase";
import { Loader } from "@googlemaps/js-api-loader";
import { Calendar, Clock, DollarSign, MapPin, Save, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface MissionFormData {
  name: string;
  description: string;
  picture: string;
  address: string;
  position: {
    latitude: number;
    longitude: number;
  };
  deadline: string;
  duration: number;
  level: MissionLevel;
  amount: number;
  maxParticipants: number;
  requirements: string[];
  tags: string[];
}

const MissionForm: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [uploadError, setUploadError] = useState<string>("");

  const [formData, setFormData] = useState<MissionFormData>({
    name: "",
    description: "",
    picture: "",
    address: "",
    position: {
      latitude: 48.8566, // Paris by default
      longitude: 2.3522,
    },
    deadline: "",
    duration: 2,
    level: MissionLevel.MEDIUM,
    amount: 0.1,
    maxParticipants: 10,
    requirements: [],
    tags: [],
  });

  // Initialize Google Maps
  const initMap = async () => {
    try {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "demo_key",
        version: "weekly",
        libraries: ["places"],
      });

      await loader.load();

      const mapElement = document.getElementById("mission-map");
      if (mapElement) {
        const mapInstance = new google.maps.Map(mapElement, {
          center: formData.position,
          zoom: 13,
          styles: [
            {
              elementType: "geometry",
              stylers: [{ color: "#1f2937" }],
            },
            {
              elementType: "labels.text.stroke",
              stylers: [{ color: "#1f2937" }],
            },
            {
              elementType: "labels.text.fill",
              stylers: [{ color: "#f3f4f6" }],
            },
          ],
        });

        setMap(mapInstance);

        // Add initial marker
        const initialMarker = new google.maps.Marker({
          position: formData.position,
          map: mapInstance,
          title: "Mission location",
          draggable: true,
        });

        setMarker(initialMarker);

        // Écouter les clics sur la carte
        mapInstance.addListener("click", (event: google.maps.MapMouseEvent) => {
          const lat = event.latLng?.lat();
          const lng = event.latLng?.lng();

          if (lat && lng) {
            updateMarkerPosition(lat, lng, mapInstance, initialMarker);
          }
        });

        // Écouter le glissement du marker
        initialMarker.addListener("dragend", () => {
          const position = initialMarker.getPosition();
          if (position) {
            updateMarkerPosition(
              position.lat(),
              position.lng(),
              mapInstance,
              initialMarker
            );
          }
        });
      }
    } catch (error) {
      console.error("Error loading Google Maps:", error);
    }
  };

  const updateMarkerPosition = (
    lat: number,
    lng: number,
    mapInstance: google.maps.Map,
    marker: google.maps.Marker
  ) => {
    const newPosition = { lat, lng };
    marker.setPosition(newPosition);

    // Géocodage inverse pour obtenir l'adresse
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: newPosition }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        setFormData((prev) => ({
          ...prev,
          position: { latitude: lat, longitude: lng },
          address: results[0].formatted_address,
        }));
      }
    });
  };

  const handleImageUpload = (result: UploadedFile) => {
    setFormData((prev) => ({
      ...prev,
      picture: result.url,
    }));
    setUploadError("");
  };

  const handleImageUploadError = (error: string) => {
    setUploadError(error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to create a mission");
      return;
    }

    if (!formData.picture) {
      setUploadError("An image is required for the mission");
      return;
    }

    setIsSubmitting(true);

    try {
      const deadline = new Date(formData.deadline);

      const missionData = {
        name: formData.name,
        description: formData.description,
        picture: formData.picture,
        address: formData.address,
        position: formData.position,
        deadline: deadline,
        duration: formData.duration,
        level: formData.level,
        status: MissionStatus.PENDING,
        proposerId: user.uid,
        isVisible: true,
        amount: formData.amount,
        maxParticipants: formData.maxParticipants,
        currentParticipants: 0,
        tags: formData.tags,
        requirements: formData.requirements,
      };

      const missionId = await MissionService.createMission(missionData);

      alert("Mission created successfully!");
      router.push(`/missions`);
    } catch (error) {
      console.error("Error creating mission:", error);
      alert("Error creating mission");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-primary-600" />
            <span>Create a new mission</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mission Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ex: Central park cleanup"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={formData.level}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      level: e.target.value as MissionLevel,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value={MissionLevel.EASY}>Easy</option>
                  <option value={MissionLevel.MEDIUM}>Medium</option>
                  <option value={MissionLevel.HIGH}>Hard</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe in detail the mission and tasks to accomplish..."
              />
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mission Image *
              </label>
              <ImageUpload
                onUploadComplete={handleImageUpload}
                onUploadError={handleImageUploadError}
                placeholder="Add a photo of the location to clean"
                className="w-full"
                maxFileSize={10}
                acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
              />
              {uploadError && (
                <p className="text-red-600 text-sm mt-2">{uploadError}</p>
              )}
            </div>

            {/* Time and financial details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Duration (hours)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      deadline: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Reward (ETH)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      amount: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Maximum participants */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Maximum number of participants
              </label>
              <input
                type="number"
                min="1"
                value={formData.maxParticipants}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    maxParticipants: parseInt(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mission Location
              </label>
              <div className="space-y-4">
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  placeholder="Mission address"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div
                  id="mission-map"
                  className="w-full h-64 rounded-lg border border-gray-300 dark:border-gray-600"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={initMap}
                  className="w-full"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Load Map
                </Button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.picture}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Mission
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MissionForm;
