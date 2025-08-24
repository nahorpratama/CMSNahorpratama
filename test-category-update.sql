-- Test User Category Update Functionality
-- This script tests the complete flow of updating user categories

-- 1. Check current profiles table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('id', 'username', 'name', 'role', 'category')
ORDER BY ordinal_position;

-- 2. Check existing users and their categories
SELECT 
    id,
    username,
    name,
    role,
    category,
    created_at,
    updated_at
FROM profiles 
WHERE role IN ('hr', 'finance', 'project')
ORDER BY role, username;

-- 3. Test updating a user category from 'edit' to 'approval'
-- Replace 'test-user-id' with an actual user ID from step 2
UPDATE profiles 
SET category = 'approval'
WHERE id = 'test-user-id' 
AND role IN ('hr', 'finance', 'project')
RETURNING id, username, name, role, category, updated_at;

-- 4. Verify the update was successful
SELECT 
    id,
    username,
    name,
    role,
    category,
    updated_at
FROM profiles 
WHERE id = 'test-user-id';

-- 5. Test updating multiple users with different categories
UPDATE profiles 
SET 
    category = CASE 
        WHEN role = 'hr' THEN 'approval'
        WHEN role = 'finance' THEN 'edit'
        WHEN role = 'project' THEN 'approval'
        ELSE category
    END,
    updated_at = NOW()
WHERE role IN ('hr', 'finance', 'project')
AND category IS NOT NULL
RETURNING id, username, name, role, category, updated_at;

-- 6. Check final state of all users
SELECT 
    id,
    username,
    name,
    role,
    category,
    created_at,
    updated_at
FROM profiles 
WHERE role IN ('hr', 'finance', 'project')
ORDER BY role, username;

-- 7. Test constraint validation (should fail for invalid categories)
-- This should fail and show the constraint error
UPDATE profiles 
SET category = 'invalid_category'
WHERE id = 'test-user-id'
AND role IN ('hr', 'finance', 'project');

-- 8. Check if there are any triggers or functions that might interfere
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'profiles';

-- 9. Verify RLS policies
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

-- 10. Test inserting a new user with category
INSERT INTO profiles (username, name, role, category)
VALUES ('test-category-user', 'Test Category User', 'hr', 'approval')
RETURNING id, username, name, role, category, created_at;

-- 11. Clean up test user
DELETE FROM profiles WHERE username = 'test-category-user';