
-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create portfolios table
CREATE TABLE public.portfolios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  content JSONB NOT NULL DEFAULT '{}',
  theme_settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS for portfolios
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- Portfolios policies
CREATE POLICY "Users can view their own portfolios" 
  ON public.portfolios FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own portfolios" 
  ON public.portfolios FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolios" 
  ON public.portfolios FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolios" 
  ON public.portfolios FOR DELETE 
  USING (auth.uid() = user_id);

-- Allow public access to published portfolios
CREATE POLICY "Public can view published portfolios" 
  ON public.portfolios FOR SELECT 
  USING (is_published = TRUE);

-- Create templates table
CREATE TABLE public.templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  structure JSONB NOT NULL DEFAULT '{}',
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS for templates
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Templates policies (public read access)
CREATE POLICY "Anyone can view templates" 
  ON public.templates FOR SELECT 
  TO PUBLIC USING (TRUE);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some default templates
INSERT INTO public.templates (name, description, thumbnail_url, structure) VALUES
('Modern Professional', 'Un template pulito e professionale con design minimalista', '/templates/modern-professional.jpg', 
'{"sections": [{"type": "hero", "title": "Il Tuo Nome", "subtitle": "La Tua Professione"}, {"type": "about", "title": "Chi Sono"}, {"type": "experience", "title": "Esperienza"}, {"type": "skills", "title": "Competenze"}, {"type": "contact", "title": "Contatti"}]}'),

('Creative Portfolio', 'Perfect per designer e creativi con layout dinamico', '/templates/creative-portfolio.jpg',
'{"sections": [{"type": "hero", "title": "Portfolio Creativo", "subtitle": "Designer & Artista"}, {"type": "gallery", "title": "I Miei Lavori"}, {"type": "about", "title": "La Mia Storia"}, {"type": "services", "title": "Servizi"}, {"type": "contact", "title": "Lavoriamo Insieme"}]}'),

('Tech Developer', 'Ideale per sviluppatori e professionisti tech', '/templates/tech-developer.jpg',
'{"sections": [{"type": "hero", "title": "Full Stack Developer", "subtitle": "Codice & Innovazione"}, {"type": "projects", "title": "Progetti"}, {"type": "experience", "title": "Esperienza Lavorativa"}, {"type": "skills", "title": "Stack Tecnologico"}, {"type": "contact", "title": "Contattami"}]}');
