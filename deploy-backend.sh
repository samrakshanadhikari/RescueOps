#!/bin/bash

# DisAID Backend Deployment Script for Google Cloud

echo "🚀 DisAID Backend Deployment to Google Cloud"
echo "=============================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Please install it first:"
    echo "   brew install --cask google-cloud-sdk"
    exit 1
fi

# Check if logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo "🔑 Please login to Google Cloud..."
    gcloud auth login
fi

# Get or set project ID
PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    read -p "Enter your Google Cloud Project ID: " PROJECT_ID
    gcloud config set project $PROJECT_ID
fi

echo ""
echo "📋 Project: $PROJECT_ID"
echo ""

# Check for environment variables
echo "🔐 Checking environment variables..."

if [ -f .env ]; then
    echo "✅ .env file found"
    echo "⚠️  WARNING: .env will NOT be deployed (security)"
    echo "   You need to set environment variables in app.yaml or Secret Manager"
else
    echo "⚠️  No .env file found"
fi

echo ""
read -p "Have you configured environment variables in app.yaml or Secret Manager? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo ""
    echo "📝 Please add your environment variables:"
    echo "   MONGODB_URI"
    echo "   JWT_SECRET"
    echo "   GEMINI_API_KEY"
    echo ""
    echo "See DEPLOYMENT_GUIDE.md for instructions"
    exit 1
fi

# Enable required APIs
echo ""
echo "🔧 Enabling required Google Cloud APIs..."
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Deploy
echo ""
echo "🚀 Deploying backend to App Engine..."
echo ""

gcloud app deploy --quiet

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Backend deployed successfully!"
    echo ""
    echo "🌐 Your backend URL:"
    gcloud app browse --no-launch-browser
    echo ""
    echo "📊 View logs: gcloud app logs tail -s default"
    echo "🔍 View in console: https://console.cloud.google.com/appengine"
else
    echo ""
    echo "❌ Deployment failed. Check the errors above."
    exit 1
fi

