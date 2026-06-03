-- Add unique constraint on username to prevent duplicates
-- and ensure onboarding username check works properly

-- First, clean up any duplicate usernames (keep the oldest by created_at)
DELETE FROM public.profiles
WHERE id IN (
  SELECT p1.id
  FROM public.profiles p1
  INNER JOIN public.profiles p2
    ON p1.username = p2.username
    AND p1.id != p2.id
  WHERE p1.username IS NOT NULL
    AND p1.created_at > p2.created_at
);

-- Add unique constraint
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_username_unique UNIQUE (username);
