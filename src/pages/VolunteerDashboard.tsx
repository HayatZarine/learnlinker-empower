
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { MultiSelect } from "@/components/MultiSelect";
import { Plus, FileText, TestTube, Clock, User, BookOpen, Sparkles } from "lucide-react";

const SUBJECT_OPTIONS = [
  'Mathematics', 
  'Science', 
  'English', 
  'History', 
  'Computer Science', 
  'Physics', 
  'Chemistry', 
  'Biology', 
  'Geography', 
  'Economics', 
  'Programming', 
  'Foreign Languages'
];

const VolunteerDashboard = () => {
  const { user } = useAuth();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [grade, setGrade] = useState('');
  const [teachingExperience, setTeachingExperience] = useState('');
  const [teachingMethods, setTeachingMethods] = useState('');
  const [availabilityHours, setAvailabilityHours] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState<any[]>([]);

  // Resource creation states
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [testSubject, setTestSubject] = useState('');
  const [testGrade, setTestGrade] = useState('');
  const [testTopic, setTestTopic] = useState('');
  const [testDifficulty, setTestDifficulty] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteSubject, setNoteSubject] = useState('');
  const [noteGrade, setNoteGrade] = useState('');
  const [useAIForNotes, setUseAIForNotes] = useState(false);
  const [creatingResource, setCreatingResource] = useState(false);

  const GRADE_OPTIONS = [
    'Elementary (K-5)',
    'Middle School (6-8)', 
    'High School (9-12)',
    'College/University',
    'Adult Education'
  ];

  const TIME_SLOTS = [
    'Morning (6AM-12PM)',
    'Afternoon (12PM-6PM)', 
    'Evening (6PM-10PM)',
    'Late Night (10PM-12AM)'
  ];

  useEffect(() => {
    const fetchVolunteerProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setSelectedSubjects(data.subjects || []);
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setGrade(data.grade || '');
        setTeachingExperience(data.teaching_experience || '');
        setTeachingMethods(data.teaching_methods || '');
        setAvailabilityHours((data.availability_hours as string[]) || []);
      }

      if (error) {
        toast({
          title: "Error fetching profile",
          description: error.message,
          variant: "destructive"
        });
      }
    };

    const fetchResources = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('educational_resources')
        .select('*')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setResources(data);
      }
    };

    fetchVolunteerProfile();
    fetchResources();
  }, [user]);

  const handleAvailabilityChange = (timeSlot: string, checked: boolean) => {
    if (checked) {
      setAvailabilityHours([...availabilityHours, timeSlot]);
    } else {
      setAvailabilityHours(availabilityHours.filter(slot => slot !== timeSlot));
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ 
        subjects: selectedSubjects,
        first_name: firstName,
        last_name: lastName,
        grade: grade,
        teaching_experience: teachingExperience,
        teaching_methods: teachingMethods,
        availability_hours: availabilityHours,
        role: 'volunteer' 
      })
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Profile Updated",
        description: "Your volunteer profile has been successfully updated.",
      });
    }
    setLoading(false);
  };

  const handleCreateTest = async () => {
    if (!user || !testSubject || !testTopic) return;

    setCreatingResource(true);
    try {
      // Generate AI test content
      const testContent = `Test on ${testTopic} for ${testGrade || 'General'} level ${testSubject}`;
      
      const { error } = await supabase
        .from('educational_resources')
        .insert({
          teacher_id: user.id,
          title: `${testSubject} Test: ${testTopic}`,
          content: testContent,
          type: 'test',
          subject: testSubject,
          grade: testGrade,
          is_ai_generated: true
        });

      if (error) throw error;

      toast({
        title: "Test Created",
        description: "AI-generated test has been created successfully.",
      });

      // Reset form and close dialog
      setTestSubject('');
      setTestGrade('');
      setTestTopic('');
      setTestDifficulty('');
      setShowTestDialog(false);
      
      // Refresh resources
      const { data } = await supabase
        .from('educational_resources')
        .select('*')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });
      
      if (data) setResources(data);
    } catch (error: any) {
      toast({
        title: "Error creating test",
        description: error.message,
        variant: "destructive"
      });
    }
    setCreatingResource(false);
  };

  const handleCreateNotes = async () => {
    if (!user || !noteTitle || !noteSubject) return;

    setCreatingResource(true);
    try {
      let finalContent = noteContent;
      
      // If AI generation is requested, generate content
      if (useAIForNotes && !noteContent) {
        finalContent = `AI-generated notes for ${noteTitle} in ${noteSubject}`;
      }

      const { error } = await supabase
        .from('educational_resources')
        .insert({
          teacher_id: user.id,
          title: noteTitle,
          content: finalContent,
          type: 'note',
          subject: noteSubject,
          grade: noteGrade,
          is_ai_generated: useAIForNotes
        });

      if (error) throw error;

      toast({
        title: "Notes Created",
        description: "Notes have been created successfully.",
      });

      // Reset form and close dialog
      setNoteTitle('');
      setNoteContent('');
      setNoteSubject('');
      setNoteGrade('');
      setUseAIForNotes(false);
      setShowNotesDialog(false);
      
      // Refresh resources
      const { data } = await supabase
        .from('educational_resources')
        .select('*')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });
      
      if (data) setResources(data);
    } catch (error: any) {
      toast({
        title: "Error creating notes",
        description: error.message,
        variant: "destructive"
      });
    }
    setCreatingResource(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Volunteer Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your teaching profile and create educational resources for students
          </p>
        </div>

        {/* Profile Information */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              Teaching Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User className="h-4 w-4" />
                Personal Information
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Teaching Preferences */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                Teaching Preferences
              </div>
              <div className="space-y-4 pl-6">
                <div>
                  <Label htmlFor="grade">Grade Level You Prefer to Teach</Label>
                  <Select value={grade} onValueChange={setGrade}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      {GRADE_OPTIONS.map(option => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Subjects You Want to Teach</Label>
                  <div className="mt-1.5">
                    <MultiSelect 
                      options={SUBJECT_OPTIONS}
                      value={selectedSubjects}
                      onChange={setSelectedSubjects}
                      placeholder="Select subjects"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4" />
                Availability Schedule
              </div>
              <div className="pl-6">
                <Label>Available Time Slots</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {TIME_SLOTS.map(slot => (
                    <div key={slot} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                      <Checkbox
                        id={slot}
                        checked={availabilityHours.includes(slot)}
                        onCheckedChange={(checked) => handleAvailabilityChange(slot, checked as boolean)}
                      />
                      <Label htmlFor={slot} className="flex-1 cursor-pointer">{slot}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Experience & Methods */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileText className="h-4 w-4" />
                Teaching Background
              </div>
              <div className="space-y-4 pl-6">
                <div>
                  <Label htmlFor="experience">Teaching Experience</Label>
                  <Textarea
                    id="experience"
                    value={teachingExperience}
                    onChange={(e) => setTeachingExperience(e.target.value)}
                    placeholder="Describe your teaching experience, qualifications, and background..."
                    rows={4}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="methods">Teaching Methods & Approach</Label>
                  <Textarea
                    id="methods"
                    value={teachingMethods}
                    onChange={(e) => setTeachingMethods(e.target.value)}
                    placeholder="Describe your teaching style, methods, and how you like to engage with students..."
                    rows={4}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSaveProfile} 
              disabled={loading}
              className="w-full h-12 text-base font-medium"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Saving Profile...
                </div>
              ) : (
                "Save Profile"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Educational Resources */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <TestTube className="h-5 w-5 text-primary" />
              </div>
              Educational Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border-primary/20">
                      <Sparkles className="h-4 w-4" />
                      Create AI Test
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <TestTube className="h-5 w-5" />
                        Create AI-Generated Test
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label htmlFor="testSubject">Subject</Label>
                        <Select value={testSubject} onValueChange={setTestSubject}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {SUBJECT_OPTIONS.map(subject => (
                              <SelectItem key={subject} value={subject}>
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="testGrade">Grade Level</Label>
                        <Select value={testGrade} onValueChange={setTestGrade}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade level (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            {GRADE_OPTIONS.map(grade => (
                              <SelectItem key={grade} value={grade}>
                                {grade}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="testTopic">Topic/Chapter</Label>
                        <Input
                          id="testTopic"
                          value={testTopic}
                          onChange={(e) => setTestTopic(e.target.value)}
                          placeholder="e.g., Algebra, World War II, Cell Biology"
                        />
                      </div>

                      <div>
                        <Label htmlFor="testDifficulty">Difficulty Level</Label>
                        <Select value={testDifficulty} onValueChange={setTestDifficulty}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={handleCreateTest}
                          disabled={creatingResource || !testSubject || !testTopic}
                          className="flex-1"
                        >
                          {creatingResource ? "Generating..." : "Generate Test"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowTestDialog(false)}
                          disabled={creatingResource}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 bg-gradient-to-r from-secondary/10 to-secondary/5 hover:from-secondary/20 hover:to-secondary/10 border-secondary/20">
                      <BookOpen className="h-4 w-4" />
                      Create Notes
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Create Study Notes
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label htmlFor="noteTitle">Note Title</Label>
                        <Input
                          id="noteTitle"
                          value={noteTitle}
                          onChange={(e) => setNoteTitle(e.target.value)}
                          placeholder="e.g., Introduction to Calculus, History of Rome"
                        />
                      </div>

                      <div>
                        <Label htmlFor="noteSubject">Subject</Label>
                        <Select value={noteSubject} onValueChange={setNoteSubject}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {SUBJECT_OPTIONS.map(subject => (
                              <SelectItem key={subject} value={subject}>
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="noteGrade">Grade Level</Label>
                        <Select value={noteGrade} onValueChange={setNoteGrade}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade level (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            {GRADE_OPTIONS.map(grade => (
                              <SelectItem key={grade} value={grade}>
                                {grade}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="useAI"
                          checked={useAIForNotes}
                          onCheckedChange={(checked) => setUseAIForNotes(checked as boolean)}
                        />
                        <Label htmlFor="useAI" className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Generate with AI
                        </Label>
                      </div>

                      {!useAIForNotes && (
                        <div>
                          <Label htmlFor="noteContent">Content</Label>
                          <Textarea
                            id="noteContent"
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="Write your notes here..."
                            rows={6}
                          />
                        </div>
                      )}

                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={handleCreateNotes}
                          disabled={creatingResource || !noteTitle || !noteSubject}
                          className="flex-1"
                        >
                          {creatingResource ? "Creating..." : "Create Notes"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowNotesDialog(false)}
                          disabled={creatingResource}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              {resources.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-muted/50">
                      <BookOpen className="h-8 w-8 opacity-50" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No resources yet</h3>
                  <p className="text-sm max-w-sm mx-auto">
                    Create AI-generated tests and notes to help your students learn more effectively.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {resources.map(resource => (
                    <Card key={resource.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {resource.type === 'test' ? (
                                <TestTube className="h-4 w-4 text-primary" />
                              ) : (
                                <FileText className="h-4 w-4 text-secondary" />
                              )}
                              <h4 className="font-semibold">{resource.title}</h4>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {resource.subject}
                              </Badge>
                              {resource.grade && (
                                <Badge variant="outline" className="text-xs">
                                  {resource.grade}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs capitalize">
                                {resource.type}
                              </Badge>
                              {resource.is_ai_generated && (
                                <Badge className="text-xs bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-primary/20">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  AI Generated
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground">
                              Created {new Date(resource.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <Button variant="ghost" size="sm" className="shrink-0">
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
