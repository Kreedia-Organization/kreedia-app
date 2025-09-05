"use client";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import ImageUpload from "@/components/ui/ImageUpload";
import { useAuth } from "@/hooks/useAuth";
import { CloudinaryUploadResult } from "@/lib/cloudinary/upload";
import { LocationSubmissionService } from "@/lib/firebase/services/locationSubmissions";
import { LocationStatus } from "@/types/firebase";
import { Loader } from "@googlemaps/js-api-loader";
import { GeoPoint, Timestamp } from "firebase/firestore";
import { Camera, CheckCircle, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

// Déclarations de types pour Google Maps
declare global {
  interface Window {
    google: any;
  }
}

type MapType = any;
type MarkerType = any;
type MapMouseEventType = any;
type GeocoderType = any;

interface LocationData {
  lat: number;
  lng: number;
  address: string;
  neighborhood: string;
}

const AddLocationPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapType | null>(null);
  const [marker, setMarker] = useState<MarkerType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [formData, setFormData] = useState({
    imageUrl: "",
    location: null as LocationData | null,
    neighborhood: "",
    fullAddress: "",
    canWork: false,
  });

  // Initialisation de Google Maps
  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "demo_key",
        version: "weekly",
        libraries: ["places"],
      });

      try {
        await loader.load();

        if (
          mapRef.current &&
          typeof window !== "undefined" &&
          (window as any).google
        ) {
          const google = (window as any).google;

          const mapInstance = new google.maps.Map(mapRef.current, {
            center: { lat: 40.7128, lng: -74.006 }, // New York par défaut
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
              // Thème sombre pour la carte
            ],
          });

          setMap(mapInstance);

          // Ajout du listener pour la sélection de l'emplacement
          mapInstance.addListener("click", (event: MapMouseEventType) => {
            const lat = event.latLng?.lat();
            const lng = event.latLng?.lng();

            if (lat && lng) {
              // Mise à jour du marqueur
              if (marker) {
                marker.setPosition(event.latLng);
              } else {
                const newMarker = new google.maps.Marker({
                  position: event.latLng,
                  map: mapInstance,
                  title: "Emplacement sélectionné",
                });
                setMarker(newMarker);
              }

              // Récupération de l'adresse à partir des coordonnées
              const geocoder = new google.maps.Geocoder();
              geocoder.geocode(
                { location: event.latLng },
                (results: any, status: any) => {
                  if (status === "OK" && results?.[0]) {
                    const address = results[0].formatted_address;
                    setFormData((prev) => ({
                      ...prev,
                      location: {
                        lat,
                        lng,
                        address,
                        neighborhood: prev.neighborhood,
                      },
                      fullAddress: address,
                    }));
                  }
                }
              );
            }
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement de Google Maps :", error);
      }
    };

    initMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marker]);

  const handleImageUpload = (result: CloudinaryUploadResult) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: result.secure_url,
    }));
    setUploadError("");
  };

  const handleImageUploadError = (error: string) => {
    setUploadError(error);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      alert("Vous devez être connecté pour soumettre un emplacement");
      return;
    }

    if (!formData.imageUrl || !formData.location || !formData.neighborhood) {
      alert("Veuillez remplir tous les champs requis");
      return;
    }

    setIsLoading(true);

    try {
      const locationData = {
        userId: user.uid,
        name: formData.neighborhood,
        description: `Emplacement proposé dans le quartier ${formData.neighborhood}`,
        image: formData.imageUrl,
        position: new GeoPoint(formData.location.lat, formData.location.lng),
        address: formData.fullAddress,
        neighborhood: formData.neighborhood,
        canWork: formData.canWork,
        category: "cleanup",
        priority: 1,
        status: LocationStatus.PENDING,
        submittedAt: Timestamp.now(),
      } as const;

      await LocationSubmissionService.submitLocation(locationData);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Erreur lors de la soumission de l'emplacement :", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Emplacement ajouté avec succès !
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Votre emplacement a été soumis pour validation. Merci de patienter
              24h pour l'approbation.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/my-locations")}
                className="w-full"
              >
                Voir mes emplacements
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="w-full"
              >
                Retour au tableau de bord
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Ajouter un nouvel emplacement
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Soumettez un nouvel emplacement pour les missions de nettoyage
          environnemental
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colonne gauche - Formulaire */}
          <div className="space-y-6">
            {/* Téléversement d'image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="h-5 w-5" />
                  <span>Image de l'emplacement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  onUploadComplete={handleImageUpload}
                  onUploadError={handleImageUploadError}
                  uploadOptions={{
                    preset: "LOCATIONS",
                    folder: "locations",
                    tags: ["location", user?.uid || "anonymous"],
                  }}
                  placeholder="Téléversez une image de l'emplacement"
                  className="w-full"
                />
                {uploadError && (
                  <p className="text-red-600 text-sm mt-2">{uploadError}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Assurez-vous d'être physiquement présent sur le lieu
                </p>
              </CardContent>
            </Card>

            {/* Détails de l'emplacement */}
            <Card>
              <CardHeader>
                <CardTitle>Détails de l'emplacement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nom du quartier *
                  </label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        neighborhood: e.target.value,
                      }))
                    }
                    placeholder="ex : Central Park, Centre-ville..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Adresse complète
                  </label>
                  <input
                    type="text"
                    value={formData.fullAddress}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fullAddress: e.target.value,
                      }))
                    }
                    placeholder="Cliquez sur la carte ou saisissez manuellement..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {formData.location && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      Emplacement sélectionné :{" "}
                      {formData.location.lat.toFixed(6)},{" "}
                      {formData.location.lng.toFixed(6)}
                    </p>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="canWork"
                    checked={formData.canWork}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        canWork: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                    required
                  />
                  <label htmlFor="canWork" className="text-sm text-foreground">
                    Je suis capable d'intervenir moi-même sur ce lieu *
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne droite - Carte */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Sélectionnez l'emplacement sur la carte</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={mapRef}
                className="w-full h-96 rounded-lg border border-gray-300 dark:border-gray-600"
              />
              <p className="text-xs text-gray-500 mt-2">
                Cliquez sur la carte pour sélectionner l'emplacement exact
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bouton de soumission */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={
              isLoading ||
              !formData.imageUrl ||
              !formData.location ||
              !formData.canWork
            }
            className="px-8"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Envoi en cours...</span>
              </div>
            ) : (
              "Soumettre l'emplacement"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddLocationPage;
