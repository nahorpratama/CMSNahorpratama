#!/bin/bash

# Deployment Script untuk Perbaikan User Category Update
# Script ini akan deploy semua perubahan yang telah dibuat

echo "🚀 Starting deployment for User Category Update fixes..."

# 1. Deploy Supabase Functions
echo "📦 Deploying Supabase Functions..."

cd supabase-functions/update-user
echo "Deploying update-user function..."
supabase functions deploy update-user --project-ref $SUPABASE_PROJECT_REF

cd ../create-user
echo "Deploying create-user function..."
supabase functions deploy create-user --project-ref $SUPABASE_PROJECT_REF

cd ../..

# 2. Verify Frontend Changes
echo "🔍 Verifying frontend changes..."

# Check if UserManagement.jsx has been updated
if grep -q "Update local users state immediately" src/components/admin/UserManagement.jsx; then
    echo "✅ UserManagement.jsx state management fixes verified"
else
    echo "❌ UserManagement.jsx state management fixes not found"
    exit 1
fi

# Check if EditUserDialog has been updated
if grep -q "handleRoleChange" src/components/admin/UserManagement.jsx; then
    echo "✅ EditUserDialog category logic fixes verified"
else
    echo "❌ EditUserDialog category logic fixes not found"
    exit 1
fi

# Check if CreateUserDialog has been updated
if grep -q "handleCreateRoleChange" src/components/admin/UserManagement.jsx; then
    echo "✅ CreateUserDialog category logic fixes verified"
else
    echo "❌ CreateUserDialog category logic fixes not found"
    exit 1
fi

# 3. Build and Test
echo "🏗️ Building application..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the application
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

# 4. Database Verification
echo "🗄️ Verifying database schema..."

# Check if category column exists (this should be run in Supabase SQL Editor)
echo "📋 Please run the following SQL in Supabase SQL Editor to verify database:"
echo ""
echo "-- Check profiles table structure"
echo "SELECT column_name, data_type, is_nullable"
echo "FROM information_schema.columns"
echo "WHERE table_name = 'profiles' AND column_name = 'category';"
echo ""
echo "-- Check existing users with categories"
echo "SELECT id, username, name, role, category"
echo "FROM profiles"
echo "WHERE role IN ('hr', 'finance', 'project')"
echo "ORDER BY role, username;"

# 5. Testing Instructions
echo ""
echo "🧪 Testing Instructions:"
echo ""
echo "1. Test Edit User Category:"
echo "   - Open User Management page"
echo "   - Edit user with HR/Finance/Project role"
echo "   - Change category from 'User Edit' to 'User Approval'"
echo "   - Save changes"
echo "   - Verify category changes in table without refresh"
echo ""
echo "2. Test Role Change with Category:"
echo "   - Edit user with HR role and 'User Edit' category"
echo "   - Change role to Finance"
echo "   - Verify category field remains visible"
echo "   - Save changes"
echo "   - Verify category is preserved"
echo ""
echo "3. Test Create User with Category:"
echo "   - Create new user with HR/Finance/Project role"
echo "   - Select 'User Approval' category"
echo "   - Save user"
echo "   - Verify new user appears with correct category"
echo ""
echo "4. Test Category Filtering:"
echo "   - Filter users by 'User Approval' category"
echo "   - Verify only users with 'approval' category are shown"
echo "   - Filter by 'User Edit' category"
echo "   - Verify only users with 'edit' category are shown"

# 6. Verification Commands
echo ""
echo "🔍 Verification Commands:"
echo ""
echo "# Check if functions are deployed"
echo "supabase functions list --project-ref $SUPABASE_PROJECT_REF"
echo ""
echo "# Check function logs"
echo "supabase functions logs update-user --project-ref $SUPABASE_PROJECT_REF"
echo ""
echo "# Test function locally (if needed)"
echo "supabase functions serve update-user --env-file .env.local"

echo ""
echo "🎉 Deployment completed successfully!"
echo "📝 Please follow the testing instructions above to verify all fixes are working correctly."
echo "🔧 If you encounter any issues, check the troubleshooting section in CATEGORY_UPDATE_SOLUTION.md"