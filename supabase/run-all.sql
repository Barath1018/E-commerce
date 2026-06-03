-- =====================================================================
-- Run all migration files in order
-- =====================================================================
-- Execute this file in the Supabase SQL editor, or run each file
-- individually in numerical order.
-- =====================================================================

\ir 01-extensions.sql
\ir 02-tables.sql
\ir 03-views.sql
\ir 04-triggers.sql
\ir 05-rls.sql
\ir 06-storage.sql
\ir 07-realtime.sql
\ir 08-fix-foreign-keys.sql
