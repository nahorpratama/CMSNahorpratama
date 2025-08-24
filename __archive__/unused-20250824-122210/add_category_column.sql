-- Script untuk menambahkan kolom category ke tabel profiles
-- Jalankan script ini di Supabase SQL Editor

-- Tambahkan kolom category jika belum ada
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'category'
    ) THEN
        ALTER TABLE profiles ADD COLUMN category VARCHAR(50);
        RAISE NOTICE 'Kolom category berhasil ditambahkan ke tabel profiles';
    ELSE
        RAISE NOTICE 'Kolom category sudah ada di tabel profiles';
    END IF;
END $$;

-- Update beberapa user yang sudah ada dengan category default
UPDATE profiles 
SET category = 'edit' 
WHERE role IN ('hr', 'finance', 'project') 
  AND (category IS NULL OR category = '');

-- Tampilkan hasil
SELECT id, username, name, role, category 
FROM profiles 
WHERE role IN ('hr', 'finance', 'project')
ORDER BY role, name;