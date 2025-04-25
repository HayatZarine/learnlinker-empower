import React from 'react';
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HowItWorks from "./pages/HowItWorks";
import StudentDashboard from "./components/StudentDashboard";
import StealthButton from "./components/StealthButton";
import About from "./pages/About";
import Donations from "./pages/Donations";
import VideoCall from "./components/VideoCall";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TooltipProvider>
            <div className="relative">
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/about" element={<About />} />
                <Route path="/donations" element={<Donations />} />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-8">
                      <h1 className="text-3xl font-bold text-primary mb-8 text-center">Welcome to Dashboard</h1>
                      <div className="max-w-6xl mx-auto space-y-8">
                        <StudentDashboard />
                      </div>
                    </div>
                  </ProtectedRoute>
                } />
                
                <Route path="/video-call/:teacherId" element={
                  <ProtectedRoute>
                    <VideoCall />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              <div className="fixed bottom-4 right-4 z-50">
                <StealthButton />
              </div>
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default App;
