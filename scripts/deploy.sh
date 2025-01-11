#!/bin/bash

set -e  # 스크립트가 오류 발생 시 즉시 종료

cd /home/ubuntu/frontend

# ECR 로그인
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 294951093594.dkr.ecr.ap-northeast-2.amazonaws.com/frontend

# SecretsManager에서 모든 값 가져오기
SECRETS=$(aws secretsmanager get-secret-value --secret-id about/frontend --query SecretString --output text)

# .env 파일 생성
cat <<EOF > /home/ubuntu/frontend/.env
EDGE_AWS_ACCESS_KEY_ID=$(echo "$SECRETS" | jq -r '.EDGE_AWS_ACCESS_KEY_ID')
EDGE_AWS_SECRET_ACCESS_KEY=$(echo "$SECRETS" | jq -r '.EDGE_AWS_SECRET_ACCESS_KEY')
EDGE_DISTRIBUTION_ID=$(echo "$SECRETS" | jq -r '.EDGE_DISTRIBUTION_ID')
EDGE_URL=$(echo "$SECRETS" | jq -r '.EDGE_URL')
KAKAO_CLIENT_ID=$(echo "$SECRETS" | jq -r '.KAKAO_CLIENT_ID')
KAKAO_CLIENT_SECRET=$(echo "$SECRETS" | jq -r '.KAKAO_CLIENT_SECRET')
MONGODB_URI=$(echo "$SECRETS" | jq -r '.MONGODB_URI')
NEXTAUTH_SECRET=$(echo "$SECRETS" | jq -r '.NEXTAUTH_SECRET')
NEXTAUTH_URL=$(echo "$SECRETS" | jq -r '.NEXTAUTH_URL')
NEXT_PUBLIC_GA_MEASUREMENT_ID=$(echo "$SECRETS" | jq -r '.NEXT_PUBLIC_GA_MEASUREMENT_ID')
NEXT_PUBLIC_KAKAO_CLIENT_ID=$(echo "$SECRETS" | jq -r '.NEXT_PUBLIC_KAKAO_CLIENT_ID')
NEXT_PUBLIC_KAKAO_JS=$(echo "$SECRETS" | jq -r '.NEXT_PUBLIC_KAKAO_JS')
NEXT_PUBLIC_KAKAO_JS_KEY=$(echo "$SECRETS" | jq -r '.NEXT_PUBLIC_KAKAO_JS_KEY')
NEXT_PUBLIC_NAVER_CLIENT_ID=$(echo "$SECRETS" | jq -r '.NEXT_PUBLIC_NAVER_CLIENT_ID')
NEXT_PUBLIC_NAVER_CLIENT_SECRET=$(echo "$SECRETS" | jq -r '.NEXT_PUBLIC_NAVER_CLIENT_SECRET')
NEXT_PUBLIC_PWA_KEY=$(echo "$SECRETS" | jq -r '.NEXT_PUBLIC_PWA_KEY')
NEXT_PUBLIC_SENTRY_DSN=$(echo "$SECRETS" | jq -r '.NEXT_PUBLIC_SENTRY_DSN')
NEXT_PUBLIC_SENTRY_ORGANIZATION=$(echo "$SECRETS" | jq -r '.NEXT_PUBLIC_SENTRY_ORGANIZATION')
NEXT_PUBLIC_SENTRY_PROJECT=$(echo "$SECRETS" | jq -r '.NEXT_PUBLIC_SENTRY_PROJECT')
NEXT_PUBLIC_SERVER_URI=$(echo "$SECRETS" | jq -r '.NEXT_PUBLIC_SERVER_URI')
SENTRY_AUTH_TOKEN=$(echo "$SECRETS" | jq -r '.SENTRY_AUTH_TOKEN')
APPLE_ID=$(echo "$SECRETS" | jq -r '.APPLE_ID')
APPLE_KEY_ID=$(echo "$SECRETS" | jq -r '.APPLE_KEY_ID')
APPLE_PRIVATE_KEY=$(echo "$SECRETS" | jq -r '.APPLE_PRIVATE_KEY' | sed 's/\\n/\n/g')
APPLE_TEAM_ID=$(echo "$SECRETS" | jq -r '.APPLE_TEAM_ID')
EOF

# Docker 이미지 pull
docker pull 294951093594.dkr.ecr.ap-northeast-2.amazonaws.com/frontend:latest

# 기존 컨테이너 중지 및 삭제
if [ "$(docker ps -q -f name=next-app)" ]; then
    echo "Stopping existing container..."
    docker stop next-app
    docker rm next-app
fi

# 새 컨테이너 실행
docker run -d --name next-app \
  --env-file /home/ubuntu/frontend/.env \
  -p 3000:3000 \
  294951093594.dkr.ecr.ap-northeast-2.amazonaws.com/frontend:latest