
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
    const { type, subject, grade, difficultyLevel } = await req.json();

    if (type === 'generate') {
      // Generate questions using Groq
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
              content: `Generate 3 questions for ${subject} at grade level ${grade}. Provide questions with varying difficulty levels: easy, medium, and hard.` 
            }
          ],
        }),
      });

      const data = await response.json();
      const questionsText = data.choices[0].message.content;
      
      // Parse the questions (you might need to refine this parsing logic)
      const questions = questionsText.split('\n').filter(q => q.trim() !== '').map((q, index) => ({
        text: q.replace(/^\d+\./, '').trim(),
        difficulty: index === 0 ? 'easy' : index === 1 ? 'intermediate' : 'hard'
      }));

      return new Response(JSON.stringify({ questions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (type === 'evaluate') {
      // Evaluate answer using Groq
      const { answer, questionDifficulty } = await req.json();

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
              content: `Evaluate the answer for a ${questionDifficulty} difficulty question. Provide a score from 0 to 5.` 
            },
            { 
              role: 'user', 
              content: `Question difficulty: ${questionDifficulty}. Answer: ${answer}` 
            }
          ],
        }),
      });

      const data = await response.json();
      const scoreText = data.choices[0].message.content;
      
      // Extract numerical score (you might need to refine this parsing)
      const score = parseInt(scoreText.match(/\d+/)?.[0] || '0', 10);

      return new Response(JSON.stringify({ score }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (type === 'match') {
      // Match teachers using Groq
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
              content: `Generate 2 teacher profiles matching grade ${grade}, subject ${subject}, and difficulty level ${difficultyLevel}.` 
            }
          ],
        }),
      });

      const data = await response.json();
      const teachersText = data.choices[0].message.content;
      
      // Parse the teachers (you might need to refine this parsing logic)
      const teachersInfo = teachersText.split('\n\n').filter(t => t.trim() !== '').map(teacherInfo => {
        const [name, expertise, experience, teachingStyle, availability, bio] = teacherInfo.split('\n').map(line => line.replace(/^.*:/, '').trim());
        
        return {
          name,
          expertise,
          experience,
          teachingStyle,
          availability,
          bio
        };
      });

      return new Response(JSON.stringify({ teachers: teachersInfo }), {
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
