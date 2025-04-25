import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Search, Award, Clock, Lightbulb, AlertCircle, User, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface TeacherFinderForm {
  grade: string;
  subject: string;
  difficultyLevel: string;
}

interface Teacher {
  name: string;
  expertise: string;
  experience: string;
  teachingStyle: string;
  availability: string;
  bio: string;
}

const TeacherFinder = () => {
  const form = useForm<TeacherFinderForm>({
    defaultValues: {
      grade: '',
      subject: '',
      difficultyLevel: 'Intermediate'
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [matchedTeachers, setMatchedTeachers] = useState<Teacher[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'unconfigured' | 'configured' | 'error'>('unconfigured');
  const navigate = useNavigate();

  const onSubmit = async (data: TeacherFinderForm) => {
    if (!data.grade) {
      toast.error("Please select a grade level");
      return;
    }
    if (!data.subject) {
      toast.error("Please select a subject");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setApiStatus('unconfigured');
    
    try {
      console.log("Finding teacher with:", data);
      
      const { data: response, error } = await supabase.functions.invoke('analyze-answer', {
        body: { 
          type: 'match',
          grade: data.grade, 
          subject: data.subject,
          difficultyLevel: data.difficultyLevel
        },
      });
      
      if (error) {
        console.error('Error from edge function:', error);
        setApiStatus('error');
        throw error;
      }

      if (response?.status === "error") {
        setApiStatus('error');
        throw new Error(response.message || "Failed to match teachers");
      }
      
      if (!response || !response.teachers || !Array.isArray(response.teachers)) {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response format');
      }
      
      setMatchedTeachers(response.teachers);
      setApiStatus('configured');
      toast.success(`Found ${response.teachers.length} matching teachers for you!`);
      
    } catch (error) {
      console.error('Failed to find teachers:', error);
      setError("Couldn't find teachers at this time. Please ensure the Groq API key is correctly set.");
      toast.error("Failed to find matching teachers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const testApiConnection = async () => {
    toast.info("Testing API connection...");
    setApiStatus('unconfigured');
    try {
      const { data, error } = await supabase.functions.invoke('analyze-answer', {
        body: { 
          type: 'match',
          grade: "1", 
          subject: "Mathematics",
          difficultyLevel: "Beginner"
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

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-6 w-6" />
          Find Your Perfect Teacher
        </CardTitle>
        <CardDescription>
          Tell us about your educational needs and we'll match you with teachers who can help you succeed
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {matchedTeachers.length > 0 ? (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Teachers Matched to Your Needs</h3>
            <div className="space-y-6">
              {matchedTeachers.map((teacher, index) => (
                <Card key={index} className="border border-primary/20">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {teacher.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          {teacher.expertise}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 pb-2 text-sm">
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Experience:</span> {teacher.experience}
                    </p>
                    <p className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Teaching Style:</span> {teacher.teachingStyle}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Availability:</span> {teacher.availability}
                    </p>
                    <div className="mt-2 pt-2 border-t border-gray-700">
                      <p className="text-sm font-medium mb-1">Bio</p>
                      <p className="text-xs text-muted-foreground">{teacher.bio}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1">View Profile</Button>
                    <Button 
                      variant="default" 
                      className="flex-1"
                      onClick={() => navigate(`/video-call/${index}`)}
                    >
                      Contact
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <Button 
              variant="secondary"
              onClick={() => setMatchedTeachers([])}
              className="w-full"
            >
              Search Again
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your grade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, "Graduate"].map((grade) => (
                          <SelectItem key={grade.toString()} value={grade.toString()}>
                            {typeof grade === 'number' ? `Grade ${grade}` : grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "History", "Geography", "Literature", "Arts"].map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficultyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Beginner", "Intermediate", "Advanced"].map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Finding Teachers..." : "Find Teachers"}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={testApiConnection}
                  className="w-full flex items-center justify-center gap-2"
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
            </form>
          </Form>
        )}
        
        {apiStatus !== 'unconfigured' && (
          <div className="mt-4 p-2 border rounded bg-background/50 flex items-center justify-between">
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
      </CardContent>
    </Card>
  );
};

export default TeacherFinder;
