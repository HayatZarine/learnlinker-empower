
-- Add additional profile fields for volunteers
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS availability_hours JSONB,
ADD COLUMN IF NOT EXISTS teaching_experience TEXT,
ADD COLUMN IF NOT EXISTS teaching_methods TEXT,
ADD COLUMN IF NOT EXISTS grade TEXT;

-- Create table for educational resources (tests and notes)
CREATE TABLE public.educational_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID REFERENCES public.profiles(id) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('test', 'note')),
    is_ai_generated BOOLEAN DEFAULT false,
    subject TEXT NOT NULL,
    grade TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for educational_resources
ALTER TABLE public.educational_resources ENABLE ROW LEVEL SECURITY;

-- Teachers can manage their own resources
CREATE POLICY "Teachers can manage their own resources"
ON public.educational_resources
FOR ALL
USING (teacher_id = auth.uid());

-- Students can view all resources
CREATE POLICY "Students can view all resources"
ON public.educational_resources
FOR SELECT
TO authenticated
USING (true);
