#!/bin/bash

echo "🚀 Setting up Avalanche Disaster Relief Network..."

# Create .env file if it doesn't exist
if [ ! -f backend/api-server/.env ]; then
    echo "📝 Creating environment file..."
    cp backend/api-server/.env.example backend/api-server/.env
    echo "⚠️  Please update backend/api-server/.env with your configuration"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd backend/api-server && npm install
cd ../monitoring-service && npm install
cd ../../..

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p backend/api-server/logs

# Set up database
echo "🗄️  Setting up database..."
cd infrastructure/docker
docker-compose up -d postgres redis

echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database initialization
cd ../../backend/api-server
npm run migrate

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/api-server/.env with your configuration"
echo "2. Start the development servers:"
echo "   - Frontend: npm run dev (from project root)"
echo "   - Backend: cd backend/api-server && npm run dev"
echo "   - Monitoring: cd backend/monitoring-service && npm run dev"
echo "3. Or start all services with Docker:"
echo "   - cd infrastructure/docker && docker-compose up"