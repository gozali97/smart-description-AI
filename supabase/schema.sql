-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  ai_model TEXT DEFAULT 'mistral',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add ai_model column if table exists (for migration)
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_model TEXT DEFAULT 'mistral';

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  key_features TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create generations table
CREATE TABLE IF NOT EXISTS generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  tone_of_voice TEXT NOT NULL,
  result_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id ON profiles(clerk_id);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_product_id ON generations(product_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Service role full access profiles" ON profiles;
DROP POLICY IF EXISTS "Service role full access products" ON products;
DROP POLICY IF EXISTS "Service role full access generations" ON generations;

-- RLS Policies - Allow service_role full access (used by our API)
-- The service_role key bypasses RLS by default, but we add explicit policies for clarity

CREATE POLICY "Service role full access profiles" ON profiles
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access products" ON products
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access generations" ON generations
  FOR ALL USING (true) WITH CHECK (true);

-- Create storage bucket for product images (run separately if needed)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('product-images', 'product-images', true)
-- ON CONFLICT (id) DO NOTHING;
