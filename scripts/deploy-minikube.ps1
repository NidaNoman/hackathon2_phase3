# Phase 4: Minikube Deployment Script for Windows PowerShell
# This script deploys the AI Todo Chatbot application to Minikube

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Green
Write-Host "  AI Todo Chatbot - Minikube Deployment " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Check prerequisites
Write-Host "`nChecking prerequisites..." -ForegroundColor Yellow

$commands = @("minikube", "kubectl", "helm", "docker")
foreach ($cmd in $commands) {
    if (!(Get-Command $cmd -ErrorAction SilentlyContinue)) {
        Write-Host "Error: $cmd is not installed" -ForegroundColor Red
        exit 1
    }
}

Write-Host "All prerequisites are installed!" -ForegroundColor Green

# Start Minikube if not running
Write-Host "`nStarting Minikube..." -ForegroundColor Yellow
$minikubeStatus = minikube status 2>&1
if ($minikubeStatus -notmatch "Running") {
    minikube start --cpus=2 --memory=4096 --driver=docker
} else {
    Write-Host "Minikube is already running" -ForegroundColor Green
}

# Configure Docker to use Minikube's daemon
Write-Host "`nConfiguring Docker to use Minikube's daemon..." -ForegroundColor Yellow
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

# Build Docker images
Write-Host "`nBuilding Docker images..." -ForegroundColor Yellow

Write-Host "Building frontend image..."
$minikubeIp = minikube ip
$apiBaseUrl = "http://${minikubeIp}:30081"
Write-Host "Using API Base URL: $apiBaseUrl"
docker build -t todo-frontend:latest --build-arg NEXT_PUBLIC_API_BASE_URL=$apiBaseUrl -f docker/Dockerfile.frontend ./frontend

Write-Host "Building backend image..."
docker build -t todo-backend:latest -f docker/Dockerfile.backend ./backend

Write-Host "Docker images built successfully!" -ForegroundColor Green

# Check for environment variables
Write-Host "`nConfiguring secrets..." -ForegroundColor Yellow

if (-not $env:DATABASE_URL) {
    Write-Host "Warning: DATABASE_URL is not set" -ForegroundColor Red
    Write-Host "Please set it before running the application:"
    Write-Host '  $env:DATABASE_URL = "your_database_url"'
}

if (-not $env:SECRET_KEY) {
    Write-Host "Warning: SECRET_KEY is not set" -ForegroundColor Red
    Write-Host "Generating a random secret key..."
    $env:SECRET_KEY = [System.Guid]::NewGuid().ToString("N").Substring(0, 32)
}

if (-not $env:GEMINI_API_KEY) {
    Write-Host "Warning: GEMINI_API_KEY is not set" -ForegroundColor Red
    Write-Host "Please set it before running the application:"
    Write-Host '  $env:GEMINI_API_KEY = "your_gemini_api_key"'
}

# Deploy with Helm
Write-Host "`nDeploying with Helm..." -ForegroundColor Yellow

helm upgrade --install todo-app ./helm/todo-app `
    --set "secrets.databaseUrl=$env:DATABASE_URL" `
    --set "secrets.secretKey=$env:SECRET_KEY" `
    --set "secrets.geminiApiKey=$env:GEMINI_API_KEY" `
    --wait --timeout=300s

Write-Host "Deployment complete!" -ForegroundColor Green

# Wait for pods to be ready
Write-Host "`nWaiting for pods to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=frontend --timeout=120s
kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=backend --timeout=120s

# Show status
Write-Host "`nDeployment Status:" -ForegroundColor Yellow
kubectl get pods
Write-Host ""
kubectl get services

# Get the application URL
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  Application is ready!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend URL:"
minikube service todo-frontend --url
Write-Host ""
Write-Host "To view logs:"
Write-Host "  kubectl logs -f -l app.kubernetes.io/component=frontend"
Write-Host "  kubectl logs -f -l app.kubernetes.io/component=backend"
