
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { type, answer, subject, questionDifficulty, grade, difficultyLevel } = await req.json();
    
    // Check if GROQ_API_KEY is available
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY is not set in the environment');
    }

    if (type === 'generate') {
      console.log('Generating questions for subject:', subject);
      
      const response = await fetch("https://api.groq.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mixtral-8x7b",
          messages: [
            { 
              role: "system", 
              content: `You are an educational expert creating assessment questions. Generate exactly 10 questions about ${subject}: 3 easy, 4 intermediate, and 3 hard questions. Format your response as a valid JSON array with each object having "text" and "difficulty" properties. Example: [{"text": "Question here", "difficulty": "easy"}, ...]. Ensure you return valid parseable JSON only.` 
            }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Groq API error:', errorData);
        throw new Error(`Groq API returned status ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        throw new Error('Unexpected response format from Groq API');
      }
      
      try {
        // Parse and validate the JSON response
        const content = data.choices[0].message.content.trim();
        const questions = JSON.parse(content);
        
        if (!Array.isArray(questions) || questions.length === 0) {
          throw new Error('Invalid questions format returned');
        }
        
        return new Response(JSON.stringify({ questions }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (parseError) {
        console.error('JSON parsing error:', parseError, 'Raw content:', data.choices[0].message.content);
        throw new Error('Failed to parse Groq API response as valid JSON');
      }
      
    } else if (type === 'evaluate') {
      console.log('Evaluating answer of difficulty level:', questionDifficulty);
      
      const response = await fetch("https://api.groq.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mixtral-8x7b",
          messages: [
            { 
              role: "system", 
              content: `You are evaluating a ${questionDifficulty} level question. Give a score from 1-5, where 3 is meeting expectations for this difficulty level. Return only the number.` 
            },
            { 
              role: "user", 
              content: `Evaluate this answer: ${answer}` 
            }
          ],
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Groq API error:', errorData);
        throw new Error(`Groq API returned status ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      return new Response(JSON.stringify({ score: data.choices[0].message.content }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (type === 'match') {
      console.log('Matching teacher for grade:', grade, 'subject:', subject, 'difficulty:', difficultyLevel);
      
      const response = await fetch("https://api.groq.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mixtral-8x7b",
          messages: [
            { 
              role: "system", 
              content: `You are an AI matchmaker for educational purposes. Generate exactly 3 ideal teacher matches for a student based on the following criteria: Grade ${grade}, Subject ${subject}, Difficulty Level ${difficultyLevel}. Format your response as valid JSON array with each object having "name", "expertise", "experience", "teachingStyle", "availability", and "bio" properties. Example: [{"name": "Dr. Jane Smith", "expertise": "Advanced Physics", "experience": "15 years", "teachingStyle": "Interactive and hands-on", "availability": "Weekdays afternoons", "bio": "Short bio here"}, ...]. Ensure you return valid parseable JSON only.` 
            }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Groq API error:', errorData);
        throw new Error(`Groq API returned status ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        throw new Error('Unexpected response format from Groq API');
      }
      
      try {
        // Parse and validate the JSON response
        const content = data.choices[0].message.content.trim();
        const teachers = JSON.parse(content);
        
        if (!Array.isArray(teachers) || teachers.length === 0) {
          throw new Error('Invalid teachers format returned');
        }
        
        return new Response(JSON.stringify({ teachers }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (parseError) {
        console.error('JSON parsing error:', parseError, 'Raw content:', data.choices[0].message.content);
        throw new Error('Failed to parse Groq API response as valid JSON');
      }
    } else {
      throw new Error(`Invalid type: ${type}`);
    }
  } catch (error) {
    console.error('Error in analyze-answer function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
