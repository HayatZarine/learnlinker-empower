
import React from 'react';

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
};

const FeatureCard = ({ icon, title, description, className = '' }: FeatureCardProps) => (
  <div className={`glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-medium hover:-translate-y-1 ${className}`}>
    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-medium mb-2">{title}</h3>
    <p className="text-foreground/70">{description}</p>
  </div>
);

const Features = () => {
  return (
    <section id="features" className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 transform -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 transform translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
            Core Features
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Empowering Education Through AI and Community
          </h2>
          <p className="text-foreground/70">
            Our platform combines cutting-edge technology with human connection to create a safe, accessible learning environment.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            title="AI-Powered Matching"
            description="Our advanced AI algorithm matches students with teachers based on subject, learning style, and availability."
            className="animate-slide-up"
            
          />
          
          <FeatureCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            title="Secure & Anonymous Learning"
            description="End-to-end encryption and anonymous profiles protect the identity of vulnerable users."
            className="animate-slide-up"
            
          />
          
          <FeatureCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Emergency Exit"
            description="One-click stealth mode allows users to quickly exit the platform in unsafe situations."
            className="animate-slide-up"
            
          />
          
          <FeatureCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            }
            title="Real-time Learning"
            description="Interactive live classes and chat-based tutoring provide immediate feedback and support."
            className="animate-slide-up"
            
          />
          
          <FeatureCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            }
            title="Offline Learning"
            description="Downloadable content ensures continuous learning even with limited internet access."
            className="animate-slide-up"
            
          />
          
          <FeatureCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            title="Skill Development & Jobs"
            description="Access to skill-building courses and job opportunities to support long-term empowerment."
            className="animate-slide-up"
            
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
