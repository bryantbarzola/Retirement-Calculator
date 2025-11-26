-- Drop the existing foreign key constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Make id auto-generate if not provided
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();
