#!/bin/bash
# Phase 4: Minikube Deployment Script
# This script deploys the AI Todo Chatbot application to Minikube

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  AI Todo Chatbot - Minikube Deployment ${NC}"
echo -e "${GREEN}========================================${NC}"

# Check prerequisites
echo -e "\n${YELLOW}Checking prerequisites...${NC}"

if ! command -v minikube &> /dev/null; then
    echo -e "${RED}Error: minikube is not installed${NC}"
    exit 1
fi

if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}Error: kubectl is not installed${NC}"
    exit 1
fi

if ! command -v helm &> /dev/null; then
    echo -e "${RED}Error: helm is not installed${NC}"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: docker is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}All prerequisites are installed!${NC}"

# Start Minikube if not running
echo -e "\n${YELLOW}Starting Minikube...${NC}"
if ! minikube status | grep -q "Running"; then
    minikube start --cpus=2 --memory=4096 --driver=docker
else
    echo -e "${GREEN}Minikube is already running${NC}"
fi

# Configure Docker to use Minikube's daemon
echo -e "\n${YELLOW}Configuring Docker to use Minikube's daemon...${NC}"
eval $(minikube docker-env)

# Build Docker images
echo -e "\n${YELLOW}Building Docker images...${NC}"

echo "Building frontend image..."
MINIKUBE_IP=$(minikube ip)
API_BASE_URL="http://${MINIKUBE_IP}:30081"
echo "Using API Base URL: $API_BASE_URL"
docker build -t todo-frontend:latest \
  --build-arg NEXT_PUBLIC_API_BASE_URL="$API_BASE_URL" \
  -f docker/Dockerfile.frontend ./frontend

echo "Building backend image..."
docker build -t todo-backend:latest -f docker/Dockerfile.backend ./backend

echo -e "${GREEN}Docker images built successfully!${NC}"

# Check for environment variables or prompt for secrets
echo -e "\n${YELLOW}Configuring secrets...${NC}"

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}Warning: DATABASE_URL is not set${NC}"
    echo "Please set it before running the application:"
    echo "  export DATABASE_URL='your_database_url'"
fi

if [ -z "$SECRET_KEY" ]; then
    echo -e "${RED}Warning: SECRET_KEY is not set${NC}"
    echo "Generating a random secret key..."
    SECRET_KEY=$(openssl rand -hex 16)
fi

if [ -z "$GEMINI_API_KEY" ]; then
    echo -e "${RED}Warning: GEMINI_API_KEY is not set${NC}"
    echo "Please set it before running the application:"
    echo "  export GEMINI_API_KEY='your_gemini_api_key'"
fi

# Deploy with Helm
echo -e "\n${YELLOW}Deploying with Helm...${NC}"

helm upgrade --install todo-app ./helm/todo-app \
    --set secrets.databaseUrl="$DATABASE_URL" \
    --set secrets.secretKey="$SECRET_KEY" \
    --set secrets.geminiApiKey="$GEMINI_API_KEY" \
    --wait --timeout=300s

echo -e "${GREEN}Deployment complete!${NC}"

# Wait for pods to be ready
echo -e "\n${YELLOW}Waiting for pods to be ready...${NC}"
kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=frontend --timeout=120s
kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=backend --timeout=120s

# Show status
echo -e "\n${YELLOW}Deployment Status:${NC}"
kubectl get pods
echo ""
kubectl get services

# Get the application URL
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  Application is ready!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Frontend URL:"
minikube service todo-frontend --url
echo ""
echo "To view logs:"
echo "  kubectl logs -f -l app.kubernetes.io/component=frontend"
echo "  kubectl logs -f -l app.kubernetes.io/component=backend"
