#!/bin/bash

# Script untuk deploy update-user function
echo "Deploying update-user function..."

# Navigate to the function directory
cd supabase-functions/update-user

# Deploy the function
supabase functions deploy update-user --project-ref your-project-ref

echo "update-user function deployed successfully!"

# Optional: Check function status
echo "Checking function status..."
supabase functions list --project-ref your-project-ref | grep update-user