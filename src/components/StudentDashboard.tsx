
import React from 'react';
import { useAuth } from "../contexts/AuthContext";
import DifficultyTest from "./DifficultyTest";
import TeacherFinder from "./TeacherFinder";

const StudentDashboard = () => {
  const { user } = useAuth();
  const isStudent = user?.user_metadata?.role === 'student';

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <DifficultyTest />
      <TeacherFinder />
    </div>
  );
};

export default StudentDashboard;
