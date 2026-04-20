
-- Create document_verifications table
CREATE TABLE public.document_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  is_document BOOLEAN NOT NULL DEFAULT false,
  category TEXT,
  category_icon TEXT,
  confidence INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected', 'flagged')),
  details TEXT[],
  source TEXT DEFAULT 'direct' CHECK (source IN ('direct', 'embed', 'api')),
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create caption_generations table
CREATE TABLE public.caption_generations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_name TEXT NOT NULL,
  captions TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.document_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caption_generations ENABLE ROW LEVEL SECURITY;

-- Allow public read/insert for document_verifications (embeddable widget)
CREATE POLICY "Anyone can insert verifications" ON public.document_verifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read verifications" ON public.document_verifications FOR SELECT USING (true);
CREATE POLICY "Anyone can update verification status" ON public.document_verifications FOR UPDATE USING (true);

-- Allow public read/insert for caption_generations
CREATE POLICY "Anyone can insert captions" ON public.caption_generations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read captions" ON public.caption_generations FOR SELECT USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_verifications_updated_at
BEFORE UPDATE ON public.document_verifications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
