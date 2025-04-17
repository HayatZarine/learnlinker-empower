
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";

const DifficultyTest = () => {
  const startTest = () => {
    // This will be implemented later with AI
    console.log("Starting difficulty test");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6" />
          Difficulty Assessment
        </CardTitle>
        <CardDescription>
          Take a quick test to determine your current learning level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={startTest}
          className="w-full"
        >
          Start Assessment
        </Button>
      </CardContent>
    </Card>
  );
};

export default DifficultyTest;
