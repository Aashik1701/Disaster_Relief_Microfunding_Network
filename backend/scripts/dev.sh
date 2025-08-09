#!/bin/bash

echo "🚀 Starting development environment..."

# Start database services
echo "🗄️  Starting database services..."
cd infrastructure/docker
docker-compose up -d postgres redis

# Start backend API server
echo "🔧 Starting backend API server..."
cd ../../backend/api-server
npm run dev &
BACKEND_PID=$!

# Start monitoring service
echo "📊 Starting monitoring service..."
cd ../monitoring-service
npm run dev &
MONITORING_PID=$!

# Start frontend
echo "🌐 Starting frontend..."
cd ../..
npm run dev &
FRONTEND_PID=$!

echo "✅ All services started!"
echo ""
echo "Frontend: http://localhost:3001"
echo "Backend API: http://localhost:3000"
echo "Monitoring: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID $MONITORING_PID $FRONTEND_PID
    cd infrastructure/docker
    docker-compose down
    echo "✅ All services stopped"
    exit
}

# Set trap to cleanup on script termination
trap cleanup SIGINT SIGTERM

# Wait for all background processes
wait