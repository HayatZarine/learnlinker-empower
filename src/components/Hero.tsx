
import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="pt-28 md:pt-36 pb-16 md:pb-24 overflow-hidden">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in">
            <div className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium mb-6">
              AI-Powered Education
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-6">
              Connecting <span className="text-gradient">Students</span> and <span className="text-gradient">Volunteers</span> Worldwide
            </h1>
            <p className="text-lg text-foreground/80 mb-8 max-w-xl">
              Our AI-powered platform connects underprivileged students with volunteer teachers globally, providing free quality education and learning resources, with special protection for vulnerable users.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="btn-primary text-center py-3 px-8">
                Get Started
              </Link>
              <Link to="/how-it-works" className="btn-secondary text-center py-3 px-8">
                How It Works
              </Link>
            </div>
            
            <div className="mt-12 flex items-center space-x-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((item) => (
                  <div 
                    key={item} 
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent ring-2 ring-white"
                  />
                ))}
              </div>
              <div>
                <p className="text-foreground/90 font-medium">Trusted by</p>
                <p className="text-sm text-foreground/70">300+ volunteers & 1,000+ students</p>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <div className="relative z-10 glass-card rounded-2xl overflow-hidden shadow-medium">
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-primary/5 to-accent/10">
                <div className="p-8 flex flex-col justify-center items-center text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">AI-Powered Matching</h3>
                  <p className="text-foreground/70 mb-6">Our technology connects you with the perfect teacher based on your learning needs</p>
                  <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                    <div className="bg-white/50 p-3 rounded-lg">
                      <div className="font-semibold text-xl text-primary">500+</div>
                      <div className="text-xs text-foreground/70">Subjects</div>
                    </div>
                    <div className="bg-white/50 p-3 rounded-lg">
                      <div className="font-semibold text-xl text-primary">24/7</div>
                      <div className="text-xs text-foreground/70">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-md max-h-md bg-accent/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 w-24 h-24 bg-primary/20 rounded-full blur-2xl -z-10 animate-float"></div>
            <div className="absolute bottom-0 left-0 transform -translate-x-1/4 translate-y-1/4 w-32 h-32 bg-accent/20 rounded-full blur-2xl -z-10 animate-float" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
