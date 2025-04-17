
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DifficultyTest = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answer, setAnswer] = useState('');
  const { toast } = useToast();

  const analyzeAnswer = async () => {
    if (!answer.trim()) {
      toast({
        title: "Error",
        description: "Please provide an answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-answer', {
        body: { answer },
      });

      if (error) throw error;

      const score = parseInt(data.score);
      
      toast({
        title: "Analysis Complete",
        description: `Your answer indicates a difficulty level of ${score}/5`,
      });
      
    } catch (error) {
      console.error('Error analyzing answer:', error);
      toast({
        title: "Error",
        description: "Failed to analyze your answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6" />
          Difficulty Assessment
        </CardTitle>
        <CardDescription>
          Write a paragraph explaining a complex topic you understand well. 
          We'll analyze your response to determine your current learning level.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Start typing your explanation here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="min-h-[150px]"
        />
        <Button 
          onClick={analyzeAnswer}
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Analyzing..." : "Start Assessment"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DifficultyTest;
