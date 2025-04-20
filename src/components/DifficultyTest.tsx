
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Question {
  text: string;
  difficulty: 'easy' | 'intermediate' | 'hard';
}

const DifficultyTest = () => {
  const [subject, setSubject] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  const generateQuestions = async (selectedSubject: string) => {
    if (!selectedSubject) {
      toast.error("Please select a subject first");
      return;
    }
    
    setIsGeneratingQuestions(true);
    try {
      console.log("Calling edge function to generate questions for:", selectedSubject);
      
      const { data, error } = await supabase.functions.invoke('analyze-answer', {
        body: { 
          type: 'generate', 
          subject: selectedSubject 
        },
      });

      if (error) {
        console.error('Error from edge function:', error);
        throw error;
      }
      
      if (!data || !data.questions) {
        console.error('Invalid response data:', data);
        throw new Error('Invalid response format from server');
      }
      
      console.log("Received questions:", data.questions);
      setQuestions(data.questions);
      setCurrentQuestionIndex(0);
      setAnswer('');
      toast.success(`Generated ${data.questions.length} questions for ${selectedSubject}`);
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error("Failed to generate questions. Please try again.");
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const analyzeAnswer = async () => {
    if (!answer.trim()) {
      toast.error("Please provide an answer before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const currentQuestion = questions[currentQuestionIndex];
      console.log("Evaluating answer for question:", currentQuestion.text);
      
      const { data, error } = await supabase.functions.invoke('analyze-answer', {
        body: { 
          type: 'evaluate',
          answer,
          questionDifficulty: currentQuestion.difficulty 
        },
      });

      if (error) throw error;
      
      const score = data.score;
      toast.success(`Your answer scored ${score}/5`, {
        description: `Question difficulty: ${currentQuestion.difficulty}`
      });

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setAnswer('');
      } else {
        toast.success("Test Completed", {
          description: "You've completed all questions!"
        });
      }
      
    } catch (error) {
      console.error('Error analyzing answer:', error);
      toast.error("Failed to analyze your answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6" />
          Subject Knowledge Assessment
        </CardTitle>
        <CardDescription>
          Answer a series of questions of varying difficulty levels to assess your knowledge.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {questions.length === 0 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select a Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => generateQuestions(subject)}
              className="w-full"
              disabled={!subject || isGeneratingQuestions}
            >
              {isGeneratingQuestions ? "Generating Questions..." : "Start Assessment"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Question {currentQuestionIndex + 1} of {questions.length}</Label>
                <span className="text-sm text-muted-foreground capitalize">
                  {questions[currentQuestionIndex].difficulty} Level
                </span>
              </div>
              <p className="text-lg font-medium">
                {questions[currentQuestionIndex].text}
              </p>
            </div>
            <Textarea
              placeholder="Type your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="min-h-[150px]"
            />
            <div className="flex justify-between gap-4">
              <Button 
                onClick={() => {
                  setQuestions([]);
                  setAnswer('');
                  setCurrentQuestionIndex(0);
                }}
                variant="outline"
              >
                Start Over
              </Button>
              <Button 
                onClick={analyzeAnswer}
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Analyzing..." : "Submit Answer"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DifficultyTest;
