#!/usr/bin/env bash
# verify_deployment.sh
# Automates the spinning up, checking, and tearing down of the containerized environment.

set -eo pipefail

# Output colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Ensure SECRET_KEY is set for Docker Compose verification
export SECRET_KEY="${SECRET_KEY:-verification_secret_key_fallback_value}"

# 1. Start deployment
log_info "Building and launching Docker Compose containers in detached mode..."
docker compose up --build -d

# Cleanup hook on script exit to ensure environment is left clean
cleanup() {
    log_info "Stopping and cleaning up containers and volumes..."
    docker compose down -v
}
trap cleanup EXIT

# 2. Wait for DB and Backend to initialize
log_info "Waiting for backend API to respond..."
MAX_ATTEMPTS=20
TIMEOUT=3
ATTEMPT=0
API_STATUS=0

while [ "$ATTEMPT" -lt "$MAX_ATTEMPTS" ]; do
    ATTEMPT=$((ATTEMPT + 1))
    log_info "Polling http://localhost:8000/ (Attempt $ATTEMPT/$MAX_ATTEMPTS)..."
    
    # Try fetching with 2 second timeout
    STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 2 http://localhost:8000/ || true)
    
    if [ "$STATUS_CODE" -eq 200 ]; then
        API_STATUS=1
        break
    fi
    sleep $TIMEOUT
done

if [ "$API_STATUS" -ne 1 ]; then
    log_error "FastAPI backend failed to respond on port 8000 after $((MAX_ATTEMPTS * TIMEOUT)) seconds."
    exit 1
fi

log_success "FastAPI backend is responsive on port 8000!"

# 3. Check endpoints through Nginx Reverse Proxy
log_info "Verifying endpoints via Nginx reverse proxy (port 80)..."

# Test Frontend root page
FRONTEND_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/)
if [ "$FRONTEND_CODE" -eq 200 ]; then
    log_success "Frontend is successfully served by Nginx (HTTP $FRONTEND_CODE)."
else
    log_error "Frontend returned HTTP $FRONTEND_CODE at http://localhost/"
    exit 1
fi

# Test Backend API proxying
BACKEND_PROXY_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/openapi.json)
if [ "$BACKEND_PROXY_CODE" -eq 200 ]; then
    log_success "Nginx correctly proxied /api/openapi.json to backend (HTTP $BACKEND_PROXY_CODE)."
else
    log_error "Nginx failed to proxy /api/openapi.json (HTTP $BACKEND_PROXY_CODE at http://localhost/api/openapi.json)."
    exit 1
fi

# Test database tables existence and operation by creating a user via auth registration
RANDOM_VAL=$RANDOM
TEST_USERNAME="testuser_${RANDOM_VAL}"
TEST_EMAIL="test_${RANDOM_VAL}@example.com"
log_info "Testing database integration by creating a test user (${TEST_USERNAME})..."
REGISTER_RESPONSE_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"${TEST_EMAIL}\", \"username\": \"${TEST_USERNAME}\", \"nome\": \"Test\", \"sobrenome\": \"User\", \"password\": \"testpassword\"}" \
  http://localhost/api/auth/register || true)

if [ "$REGISTER_RESPONSE_CODE" -eq 201 ]; then
    log_success "Database initialization and User registration validated successfully (HTTP $REGISTER_RESPONSE_CODE)!"
else
    log_error "Database registration check failed (HTTP $REGISTER_RESPONSE_CODE at http://localhost/api/auth/register)."
    exit 1
fi

log_success "Deployment verification completed successfully. All components are operational!"
