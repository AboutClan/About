#!/bin/bash
set -euo pipefail

APP_DIR="/home/ubuntu/frontend"
ENV_FILE="$APP_DIR/.env"
IMAGE="294951093594.dkr.ecr.ap-northeast-2.amazonaws.com/frontend:latest"
CONTAINER="next-app"
SECRET_ID="about/frontend"
REGION="ap-northeast-2"

echo "==> [1] Prepare directory"
sudo mkdir -p "$APP_DIR"
sudo chown -R ubuntu:ubuntu "$APP_DIR"
sudo chmod -R 775 "$APP_DIR"

cd "$APP_DIR"

echo "==> [2] Ensure jq exists"
if ! command -v jq >/dev/null 2>&1; then
  echo "jq not found. installing..."
  sudo apt-get update -y
  sudo apt-get install -y jq
fi

echo "==> [3] Login to ECR"
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin 294951093594.dkr.ecr.$REGION.amazonaws.com

echo "==> [4] Fetch secrets"
SECRETS=$(aws secretsmanager get-secret-value --secret-id "$SECRET_ID" --query SecretString --output text)

echo "==> [5] Write .env"
cat > "$ENV_FILE" <<EOF
# ===== Runtime ENV (container) =====
NODE_ENV=production

NEXTAUTH_URL=$(echo "$SECRETS" | jq -r '.NEXTAUTH_URL')
NEXT_PUBLIC_NEXTAUTH_URL=$(echo "$SECRETS" | jq -r '.NEXT_PUBLIC_NEXTAUTH_URL')
NEXTAUTH_SECRET=$(echo "$SECRETS" | jq -r '.NEXTAUTH_SECRET')

NEXT_PUBLIC_SERVER_URI=$(echo "$SECRETS" | jq -r '.NEXT_PUBLIC_SERVER_URI')

NEXT_PUBLIC_GA_MEASUREMENT_ID=$(echo "$SECRETS" | jq -r '.NEXT_PUBLIC_GA_MEASUREMENT_ID')

NEXT_PUBLIC_KAKAO_CLIENT_ID=$(echo "$SECRETS" | jq -r '.NEXT_PUBLIC_KAKAO_CLIENT_ID')
NEXT_PUBLIC_KAKAO_JS=$(echo "$SECRETS" | jq -r '.NEXT_PUBLIC_KAKAO_JS')
NEXT_PUBLIC_KAKAO_JS_KEY=$(echo "$SECRETS" | jq -r '.NEXT_PUBLIC_KAKAO_JS_KEY')

NEXT_PUBLIC_NAVER_CLIENT_ID=$(echo "$SECRETS" | jq -r '.NEXT_PUBLIC_NAVER_CLIENT_ID')
NEXT_PUBLIC_NAVER_CLIENT_SECRET=$(echo "$SECRETS" | jq -r '.NEXT_PUBLIC_NAVER_CLIENT_SECRET')
NEXT_PUBLIC_NAVER_AI_CLIENT_ID=$(echo "$SECRETS" | jq -r '.NEXT_PUBLIC_NAVER_AI_CLIENT_ID')

NEXT_PUBLIC_PWA_KEY=$(echo "$SECRETS" | jq -r '.NEXT_PUBLIC_PWA_KEY')
NEXT_PUBLIC_TOSS_CLIENT_KEY=$(echo "$SECRETS" | jq -r '.NEXT_PUBLIC_TOSS_CLIENT_KEY')

# CookiePay (public)
NEXT_PUBLIC_COOKIEPAY_API_ID=$(echo "$SECRETS" | jq -r '.NEXT_PUBLIC_COOKIEPAY_API_ID')

# CookiePay (secret - server only)
COOKIEPAY_API_ID=$(echo "$SECRETS" | jq -r '.COOKIEPAY_API_ID')
COOKIEPAY_API_KEY=$(echo "$SECRETS" | jq -r '.COOKIEPAY_API_KEY')
COOKIEPAY_MODE=$(echo "$SECRETS" | jq -r '.COOKIEPAY_MODE')
COOKIEPAY_BASE_URL=$(echo "$SECRETS" | jq -r '.COOKIEPAY_BASE_URL')
EOF

chmod 600 "$ENV_FILE"
echo "✅ .env written to $ENV_FILE"

echo "==> [6] Pull latest image"
docker pull "$IMAGE"

echo "==> [7] Stop old container (if exists)"
docker stop "$CONTAINER" >/dev/null 2>&1 || true
docker rm "$CONTAINER" >/dev/null 2>&1 || true

echo "==> [8] Run new container"
docker run -d --name "$CONTAINER" \
  --restart always \
  --env-file "$ENV_FILE" \
  -p 3000:3000 \
  "$IMAGE"

echo "==> [9] Health check (quick)"
docker ps --filter "name=$CONTAINER"
docker logs --tail 30 "$CONTAINER" || true

echo "✅ Deploy finished"
