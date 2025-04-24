
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

    if (!groqApiKey) {
      console.error("GROQ_API_KEY is not set");
      return new Response(
        JSON.stringify({ 
          error: "API key not configured",
          status: "error",
          message: "Please set the GROQ_API_KEY environment variable"
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Using GROQ API Key: ${groqApiKey ? 'Key exists' : 'Key missing'}`);

    // Common function for Groq API calls
    async function callGroqAPI(messages, temperature = 0.7) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages,
            temperature,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Groq API Error Status: ${response.status}`);
          console.error(`Groq API Error Body: ${errorText}`);
          throw new Error(`Groq API error: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error("Error calling Groq API:", error);
        throw error;
      }
    }

    if (type === 'generate') {
      // Generate questions using Groq
      const { subject, grade } = requestBody;
      console.log(`Generating questions for ${subject} at grade ${grade}`);
      
      const data = await callGroqAPI(
        [
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
        0.2
      );
      
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
      
      return new Response(JSON.stringify({ questions, status: "success" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (type === 'evaluate') {
      // Evaluate answer using Groq
      const { answer, questionDifficulty } = requestBody;
      console.log(`Evaluating ${questionDifficulty} difficulty answer`);
      
      const data = await callGroqAPI(
        [
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
        0.1
      );
      
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

      return new Response(JSON.stringify({ score, status: "success" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (type === 'match') {
      // Match teachers using Groq
      const { grade, subject, difficultyLevel } = requestBody;
      console.log(`Finding teachers for grade ${grade}, subject ${subject}, difficulty ${difficultyLevel}`);
      
      const data = await callGroqAPI(
        [
          { 
            role: 'system', 
            content: `You are a teacher matching assistant that generates profiles of qualified teachers.` 
          },
          { 
            role: 'user', 
            content: `Generate exactly 2 teacher profiles for grade ${grade}, subject ${subject}, and difficulty level ${difficultyLevel}.
                     Format your response as a JSON array of objects with these properties: 
                     name, expertise, experience, teachingStyle, availability, and bio.
                     Make the experience field a string (not a number with "years").
                     Do not include any text before or after the JSON array.
                     Keep your response concise.
                     Example: [{"name": "Dr. Jane Smith", "expertise": "Advanced Math Educator", "experience": "15 years", "teachingStyle": "Interactive", "availability": "Weekdays", "bio": "Bio text"}, {...}]` 
          }
        ],
        0.7
      );
      
      console.log("Teacher matching response:", data);
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        throw new Error("Invalid response format from API");
      }
      
      const content = data.choices[0].message.content;
      console.log("Raw teacher data:", content);
      
      // Try to extract JSON from the response
      let teachers;
      try {
        // First try direct parsing
        if (content.trim().startsWith('[') && content.trim().endsWith(']')) {
          teachers = JSON.parse(content);
        } else {
          // Find JSON array pattern
          const jsonMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
          if (jsonMatch) {
            teachers = JSON.parse(jsonMatch[0]);
          } else {
            console.error("Could not extract JSON from:", content);
            throw new Error("Could not extract teacher data from response");
          }
        }
      } catch (error) {
        console.error("Error parsing teacher data:", error);
        
        // Attempt to clean up the content
        try {
          // Fix common JSON syntax errors
          const fixedJson = content
            .replace(/(\w+):\s/g, '"$1": ') // Add quotes to keys
            .replace(/,\s*}/g, '}')         // Remove trailing commas
            .replace(/,\s*]/g, ']')         // Remove trailing commas
            .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:([^,}]+)/g, '"$2":$4') // Fix all keys
            .replace(/:\s*'([^']*)'/g, ':"$1"'); // Replace single quotes with double quotes
          
          // Try to find the array in the cleaned content
          const arrayMatch = fixedJson.match(/\[\s*\{[\s\S]*\}\s*\]/);
          if (arrayMatch) {
            teachers = JSON.parse(arrayMatch[0]);
          } else {
            throw new Error("Could not find teacher data array");
          }
        } catch (innerError) {
          console.error("Failed final attempt to parse teacher data:", innerError);
          
          // Create fallback teacher data
          teachers = [
            {
              name: `${subject} Specialist`,
              expertise: `${subject} for Grade ${grade}`,
              experience: "10+ years",
              teachingStyle: `${difficultyLevel} focus with interactive elements`,
              availability: "Weekdays & Weekends",
              bio: `Specialized in teaching ${subject} at grade ${grade} with focus on ${difficultyLevel} difficulty content.`
            },
            {
              name: `${subject} Mentor`,
              expertise: `${difficultyLevel} ${subject}`,
              experience: "8+ years",
              teachingStyle: "Personalized approach",
              availability: "Flexible scheduling",
              bio: `Expert in ${subject} education with special emphasis on ${difficultyLevel} content for grade ${grade} students.`
            }
          ];
        }
      }
      
      // Validate teacher data
      if (!Array.isArray(teachers) || teachers.length === 0) {
        console.error("No teacher data found:", teachers);
        throw new Error("No teacher profiles found in API response");
      }
      
      // Ensure all required fields exist as strings
      teachers = teachers.map(teacher => ({
        name: String(teacher.name || `${subject} Teacher`),
        expertise: String(teacher.expertise || `${subject} Education`),
        experience: String(teacher.experience || "10+ years"),
        teachingStyle: String(teacher.teachingStyle || "Adaptive and engaging"),
        availability: String(teacher.availability || "Weekdays"),
        bio: String(teacher.bio || `Specializes in teaching ${subject} to grade ${grade} students.`)
      }));
      
      // Limit to 2 teachers
      teachers = teachers.slice(0, 2);
      
      console.log("Processed teacher data:", teachers);

      return new Response(JSON.stringify({ teachers, status: "success" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid request type', status: "error" }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in Groq API function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      status: "error",
      message: "Failed to process your request. Please try again." 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
