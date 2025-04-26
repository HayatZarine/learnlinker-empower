
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { MultiSelect } from "@/components/MultiSelect";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVolunteerProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('subjects, role')
        .eq('id', user.id)
        .single();

      if (data) {
        setSelectedSubjects(data.subjects || []);
      }

      if (error) {
        toast({
          title: "Error fetching profile",
          description: error.message,
          variant: "destructive"
        });
      }
    };

    fetchVolunteerProfile();
  }, [user]);

  const handleSaveSubjects = async () => {
    if (!user) return;

    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ 
        subjects: selectedSubjects, 
        role: 'volunteer' 
      })
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Error updating subjects",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Subjects Updated",
        description: "Your teaching subjects have been successfully updated.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Volunteer Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Select Subjects You Want to Teach</h2>
              <MultiSelect 
                options={SUBJECT_OPTIONS}
                value={selectedSubjects}
                onChange={setSelectedSubjects}
                placeholder="Select subjects"
              />
            </div>
            <Button 
              onClick={handleSaveSubjects} 
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Subjects"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VolunteerDashboard;
