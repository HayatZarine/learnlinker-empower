
import React from 'react';
import { Link } from 'react-router-dom';

const StudentSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="relative">
              <div className="glass-card rounded-2xl overflow-hidden shadow-medium">
                <div className="bg-gradient-to-br from-accent/10 to-primary/5 aspect-w-4 aspect-h-3">
                  <div className="p-8 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium mb-4 text-center">Access Free, Quality Education</h3>
                    
                    <div className="space-y-4 w-full max-w-sm">
                      <div className="bg-white/30 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h4 className="font-medium">1-on-1 Tutoring</h4>
                        </div>
                        <p className="text-sm text-foreground/70 pl-11">Personalized sessions with dedicated teachers</p>
                      </div>
                      
                      <div className="bg-white/30 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h4 className="font-medium">Safe Learning Environment</h4>
                        </div>
                        <p className="text-sm text-foreground/70 pl-11">Anonymous profiles and emergency exit features</p>
                      </div>
                      
                      <div className="bg-white/30 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h4 className="font-medium">Multiple Learning Methods</h4>
                        </div>
                        <p className="text-sm text-foreground/70 pl-11">Live classes, chat, and downloadable materials</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-md max-h-md bg-primary/5 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
          
          <div className="animate-slide-in">
            <div className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium mb-4">
              For Students
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold mb-6">
              Learning That Adapts to Your Needs
            </h2>
            <p className="text-foreground/80 mb-6">
              Our platform is designed to provide personalized education to students in all circumstances, with special features for those with limited access or safety concerns.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">AI-Powered Learning</h3>
                  <p className="text-foreground/70">Our AI matches you with the perfect teacher for your needs and learning style.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Secure Learning</h3>
                  <p className="text-foreground/70">Anonymous profiles and emergency features keep you safe while learning.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Offline Access</h3>
                  <p className="text-foreground/70">Continue learning even without stable internet connection.</p>
                </div>
              </div>
            </div>
            
            <Link to="/register?role=student" className="btn-accent inline-block">
              Start Learning
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentSection;
