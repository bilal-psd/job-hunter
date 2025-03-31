#!/bin/bash

# Install Python dependencies
python -m pip install -r requirements.txt

# Install frontend dependencies
cd frontend
npm install
cd ..

# Start the backend server
echo "Starting backend server..."
python -m uvicorn backend.main:app --reload &

# Start the frontend development server
echo "Starting frontend development server..."
cd frontend
npm run dev 