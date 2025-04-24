
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const groqApiKey = Deno.env.get('GROQ_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    const { type } = requestBody;

    console.log(`Processing request of type: ${type}`);
    console.log(`Request body:`, JSON.stringify(requestBody));
    console.log(`Using GROQ API Key: ${groqApiKey ? 'Key exists' : 'Key missing'}`);

    if (type === 'generate') {
      // Generate questions using Groq
      const { subject, grade } = requestBody;
      console.log(`Generating questions for ${subject} at grade ${grade}`);
      
      if (!groqApiKey) {
        console.error("GROQ_API_KEY is not set");
        throw new Error("API key not configured");
      }

      const response = await fetch('https://api.groq.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            { 
              role: 'system', 
              content: `You are an expert educator specialized in creating educational content for students.` 
            },
            {
              role: 'user',
              content: `Generate exactly 3 questions for ${subject} at grade level ${grade}. 
              The questions should be of these difficulty levels in order: easy, intermediate, hard. 
              Format the response as a clean JSON array with each question having 'text' and 'difficulty' properties. 
              Example: [{"text": "Question text here", "difficulty": "easy"}, ...].
              Be precise and concise with the questions.`
            }
          ],
          temperature: 0.2, // Lower temperature for more consistent outputs
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Groq API Error Status:", response.status);
        console.error("Groq API Error Body:", errorText);
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Groq API response:", JSON.stringify(data));
      
      if (!data || !data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        console.error("Invalid response format from Groq API:", data);
        throw new Error("Invalid response from Groq API");
      }
      
      const content = data.choices[0].message.content;
      console.log("Raw content from Groq:", content);
      
      // Try to extract JSON from the response
      let questions;
      try {
        // Check if content is already JSON or needs extraction
        if (content.trim().startsWith('[') && content.trim().endsWith(']')) {
          questions = JSON.parse(content);
        } else {
          // Try to find JSON array in the text
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            questions = JSON.parse(jsonMatch[0]);
          } else {
            // Fallback: manually create questions from the content
            const lines = content.split('\n').filter(line => line.trim().length > 0);
            questions = [];
            
            const difficulties = ['easy', 'intermediate', 'hard'];
            let difficultyIndex = 0;
            
            for (const line of lines) {
              if (line.includes('?') && difficultyIndex < 3) {
                questions.push({
                  text: line.replace(/^\d+[\.\)]\s*/, '').trim(),
                  difficulty: difficulties[difficultyIndex]
                });
                difficultyIndex++;
              }
              
              if (questions.length >= 3) break;
            }
          }
        }
      } catch (error) {
        console.error("Error parsing questions:", error);
        throw new Error("Failed to parse questions from API response");
      }
      
      // Ensure we have exactly 3 questions with the right difficulties
      if (!Array.isArray(questions) || questions.length < 3) {
        console.error("Not enough questions generated:", questions);
        throw new Error("Not enough questions generated");
      }
      
      // Force the correct difficulty levels if they're wrong
      questions = questions.slice(0, 3).map((q, idx) => ({
        text: q.text,
        difficulty: ['easy', 'intermediate', 'hard'][idx]
      }));

      console.log("Processed questions:", questions);
      
      return new Response(JSON.stringify({ questions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (type === 'evaluate') {
      // Evaluate answer using Groq
      const { answer, questionDifficulty } = requestBody;
      console.log(`Evaluating ${questionDifficulty} difficulty answer`);
      
      if (!groqApiKey) {
        console.error("GROQ_API_KEY is not set");
        throw new Error("API key not configured");
      }

      const response = await fetch('https://api.groq.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            { 
              role: 'system', 
              content: `You are an expert educator who evaluates student answers. Provide a score from 0 to 5 only.` 
            },
            { 
              role: 'user', 
              content: `Evaluate this ${questionDifficulty} difficulty answer: "${answer}". 
                        Be fair and consider the difficulty level.
                        Respond with ONLY a number from 0 to 5, with 5 being excellent.` 
            }
          ],
          temperature: 0.1, // Low temperature for more consistent scoring
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Groq API Error Status:", response.status);
        console.error("Groq API Error Body:", errorText);
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Evaluation response:", data);
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        throw new Error("Invalid response format from API");
      }
      
      const scoreText = data.choices[0].message.content.trim();
      console.log("Score text:", scoreText);
      
      // Extract score - first try to get a direct number
      let score;
      const directNumber = scoreText.match(/^[0-5]$/);
      if (directNumber) {
        score = parseInt(directNumber[0], 10);
      } else {
        // Otherwise extract any number 0-5 from the text
        const scoreMatch = scoreText.match(/\b[0-5]\b/);
        score = scoreMatch ? parseInt(scoreMatch[0], 10) : 0;
      }
      
      console.log("Extracted score:", score);

      return new Response(JSON.stringify({ score }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (type === 'match') {
      // Match teachers using Groq
      const { grade, subject, difficultyLevel } = requestBody;
      console.log(`Finding teachers for grade ${grade}, subject ${subject}, difficulty ${difficultyLevel}`);
      
      if (!groqApiKey) {
        console.error("GROQ_API_KEY is not set");
        throw new Error("API key not configured");
      }
      
      const response = await fetch('https://api.groq.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            { 
              role: 'system', 
              content: `You are a teacher matching assistant that generates profiles of qualified teachers.` 
            },
            { 
              role: 'user', 
              content: `Generate exactly 2 teacher profiles for grade ${grade}, subject ${subject}, and difficulty level ${difficultyLevel}.
                       Format your response as a JSON array of objects with these properties: 
                       name, expertise, experience, teachingStyle, availability, and bio.
                       Make the response look realistic and professional.
                       Example: [{"name": "Dr. Jane Smith", "expertise": "Advanced Math Educator", ...}, {...}]` 
            }
          ],
          temperature: 0.7, // Higher temperature for creative teacher profiles
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Groq API Error Status:", response.status);
        console.error("Groq API Error Body:", errorText);
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Teacher matching response:", data);
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        throw new Error("Invalid response format from API");
      }
      
      const content = data.choices[0].message.content;
      console.log("Raw teacher data:", content);
      
      // Try to extract JSON from the response
      let teachers;
      try {
        // Check if content is already JSON or needs extraction
        if (content.trim().startsWith('[') && content.trim().endsWith(']')) {
          teachers = JSON.parse(content);
        } else {
          // Try to find JSON array in the text
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            teachers = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error("Could not extract teacher data from response");
          }
        }
      } catch (error) {
        console.error("Error parsing teacher data:", error);
        throw new Error("Failed to parse teacher profiles from API response");
      }
      
      // Validate teacher data
      if (!Array.isArray(teachers) || teachers.length === 0) {
        console.error("No teacher data found:", teachers);
        throw new Error("No teacher profiles found in API response");
      }
      
      // Ensure all required fields exist
      teachers = teachers.map(teacher => ({
        name: teacher.name || "Unknown Teacher",
        expertise: teacher.expertise || `${subject} Education`,
        experience: teacher.experience || "10+ years",
        teachingStyle: teacher.teachingStyle || "Adaptive and engaging",
        availability: teacher.availability || "Weekdays",
        bio: teacher.bio || `Specializes in teaching ${subject} to grade ${grade} students.`
      }));
      
      console.log("Processed teacher data:", teachers);

      return new Response(JSON.stringify({ teachers }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid request type' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in Groq API function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
