-- Test script untuk memverifikasi kolom category
-- Jalankan di Supabase SQL Editor

-- 1. Periksa apakah kolom category sudah ada
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'category';

-- 2. Periksa data user yang ada
SELECT 
    id, 
    username, 
    name, 
    role, 
    category,
    created_at,
    updated_at
FROM profiles 
ORDER BY role, name;

-- 3. Test update category untuk user tertentu
-- Ganti USER_ID dengan ID user yang ingin diupdate
-- UPDATE profiles 
-- SET category = 'approval' 
-- WHERE id = 'USER_ID_HERE';

-- 4. Periksa apakah update berhasil
-- SELECT 
--     id, 
--     username, 
--     name, 
--     role, 
--     category
-- FROM profiles 
-- WHERE id = 'USER_ID_HERE';

-- 5. Periksa struktur tabel profiles
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 6. Periksa RLS policies pada tabel profiles
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles';