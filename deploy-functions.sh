#!/bin/bash

# Script untuk deploy Supabase Edge Functions
# Pastikan Supabase CLI sudah terinstall dan login

echo "🚀 Deploying Supabase Edge Functions..."

# Deploy create-user function
echo "📤 Deploying create-user function..."
supabase functions deploy create-user --no-verify-jwt

# Deploy update-user function  
echo "📤 Deploying update-user function..."
supabase functions deploy update-user --no-verify-jwt

echo "✅ All functions deployed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Tambahkan kolom category ke tabel profiles (jalankan add_category_column.sql)"
echo "2. Restart aplikasi"
echo "3. Test create dan update user dengan category"