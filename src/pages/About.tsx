
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const About = () => {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            About <span className="text-gradient">LearnLinker</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Connecting Learners and Educators Across Boundaries
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
                  LearnLinker was born from a simple yet powerful belief: education should know no boundaries. We aim to bridge educational gaps by creating a platform that connects passionate learners with dedicated educators, regardless of geographical, economic, or social constraints.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  Our platform is designed to democratize education, providing opportunities for students who might otherwise be left behind. Whether you're a student in a remote area, facing economic challenges, or seeking specialized learning, LearnLinker is your gateway to knowledge and personal growth.
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
                    <h3 className="font-medium mb-2">Adaptive Learning Ecosystem</h3>
                    <p className="text-foreground/80">Unlike traditional platforms, we use advanced AI to create personalized learning experiences that adapt to each student's unique needs, learning style, and pace.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Global Talent Pool</h3>
                    <p className="text-foreground/80">Our platform connects students with a diverse network of educators worldwide, ensuring access to high-quality instruction across various subjects and skill levels.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Flexible Learning Modes</h3>
                    <p className="text-foreground/80">We offer multiple learning formats - live sessions, recorded lectures, interactive workshops - to accommodate different schedules and learning preferences.</p>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Secure Learning Environment</h3>
                      <p className="text-foreground/80">Advanced privacy controls and secure communication channels protect student and educator identities.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Community-Driven Learning</h3>
                      <p className="text-foreground/80">Connect with a global community of learners and educators, fostering collaboration and knowledge sharing.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Comprehensive Learning Resources</h3>
                      <p className="text-foreground/80">Access a wide range of learning materials, from interactive tutorials to expert-led courses across multiple disciplines.</p>
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
