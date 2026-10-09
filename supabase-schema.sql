-- ==============================================================================
-- Workspace Dashboard — Supabase Database Setup
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cpagjchpwbsqjwnjnigk/sql/new
-- ==============================================================================

-- 1. Create table to store dashboard state & keys
CREATE TABLE IF NOT EXISTS public.workspace_state (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.workspace_state ENABLE ROW LEVEL SECURITY;

-- 3. Create permissive access policy for client publishable key
DROP POLICY IF EXISTS "Allow public access with publishable key" ON public.workspace_state;
CREATE POLICY "Allow public access with publishable key"
ON public.workspace_state
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 4. Enable Realtime sync (optional, broadcast changes to active tabs)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'workspace_state'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.workspace_state;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        NULL; -- Ignore if publication is not configured
END $$;

-- Verification query
SELECT count(*) AS total_keys FROM public.workspace_state;
