
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Brain, AlertCircle, Check, CheckCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Question {
  text: string;
  difficulty: 'easy' | 'intermediate' | 'hard';
}

const DifficultyTest = () => {
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [testComplete, setTestComplete] = useState(false);
  const [finalLevel, setFinalLevel] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'unconfigured' | 'configured' | 'error'>('unconfigured');

  const generateQuestions = async (selectedSubject: string, selectedGrade: string) => {
    if (!selectedSubject) {
      toast.error("Please select a subject first");
      return;
    }
    
    if (!selectedGrade) {
      toast.error("Please select a grade level");
      return;
    }
    
    setError(null);
    setIsGeneratingQuestions(true);
    setApiStatus('unconfigured');
    
    try {
      console.log("Calling edge function to generate questions for:", selectedSubject);
      
      const { data, error } = await supabase.functions.invoke('analyze-answer', {
        body: { 
          type: 'generate', 
          subject: selectedSubject,
          grade: selectedGrade
        },
      });

      if (error) {
        console.error('Error from edge function:', error);
        setApiStatus('error');
        throw error;
      }

      if (data?.status === "error") {
        setApiStatus('error');
        throw new Error(data.message || "Failed to generate questions");
      }
      
      if (!data || !data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        console.error('Invalid response data:', data);
        throw new Error('Invalid response format from server');
      }
      
      console.log("Received questions:", data.questions);
      setQuestions(data.questions);
      setCurrentQuestionIndex(0);
      setAnswer('');
      setScores([]);
      setTestComplete(false);
      setFinalLevel(null);
      setApiStatus('configured');
      toast.success(`Generated ${data.questions.length} questions for ${selectedSubject}`);
    } catch (error) {
      console.error('Error generating questions:', error);
      setError("Failed to generate questions. Please ensure the Groq API key is correctly set.");
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
      
      if (data?.status === "error") {
        throw new Error(data.message || "Failed to evaluate answer");
      }
      
      if (!data || typeof data.score !== 'number') {
        throw new Error('Invalid response format from server');
      }
      
      const score = data.score;
      const newScores = [...scores, score];
      setScores(newScores);
      
      toast.success(`Your answer scored ${score}/5`, {
        description: `Question difficulty: ${currentQuestion.difficulty}`
      });

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setAnswer('');
      } else {
        // Test is complete, calculate final level
        const totalScore = newScores.reduce((sum, score) => sum + score, 0);
        const averageScore = totalScore / newScores.length;
        
        let level = "Beginner";
        if (averageScore >= 4) {
          level = "Advanced";
        } else if (averageScore >= 2.5) {
          level = "Intermediate";
        }
        
        setFinalLevel(level);
        setTestComplete(true);
        
        toast.success("Test Completed", {
          description: `Your assessed level: ${level}`
        });
      }
      
    } catch (error) {
      console.error('Error analyzing answer:', error);
      toast.error("Failed to analyze your answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const testApiConnection = async () => {
    toast.info("Testing API connection...");
    setApiStatus('unconfigured');
    try {
      const { data, error } = await supabase.functions.invoke('analyze-answer', {
        body: { 
          type: 'generate',
          subject: "Mathematics",
          grade: "1"
        },
      });
      
      if (error) {
        toast.error("API connection failed");
        setApiStatus('error');
        throw error;
      }
      
      if (data?.status === "error") {
        toast.error(`API connection failed: ${data.message || "Unknown error"}`);
        setApiStatus('error');
        return;
      }
      
      toast.success("API connection successful!");
      setApiStatus('configured');
    } catch (error) {
      console.error('API test failed:', error);
      setApiStatus('error');
      toast.error("API connection failed. Please check the API key.");
    }
  };

  const restartTest = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswer('');
    setScores([]);
    setTestComplete(false);
    setFinalLevel(null);
    setError(null);
    setApiStatus('unconfigured');
  };

  const getCorrectAnswersCount = () => {
    return scores.filter(score => score >= 3).length;
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
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
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
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="geography">Geography</SelectItem>
                  <SelectItem value="literature">Literature</SelectItem>
                  <SelectItem value="arts">Arts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Select Grade Level</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose grade level" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, "Graduate"].map((gradeNum) => (
                    <SelectItem key={gradeNum.toString()} value={gradeNum.toString()}>
                      {typeof gradeNum === 'number' ? `Grade ${gradeNum}` : gradeNum}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={() => generateQuestions(subject, grade)}
                className="w-full"
                disabled={!subject || !grade || isGeneratingQuestions}
              >
                {isGeneratingQuestions ? "Generating Questions..." : "Start Assessment"}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={testApiConnection}
                className="w-full flex items-center justify-center gap-2 mt-2"
              >
                {apiStatus === 'configured' ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    API Connected
                  </>
                ) : (
                  "Test API Connection"
                )}
              </Button>
            </div>
            
            {apiStatus !== 'unconfigured' && (
              <div className="mt-2 p-2 border rounded bg-background/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${apiStatus === 'configured' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm">{apiStatus === 'configured' ? 'API Connected' : 'API Error'}</span>
                </div>
                {apiStatus === 'error' && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={testApiConnection}
                    className="text-xs"
                  >
                    Retry
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : testComplete ? (
          <div className="space-y-6 text-center">
            <div className="py-8">
              <h3 className="text-2xl font-bold mb-2">Assessment Complete!</h3>
              <p className="text-muted-foreground mb-6">Based on your answers, your assessed level is:</p>
              <div className="text-3xl font-bold text-primary mb-4">{finalLevel}</div>
              <p className="mb-2">
                You scored a total of {scores.reduce((sum, score) => sum + score, 0)}/{5 * scores.length} points
              </p>
              <p className="text-sm text-muted-foreground">
                This assessment helps us match you with appropriate teachers and materials
              </p>
            </div>
            <Button onClick={restartTest} className="w-full">
              Take Another Assessment
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Badge variant="outline">Correct Answers: {getCorrectAnswersCount()}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Question</Label>
                <Badge variant={
                  questions[currentQuestionIndex].difficulty === 'easy' ? 'secondary' : 
                  questions[currentQuestionIndex].difficulty === 'intermediate' ? 'default' : 
                  'destructive'
                }>
                  {questions[currentQuestionIndex].difficulty.charAt(0).toUpperCase() + 
                  questions[currentQuestionIndex].difficulty.slice(1)} Level
                </Badge>
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
                onClick={restartTest}
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
            
            {apiStatus !== 'unconfigured' && (
              <div className="mt-2 p-2 border rounded bg-background/50 flex items-center">
                <div className={`w-3 h-3 rounded-full ${apiStatus === 'configured' ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                <span className="text-sm">{apiStatus === 'configured' ? 'API Connected' : 'API Error'}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DifficultyTest;
