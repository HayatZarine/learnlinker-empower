
import React from 'react';
import { Link } from 'react-router-dom';

const VolunteerSection = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 animate-slide-in">
            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              Become a Volunteer
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold mb-6">
              Share Your Knowledge, Change Lives
            </h2>
            <p className="text-foreground/80 mb-6">
              Join our global community of volunteer teachers making quality education accessible to underprivileged students worldwide.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Flexible Scheduling</h3>
                  <p className="text-foreground/70">Teach when it works for you - even if you only have a few hours a week.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Easy Communication</h3>
                  <p className="text-foreground/70">Multiple ways to connect with students - video, chat, voice, or offline materials.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Safe Environment</h3>
                  <p className="text-foreground/70">Our platform protects both volunteers and students with privacy controls.</p>
                </div>
              </div>
            </div>
            
            <Link to="/register?role=volunteer" className="btn-primary inline-block">
              Become a Volunteer
            </Link>
          </div>
          
          <div className="order-1 lg:order-2 animate-fade-in">
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 glass-card rounded-2xl overflow-hidden shadow-medium">
                <div className="bg-gradient-to-br from-primary/5 to-accent/10 w-full h-full">
                  <div className="p-8 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium mb-4 text-center">Join 300+ Volunteers Around the World</h3>
                    
                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                      <div className="bg-white/30 p-3 rounded-lg text-center">
                        <div className="font-medium text-lg mb-1">100+</div>
                        <div className="text-xs text-foreground/70">Countries</div>
                      </div>
                      <div className="bg-white/30 p-3 rounded-lg text-center">
                        <div className="font-medium text-lg mb-1">1000+</div>
                        <div className="text-xs text-foreground/70">Students Helped</div>
                      </div>
                      <div className="bg-white/30 p-3 rounded-lg text-center">
                        <div className="font-medium text-lg mb-1">20,000+</div>
                        <div className="text-xs text-foreground/70">Learning Hours</div>
                      </div>
                      <div className="bg-white/30 p-3 rounded-lg text-center">
                        <div className="font-medium text-lg mb-1">500+</div>
                        <div className="text-xs text-foreground/70">Subjects</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-md max-h-md bg-accent/5 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VolunteerSection;
