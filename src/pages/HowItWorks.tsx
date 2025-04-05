
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">How LearnLinker Works</h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Our platform connects volunteer teachers with students who need access to quality education.
              Here's how it works:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-background/50 p-6 rounded-xl shadow-sm border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Sign Up</h3>
              <p className="text-foreground/70">
                Create your account as a student looking to learn or as a volunteer ready to teach.
              </p>
            </div>
            
            <div className="bg-background/50 p-6 rounded-xl shadow-sm border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Get Matched</h3>
              <p className="text-foreground/70">
                Our AI technology pairs students with the perfect volunteer teacher based on learning needs.
              </p>
            </div>
            
            <div className="bg-background/50 p-6 rounded-xl shadow-sm border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Start Learning</h3>
              <p className="text-foreground/70">
                Connect through video calls, chat, or receive offline learning materials to begin your education journey.
              </p>
            </div>
          </div>
          
          <div className="glass-card p-8 rounded-xl mb-16">
            <h2 className="text-3xl font-semibold mb-6 text-center">Special Features for Safety</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Emergency Exit</h3>
                  <p className="text-foreground/70">
                    Our platform features a one-click emergency exit button that instantly redirects to a news website, 
                    ensuring users' privacy and safety in challenging situations.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Anonymous Profiles</h3>
                  <p className="text-foreground/70">
                    Users can create anonymous profiles, ensuring their identity is protected while still 
                    accessing quality education resources.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-6">Ready to Begin?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register?role=student" className="btn-primary py-3 px-8">
                Start Learning
              </Link>
              <Link to="/register?role=volunteer" className="btn-secondary py-3 px-8">
                Become a Volunteer
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorks;
