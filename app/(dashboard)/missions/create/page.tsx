"use client";

import MissionForm from "@/components/MissionForm";

const CreateMissionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Create Mission</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Propose an environmental cleanup mission and help make the world
            cleaner.
          </p>
        </div>

        <MissionForm />
      </div>
    </div>
  );
};

export default CreateMissionPage;
