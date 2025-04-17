
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
    const { answer } = await req.json();

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
            content: "You are a test evaluator that gives scores between 1 and 5. You should respond with ONLY the number score, nothing else." 
          },
          { 
            role: "user", 
            content: `Evaluate this answer in terms of complexity and depth. Score 1 for basic answers, 5 for complex and sophisticated responses. The answer is: ${answer}` 
          }
        ]
      }),
    });

    const data = await response.json();
    console.log("Groq API Response:", data);

    return new Response(JSON.stringify({ score: data.choices[0].message.content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-answer function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
