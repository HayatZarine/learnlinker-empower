
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Search, Award, Clock, Lightbulb, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
        throw error;
      }
      
      if (!response || !response.teachers || !Array.isArray(response.teachers)) {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response format');
      }
      
      setMatchedTeachers(response.teachers);
      toast.success(`Found ${response.teachers.length} matching teachers for you!`);
      
    } catch (error) {
      console.error('Failed to find teachers:', error);
      setError("Couldn't find teachers at this time. Please try again later.");
      toast.error("Failed to find matching teachers. Please try again.");
    } finally {
      setIsLoading(false);
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
          We'll match you with the best teacher for your needs
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
            <h3 className="text-lg font-medium">Your Matched Teachers</h3>
            <div className="space-y-6">
              {matchedTeachers.map((teacher, index) => (
                <Card key={index} className="border border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{teacher.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      {teacher.expertise}
                    </CardDescription>
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
                    <p className="text-muted-foreground mt-2">"{teacher.bio}"</p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" className="w-full">Contact Teacher</Button>
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
                    <FormLabel>Grade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your grade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                          <SelectItem key={grade} value={grade.toString()}>
                            Grade {grade}
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
                        {["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "History", "Geography", "Literature"].map((subject) => (
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

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Finding Teachers..." : "Find Teacher"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default TeacherFinder;
