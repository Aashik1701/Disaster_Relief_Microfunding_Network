./scripts/setup.sh#!/bin/bash

echo "🔨 Building Avalanche Disaster Relief Network..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd backend/api-server && npm install --production
cd ../monitoring-service && npm install --production
cd ../../..

# Build frontend
echo "🌐 Building frontend..."
npm run build

# Build backend
echo "🔧 Building backend..."
cd backend/api-server
npm run build
cd ../monitoring-service
npm run build
cd ../..

echo "✅ Build complete!"
echo ""
echo "Ready for deployment!"