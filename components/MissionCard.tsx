import { formatCurrency } from "@/lib/utils";
import { Award, Clock, Coins, MapPin } from "lucide-react";
import React from "react";
import { Badge } from "./ui/Badge";
import Button from "./ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

export interface Mission {
  id: string;
  title: string;
  description: string;
  location: string;
  reward: number;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
  status: "Available" | "In Progress" | "Completed";
  nftReward?: boolean;
}

interface MissionCardProps {
  mission: Mission;
  onStart?: (missionId: string) => void;
  onView?: (missionId: string) => void;
}

const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  onStart,
  onView,
}) => {
  const difficultyColors = {
    Easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  const statusColors = {
    Available: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "In Progress":
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    Completed:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{mission.title}</CardTitle>
          <div className="flex space-x-2">
            <Badge className={difficultyColors[mission.difficulty]}>
              {mission.difficulty}
            </Badge>
            <Badge className={statusColors[mission.status]}>
              {mission.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {mission.description}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <MapPin className="h-4 w-4" />
            <span>{mission.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>{mission.estimatedTime}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-primary-600 dark:text-primary-400">
              <Coins className="h-4 w-4" />
              <span className="font-semibold">
                {formatCurrency(mission.reward)}
              </span>
            </div>
            {mission.nftReward && (
              <div className="flex items-center space-x-1 text-purple-600 dark:text-purple-400">
                <Award className="h-4 w-4" />
                <span className="text-sm">NFT</span>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            {mission.status === "Available" && onStart && (
              <Button size="sm" onClick={() => onStart(mission.id)}>
                Start Mission
              </Button>
            )}
            {onView && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(mission.id)}
              >
                View Details
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionCard;
