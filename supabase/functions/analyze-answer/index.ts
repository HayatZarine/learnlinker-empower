
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
    const { type, answer, subject, questionDifficulty } = await req.json();

    if (type === 'generate') {
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
              content: "You are an educational expert creating assessment questions. Generate 10 questions about the given subject: 3 easy, 4 intermediate, and 3 hard questions. Return them as a JSON array with each question having 'text' and 'difficulty' properties." 
            },
            { 
              role: "user", 
              content: `Generate questions about ${subject}` 
            }
          ]
        }),
      });

      const data = await response.json();
      const questions = JSON.parse(data.choices[0].message.content);

      return new Response(JSON.stringify({ questions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
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
          ]
        }),
      });

      const data = await response.json();
      return new Response(JSON.stringify({ score: data.choices[0].message.content }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in analyze-answer function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
