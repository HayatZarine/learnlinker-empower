
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const About = () => {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            About <span className="text-gradient">SafeLearn</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Empowering education through safe, accessible learning
          </p>
        </div>

        <Tabs defaultValue="mission" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mission">Our Mission</TabsTrigger>
            <TabsTrigger value="difference">Why We're Different</TabsTrigger>
            <TabsTrigger value="features">Key Features</TabsTrigger>
          </TabsList>

          <TabsContent value="mission" className="mt-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-foreground/80 leading-relaxed">
                  SafeLearn was created with a singular purpose: to provide quality education to students in challenging circumstances, particularly those facing educational barriers due to social, political, or geographical constraints. We believe that education is a fundamental right, not a privilege, and should be accessible to everyone regardless of their situation.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  Our platform specifically addresses the needs of students who require anonymity and protection while pursuing their education, including those in regions with limited educational access, conflict zones, or situations where learning might be restricted or discouraged.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="difference" className="mt-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Why We're Different</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Privacy-First Approach</h3>
                    <p className="text-foreground/80">Unlike traditional educational platforms, we prioritize user privacy and security with anonymous profiles and our unique stealth mode feature for emergency situations.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">AI-Powered Matching</h3>
                    <p className="text-foreground/80">Our advanced AI technology ensures students are matched with the most suitable volunteer teachers based on subject expertise, teaching style, and availability.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Offline Accessibility</h3>
                    <p className="text-foreground/80">We understand that internet access can be unreliable. Our platform offers downloadable content and offline learning capabilities to ensure continuous education.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
                <div className="grid gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Enhanced Security</h3>
                      <p className="text-foreground/80">End-to-end encryption and anonymous profiles protect student identities.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Real-time Learning</h3>
                      <p className="text-foreground/80">Interactive live classes and instant messaging with verified teachers.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Career Development</h3>
                      <p className="text-foreground/80">Access to skill-building courses and career opportunities.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default About;
