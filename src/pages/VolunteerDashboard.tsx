
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { MultiSelect } from "@/components/MultiSelect";
import { Plus, FileText, TestTube } from "lucide-react";

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Volunteer Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          {/* Grade Level */}
          <div>
            <Label htmlFor="grade">Grade Level You Prefer to Teach</Label>
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger>
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

          {/* Subjects */}
          <div>
            <Label>Subjects You Want to Teach</Label>
            <MultiSelect 
              options={SUBJECT_OPTIONS}
              value={selectedSubjects}
              onChange={setSelectedSubjects}
              placeholder="Select subjects"
            />
          </div>

          {/* Availability */}
          <div>
            <Label>Availability Hours</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {TIME_SLOTS.map(slot => (
                <div key={slot} className="flex items-center space-x-2">
                  <Checkbox
                    id={slot}
                    checked={availabilityHours.includes(slot)}
                    onCheckedChange={(checked) => handleAvailabilityChange(slot, checked as boolean)}
                  />
                  <Label htmlFor={slot}>{slot}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Teaching Experience */}
          <div>
            <Label htmlFor="experience">Teaching Experience</Label>
            <Textarea
              id="experience"
              value={teachingExperience}
              onChange={(e) => setTeachingExperience(e.target.value)}
              placeholder="Describe your teaching experience, qualifications, and background..."
              rows={4}
            />
          </div>

          {/* Teaching Methods */}
          <div>
            <Label htmlFor="methods">Teaching Methods & Approach</Label>
            <Textarea
              id="methods"
              value={teachingMethods}
              onChange={(e) => setTeachingMethods(e.target.value)}
              placeholder="Describe your teaching style, methods, and how you like to engage with students..."
              rows={4}
            />
          </div>

          <Button 
            onClick={handleSaveProfile} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Saving Profile..." : "Save Profile"}
          </Button>
        </CardContent>
      </Card>

      {/* Educational Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Educational Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Test (AI Generated)
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Notes
              </Button>
            </div>
            
            {resources.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No educational resources created yet.</p>
                <p className="text-sm">Create tests and notes to help your students learn.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {resources.map(resource => (
                  <div key={resource.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{resource.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {resource.type === 'test' ? 'Test' : 'Notes'} • {resource.subject} • {resource.grade || 'All Grades'}
                        </p>
                        {resource.is_ai_generated && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            AI Generated
                          </span>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VolunteerDashboard;
