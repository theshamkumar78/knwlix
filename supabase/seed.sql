-- ============================================================================
-- Knowlix LMS - University Competition Seed Data
-- Aligned with the 11-Page Visual Design Specification
-- ============================================================================

-- Note: In Supabase, auth.users are managed via Auth API.
-- This script seeds demo course catalog, modules, lessons, reviews, and certificates
-- linked to existing instructor accounts or demo placeholder UUIDs.

DO $$
DECLARE
    inst_id UUID;
    cat_cs TEXT := 'Computer Science';
    cat_med TEXT := 'Medical / MBBS';
    cat_math TEXT := 'Mathematics';
    cat_bba TEXT := 'Business / BBA';
    cat_eng TEXT := 'English';

    c_python UUID := 'a1111111-1111-1111-1111-111111111111';
    c_anatomy UUID := 'b2222222-2222-2222-2222-222222222222';
    c_math_id UUID := 'c3333333-3333-3333-3333-333333333333';
    c_biz UUID := 'd4444444-4444-4444-4444-444444444444';
    c_eng_id UUID := 'e5555555-5555-5555-5555-555555555555';
    c_net UUID := 'f6666666-6666-6666-6666-666666666666';
BEGIN
    -- 1. Grab first existing instructor or admin profile ID
    SELECT id INTO inst_id FROM public.profiles WHERE role IN ('instructor', 'admin') LIMIT 1;
    
    IF inst_id IS NULL THEN
        -- If none exists yet, pick any profile
        SELECT id INTO inst_id FROM public.profiles LIMIT 1;
    END IF;

    -- Only proceed if there is a profile to attach courses to
    IF inst_id IS NOT NULL THEN

        -- ====================================================================
        -- 1. PYTHON PROGRAMMING (Page 1, 2, 3 in PDF)
        -- ====================================================================
        INSERT INTO public.courses (
            id, instructor_id, title, slug, description, category, level, duration, status, thumbnail_url, what_you_will_learn
        ) VALUES (
            c_python,
            inst_id,
            'Python Programming (Beginner to Advanced)',
            'basic-python',
            'Learn Python from scratch and become a professional developer. This course covers all essential concepts with practical examples, real-world data structures, and automation scripting.',
            cat_cs,
            'beginner',
            '12 Hours',
            'published',
            '/images/category-banners.jpeg',
            ARRAY[
                'Master Python syntax, variables, data types, and functions',
                'Object-Oriented Programming (OOP) with classes and inheritance',
                'File handling, JSON processing, and REST API integration',
                'Build 3 production-grade portfolio projects'
            ]
        ) ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            category = EXCLUDED.category,
            status = 'published',
            what_you_will_learn = EXCLUDED.what_you_will_learn;

        -- Lessons for Python
        INSERT INTO public.lessons (course_id, title, module_title, video_url, content, order_index)
        VALUES
            (c_python, 'Introduction to Python & Environment Setup', 'Module 1: Getting Started', 'https://www.youtube.com/watch?v=kqtD5dpn9C8', 'Welcome to Python! In this lesson we set up Python 3.12 and VS Code.', 1),
            (c_python, 'Variables, Types & Operators', 'Module 1: Getting Started', 'https://www.youtube.com/watch?v=kqtD5dpn9C8', 'Understand integers, floats, strings, booleans, and arithmetic operations.', 2),
            (c_python, 'Control Flow: Conditionals and Loops', 'Module 2: Core Concepts', 'https://www.youtube.com/watch?v=kqtD5dpn9C8', 'Deep dive into if-else statements, for loops, and while loops.', 3),
            (c_python, 'Functions, Scope & Recursion', 'Module 2: Core Concepts', 'https://www.youtube.com/watch?v=kqtD5dpn9C8', 'Writing modular, reusable clean code with Python functions.', 4)
        ON CONFLICT DO NOTHING;

        -- ====================================================================
        -- 2. HUMAN ANATOMY (MBBS) (Page 1 & 2 in PDF)
        -- ====================================================================
        INSERT INTO public.courses (
            id, instructor_id, title, slug, description, category, level, duration, status, thumbnail_url, what_you_will_learn
        ) VALUES (
            c_anatomy,
            inst_id,
            'Human Anatomy (MBBS)',
            'human-anatomy',
            'Comprehensive clinical and gross anatomy curriculum designed for medical and healthcare sciences students. Covers muscular, skeletal, and cardiovascular systems with 3D models.',
            cat_med,
            'intermediate',
            '18 Hours',
            'published',
            '/images/category-banners.jpeg',
            ARRAY[
                'Understand gross human anatomy and organ systems',
                'Clinical examination techniques and terminology',
                'Musculoskeletal structure and physiological function',
                'Cardiovascular and pulmonary pathway analysis'
            ]
        ) ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            category = EXCLUDED.category,
            status = 'published';

        -- ====================================================================
        -- 3. ADVANCED MATHEMATICS (Page 1 & 2 in PDF)
        -- ====================================================================
        INSERT INTO public.courses (
            id, instructor_id, title, slug, description, category, level, duration, status, thumbnail_url, what_you_will_learn
        ) VALUES (
            c_math_id,
            inst_id,
            'Advanced Mathematics',
            'advanced-mathematics',
            'Rigorous university mathematical foundations covering multivariable calculus, linear algebra, vector spaces, and differential equations for engineering and science.',
            cat_math,
            'advanced',
            '15 Hours',
            'published',
            '/images/category-banners.jpeg',
            ARRAY[
                'Multivariable calculus and partial derivatives',
                'Eigenvalues, eigenvectors, and matrix transformations',
                'Vector fields and Stokes theorem',
                'Applied differential equations in physical systems'
            ]
        ) ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            category = EXCLUDED.category,
            status = 'published';

        -- ====================================================================
        -- 4. BUSINESS MANAGEMENT (BBA) (Page 1 & 2 in PDF)
        -- ====================================================================
        INSERT INTO public.courses (
            id, instructor_id, title, slug, description, category, level, duration, status, thumbnail_url, what_you_will_learn
        ) VALUES (
            c_biz,
            inst_id,
            'Business Management',
            'business-management',
            'Master strategic management, organizational leadership, financial planning, and modern team motivation strategies for corporate and entrepreneurial success.',
            cat_bba,
            'beginner',
            '10 Hours',
            'published',
            '/images/category-banners.jpeg',
            ARRAY[
                'Principles of organizational leadership and communication',
                'Financial statement analysis and budget forecasting',
                'Strategic marketing and market opportunity assessment',
                'Project management frameworks: Agile and Lean'
            ]
        ) ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            category = EXCLUDED.category,
            status = 'published';

        -- ====================================================================
        -- 5. ENGLISH GRAMMAR (Page 2 in PDF)
        -- ====================================================================
        INSERT INTO public.courses (
            id, instructor_id, title, slug, description, category, level, duration, status, thumbnail_url, what_you_will_learn
        ) VALUES (
            c_eng_id,
            inst_id,
            'English Grammar',
            'english-grammar',
            'Enhance your academic and professional English fluency. Master grammatical accuracy, advanced sentence structures, vocabulary building, and confident writing.',
            cat_eng,
            'beginner',
            '12 Hours',
            'published',
            '/images/category-banners.jpeg',
            ARRAY[
                'Complete mastery over all 12 English tenses and conditionals',
                'Active vs. passive voice and reported speech',
                'Professional business emails and academic essay structure',
                'Common errors and accent reduction tips'
            ]
        ) ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            category = EXCLUDED.category,
            status = 'published';

        -- ====================================================================
        -- 6. COMPUTER NETWORKS (Page 2 in PDF)
        -- ====================================================================
        INSERT INTO public.courses (
            id, instructor_id, title, slug, description, category, level, duration, status, thumbnail_url, what_you_will_learn
        ) VALUES (
            c_net,
            inst_id,
            'Computer Networks',
            'computer-networks',
            'Master networking protocols from the physical layer to application layer. Learn TCP/IP, IP subnetting, DNS, routing algorithms, and network packet analysis.',
            cat_cs,
            'intermediate',
            '14 Hours',
            'published',
            '/images/category-banners.jpeg',
            ARRAY[
                'OSI Model vs TCP/IP protocol suite breakdown',
                'IPv4/IPv6 subnetting, CIDR, and VLSM calculations',
                'Routing protocols: OSPF, BGP, and RIP in depth',
                'Network security: SSL/TLS, firewalls, and VPN architecture'
            ]
        ) ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            category = EXCLUDED.category,
            status = 'published';

        RAISE NOTICE 'Knowlix seed courses successfully updated!';
    END IF;
END $$;
