-- Script untuk testing functionality category pada user management
-- Jalankan di Supabase SQL Editor untuk verifikasi

-- 1. Cek apakah kolom category sudah ada
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'category';

-- 2. Tampilkan semua user dengan role yang memerlukan category
SELECT 
    id,
    username,
    name,
    role,
    category,
    CASE 
        WHEN role IN ('hr', 'finance', 'project') AND category IS NULL THEN '⚠️ Perlu Category'
        WHEN role IN ('hr', 'finance', 'project') AND category IS NOT NULL THEN '✅ Category OK'
        WHEN role = 'admin' THEN '➖ Admin (No Category Needed)'
        ELSE '❓ Unknown Status'
    END as status
FROM profiles 
ORDER BY role, name;

-- 3. Statistik category usage
SELECT 
    role,
    category,
    COUNT(*) as user_count
FROM profiles 
WHERE role IN ('hr', 'finance', 'project')
GROUP BY role, category
ORDER BY role, category;

-- 4. Update user yang belum punya category (jika diperlukan)
UPDATE profiles 
SET category = 'edit' 
WHERE role IN ('hr', 'finance', 'project') 
  AND (category IS NULL OR category = '');

-- 5. Verifikasi hasil update
SELECT 
    'After Update' as step,
    role,
    category,
    COUNT(*) as user_count
FROM profiles 
WHERE role IN ('hr', 'finance', 'project')
GROUP BY role, category
ORDER BY role, category;