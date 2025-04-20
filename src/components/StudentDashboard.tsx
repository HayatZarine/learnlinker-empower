
import React from 'react';
import { useAuth } from "../contexts/AuthContext";
import DifficultyTest from "./DifficultyTest";
import TeacherFinder from "./TeacherFinder";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isStudent = user?.user_metadata?.role === 'student';

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error("Error signing out", { description: error.message });
      } else {
        toast.success("Successfully signed out");
        navigate('/');
      }
    } catch (error) {
      toast.error("Unexpected error during sign out");
      console.error(error);
    }
  };

  if (!isStudent) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl text-muted-foreground">
          Welcome to your dashboard! Content specific to your role will appear here.
        </h2>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
      <DifficultyTest />
      <TeacherFinder />
      <div className="absolute top-0 right-0">
        <Button 
          variant="destructive" 
          onClick={handleSignOut}
          className="flex items-center gap-2"
        >
          <LogOut size={16} />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default StudentDashboard;
