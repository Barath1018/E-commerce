-- =====================================================================
-- SEED DATA — Default products for Aesthify Studio
-- =====================================================================
-- Run this AFTER schema.sql. It inserts sample products so the
-- storefront is populated on first load.
-- =====================================================================

-- We need a UUID for created_by. Use the first admin user if exists,
-- otherwise NULL.
DO $$
DECLARE
  admin_uuid uuid;
BEGIN
  SELECT id INTO admin_uuid FROM auth.users LIMIT 1;
END $$;

-- =====================================================================
-- 1. VIDEO EFFECTS
-- =====================================================================
INSERT INTO public.products (
  name, description, short_description, price, is_free, category, tags,
  thumbnail_url, preview_images, license_type, is_featured, is_best_seller,
  unique_code_enabled, unique_code_prefix, reviews_enabled, download_count
) VALUES
(
  'Cinematic Transition Pack',
  'Transform your videos with 50+ professional cinematic transitions. Includes smooth zooms, light leaks, glitch effects, and film-grade dissolves. Compatible with Premiere Pro, After Effects, DaVinci Resolve, and Final Cut Pro. Drag and drop ready with 4K support.',
  '50+ cinematic transitions for pro video editing',
  29.99,
  false,
  'Video Effects',
  ARRAY['transitions', 'video', 'premiere pro', 'after effects', 'cinematic'],
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80',
    'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&q=80'
  ],
  'standard',
  true,
  true,
  true,
  'AESTHIFY',
  true,
  234
),
(
  'Neon Glow Effects Bundle',
  'Add stunning neon glow effects to your motion graphics. 30+ customizable neon overlays, text effects, and light streaks. Perfect for music videos, social media content, and promotional videos. Works with After Effects and Premiere Pro.',
  '30+ neon glow overlays and text effects',
  19.99,
  false,
  'Video Effects',
  ARRAY['neon', 'glow', 'effects', 'motion graphics', 'after effects'],
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80'
  ],
  'standard',
  true,
  false,
  false,
  'AESTHIFY',
  true,
  187
),
(
  'Free LUT Pack — Warm Tones',
  'A curated collection of 10 free LUTs for warm color grading. Give your footage a cinematic warm tone with these professional color lookup tables. Compatible with any video editor that supports .cube files.',
  '10 free warm-tone LUTs for cinematic color grading',
  0,
  true,
  'Video Effects',
  ARRAY['luts', 'color grading', 'free', 'cinematic', 'warm tones'],
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=80'
  ],
  'free',
  false,
  false,
  false,
  'AESTHIFY',
  true,
  512
);

-- =====================================================================
-- 2. WEB DEVELOPMENT
-- =====================================================================
INSERT INTO public.products (
  name, description, short_description, price, is_free, category, tags,
  thumbnail_url, preview_images, license_type, is_featured, is_best_seller,
  unique_code_enabled, unique_code_prefix, reviews_enabled, download_count
) VALUES
(
  'React Pro Template',
  'A production-ready React template with TypeScript, Tailwind CSS, and Zustand state management. Includes authentication, dashboard, responsive layout, and 20+ reusable components. Save weeks of development time.',
  'Production-ready React + TypeScript + Tailwind template',
  49.99,
  false,
  'Web Development',
  ARRAY['react', 'typescript', 'tailwind', 'template', 'dashboard'],
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80'
  ],
  'standard',
  true,
  true,
  true,
  'AESTHIFY',
  true,
  342
),
(
  'Next.js SaaS Starter',
  'Full-stack SaaS boilerplate with Next.js 14, Supabase, Stripe integration, and role-based auth. Includes landing page, dashboard, billing, and settings pages. Deploy to Vercel in minutes.',
  'Full-stack SaaS boilerplate with Next.js + Supabase',
  79.99,
  false,
  'Web Development',
  ARRAY['nextjs', 'saas', 'supabase', 'stripe', 'boilerplate'],
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80'
  ],
  'extended',
  true,
  false,
  true,
  'AESTHIFY',
  true,
  156
),
(
  'HTML/CSS Portfolio Template',
  'A beautifully designed, fully responsive portfolio template built with pure HTML and CSS. No JavaScript frameworks needed. Includes dark mode, smooth animations, and contact form. Perfect for freelancers and designers.',
  'Responsive HTML/CSS portfolio with dark mode',
  0,
  true,
  'Web Development',
  ARRAY['html', 'css', 'portfolio', 'free', 'responsive', 'dark mode'],
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80'
  ],
  'free',
  false,
  false,
  false,
  'AESTHIFY',
  true,
  891
);

-- =====================================================================
-- 3. AUDIO
-- =====================================================================
INSERT INTO public.products (
  name, description, short_description, price, is_free, category, tags,
  thumbnail_url, preview_images, license_type, is_featured, is_best_seller,
  unique_code_enabled, unique_code_prefix, reviews_enabled, download_count
) VALUES
(
  'Lo-Fi Beats Pack',
  '20 original lo-fi hip hop beats perfect for background music, vlogs, podcasts, and content creation. Royalty-free with commercial license included. WAV and MP3 formats.',
  '20 royalty-free lo-fi beats for content creators',
  24.99,
  false,
  'Audio',
  ARRAY['lo-fi', 'beats', 'music', 'royalty free', 'background music'],
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&q=80'
  ],
  'standard',
  false,
  true,
  false,
  'AESTHIFY',
  true,
  278
),
(
  'Cinematic Sound Effects',
  '100+ cinematic sound effects including whooshes, hits, risers, impacts, and atmospheric sounds. Perfect for video trailers, transitions, and dramatic moments. High-quality 24-bit WAV files.',
  '100+ cinematic SFX for trailers and transitions',
  34.99,
  false,
  'Audio',
  ARRAY['sound effects', 'cinematic', 'sfx', 'trailer', 'whoosh'],
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80'
  ],
  'standard',
  false,
  false,
  true,
  'AESTHIFY',
  true,
  145
),
(
  'Nature Ambience Pack',
  '25 high-quality nature ambient sounds — rain, forest, ocean waves, birdsong, and thunder. Perfect for relaxation apps, meditation content, and video backgrounds. Loopable and royalty-free.',
  '25 nature ambient sounds — rain, forest, ocean',
  0,
  true,
  'Audio',
  ARRAY['ambient', 'nature', 'free', 'rain', 'ocean', 'meditation'],
  'https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=1200&q=80'
  ],
  'free',
  false,
  false,
  false,
  'AESTHIFY',
  true,
  723
);

-- =====================================================================
-- 4. MOTION GRAPHICS
-- =====================================================================
INSERT INTO public.products (
  name, description, short_description, price, is_free, category, tags,
  thumbnail_url, preview_images, license_type, is_featured, is_best_seller,
  unique_code_enabled, unique_code_prefix, reviews_enabled, download_count
) VALUES
(
  'Logo Animation Toolkit',
  'Create stunning logo animations with 40+ customizable templates. Includes 2D and 3D reveals, particle effects, and kinetic typography. After Effects project files with full control over colors and timing.',
  '40+ logo animation templates for After Effects',
  39.99,
  false,
  'Motion Graphics',
  ARRAY['logo', 'animation', 'after effects', 'motion graphics', 'reveal'],
  'https://images.unsplash.com/photo-1633210613998-9f998b1c6e0f?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1633210613998-9f998b1c6e0f?w=1200&q=80',
    'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=1200&q=80'
  ],
  'standard',
  true,
  true,
  true,
  'AESTHIFY',
  true,
  198
),
(
  'Social Media Motion Pack',
  '50+ animated templates for Instagram Reels, TikTok, and YouTube Shorts. Includes text animations, shape transitions, and call-to-action overlays. Editable in After Effects and Premiere Pro.',
  '50+ animated templates for Reels, TikTok, Shorts',
  29.99,
  false,
  'Motion Graphics',
  ARRAY['social media', 'reels', 'tiktok', 'animations', 'templates'],
  'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&q=80'
  ],
  'standard',
  true,
  false,
  false,
  'AESTHIFY',
  true,
  367
);

-- =====================================================================
-- 5. COURSES
-- =====================================================================
INSERT INTO public.products (
  name, description, short_description, price, is_free, category, tags,
  thumbnail_url, preview_images, license_type, is_featured, is_best_seller,
  unique_code_enabled, unique_code_prefix, reviews_enabled, download_count
) VALUES
(
  'Video Editing Masterclass',
  'Complete video editing course from beginner to pro. 20+ hours of content covering Premiere Pro, color grading, audio mixing, and advanced techniques. Includes practice files and certificates.',
  '20+ hour video editing course — Premiere Pro mastery',
  99.99,
  false,
  'Courses',
  ARRAY['course', 'video editing', 'premiere pro', 'masterclass', 'tutorial'],
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80'
  ],
  'exclusive',
  true,
  true,
  true,
  'AESTHIFY',
  true,
  89
),
(
  'UI/UX Design Fundamentals',
  'Learn UI/UX design from scratch. 15 hours covering Figma, design systems, user research, wireframing, and prototyping. Build a complete portfolio project by the end.',
  '15-hour UI/UX course — Figma + design systems',
  0,
  true,
  'Courses',
  ARRAY['course', 'ui ux', 'figma', 'design', 'free', 'tutorial'],
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80'
  ],
  'free',
  false,
  false,
  false,
  'AESTHIFY',
  true,
  1245
);
