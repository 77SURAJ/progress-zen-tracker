-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  phone TEXT,
  phone_verified BOOLEAN DEFAULT FALSE,
  display_name TEXT,
  avatar_url TEXT,
  education_level TEXT DEFAULT 'B.Tech',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create progress entries table
CREATE TABLE public.progress_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed BOOLEAN DEFAULT FALSE,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.progress_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for progress entries
CREATE POLICY "Users can view their own entries" 
ON public.progress_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own entries" 
ON public.progress_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries" 
ON public.progress_entries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries" 
ON public.progress_entries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create phone verification codes table
CREATE TABLE public.phone_verification_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.phone_verification_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for phone verification
CREATE POLICY "Users can view their own verification codes" 
ON public.phone_verification_codes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own verification codes" 
ON public.phone_verification_codes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own verification codes" 
ON public.phone_verification_codes 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_progress_entries_updated_at
  BEFORE UPDATE ON public.progress_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_progress_entries_user_id ON public.progress_entries(user_id);
CREATE INDEX idx_progress_entries_date ON public.progress_entries(entry_date);
CREATE INDEX idx_progress_entries_category ON public.progress_entries(category);
CREATE INDEX idx_phone_verification_user_id ON public.phone_verification_codes(user_id);
CREATE INDEX idx_phone_verification_expires ON public.phone_verification_codes(expires_at);