-- Create retirement_plans table
CREATE TABLE IF NOT EXISTS public.retirement_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL,
    plan_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_retirement_plans_user_id ON public.retirement_plans(user_id);

-- Enable Row Level Security
ALTER TABLE public.retirement_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own retirement plans"
    ON public.retirement_plans
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own retirement plans"
    ON public.retirement_plans
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own retirement plans"
    ON public.retirement_plans
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own retirement plans"
    ON public.retirement_plans
    FOR DELETE
    USING (auth.uid() = user_id);

-- Add trigger to retirement_plans for updated_at
CREATE TRIGGER set_retirement_plans_updated_at
    BEFORE UPDATE ON public.retirement_plans
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
