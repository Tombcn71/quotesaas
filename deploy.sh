#!/bin/bash

# KozijnSaaS - Deploy Script
echo "🚀 Deploying KozijnSaaS to Vercel..."

# Stage all changes
echo "📦 Staging changes..."
git add .

# Commit
echo "💾 Committing..."
git commit -m "Add SaaS platform with Supabase"

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push

echo ""
echo "✅ Done! Now:"
echo "1. Go to https://vercel.com"
echo "2. Import your GitHub repo"
echo "3. Add Supabase integration"
echo "4. Deploy!"

