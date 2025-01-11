#!/bin/bash
cd /home/ubuntu/app
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 294951093594.dkr.ecr.ap-northeast-2.amazonaws.com/about
EDGE_AWS_ACCESS_KEY_ID=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.EDGE_AWS_ACCESS_KEY_ID')
EDGE_AWS_SECRET_ACCESS_KEY=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.EDGE_AWS_SECRET_ACCESS_KEY')
EDGE_DISTRIBUTION_ID=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.EDGE_DISTRIBUTION_ID')
EDGE_URL=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.EDGE_URL')
KAKAO_CLIENT_ID=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.KAKAO_CLIENT_ID')
KAKAO_CLIENT_SECRET=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.KAKAO_CLIENT_SECRET')
MONGODB_URI=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.MONGODB_URI')
NEXTAUTH_SECRET=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.NEXTAUTH_SECRET')
NEXTAUTH_URL=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.NEXTAUTH_URL')
NEXT_PUBLIC_GA_MEASUREMENT_ID=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.NEXT_PUBLIC_GA_MEASUREMENT_ID')
NEXT_PUBLIC_KAKAO_CLIENT_ID=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.NEXT_PUBLIC_KAKAO_CLIENT_ID')
NEXT_PUBLIC_KAKAO_JS=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.NEXT_PUBLIC_KAKAO_JS')
NEXT_PUBLIC_KAKAO_JS_KEY=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.NEXT_PUBLIC_KAKAO_JS_KEY')
NEXT_PUBLIC_NAVER_CLIENT_ID=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.NEXT_PUBLIC_NAVER_CLIENT_ID')
NEXT_PUBLIC_NAVER_CLIENT_SECRET=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.NEXT_PUBLIC_NAVER_CLIENT_SECRET')
NEXT_PUBLIC_PWA_KEY=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.NEXT_PUBLIC_PWA_KEY')
NEXT_PUBLIC_SENTRY_DSN=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.NEXT_PUBLIC_SENTRY_DSN')
NEXT_PUBLIC_SENTRY_ORGANIZATION=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.NEXT_PUBLIC_SENTRY_ORGANIZATION')
NEXT_PUBLIC_SENTRY_PROJECT=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.NEXT_PUBLIC_SENTRY_PROJECT')
NEXT_PUBLIC_SERVER_URI=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.NEXT_PUBLIC_SERVER_URI')
SENTRY_AUTH_TOKEN=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.SENTRY_AUTH_TOKEN')
APPLE_ID=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.APPLE_ID')
APPLE_KEY_ID=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.APPLE_KEY_ID')
APPLE_PRIVATE_KEY=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.APPLE_PRIVATE_KEY')
APPLE_TEAM_ID=$(aws secretsmanager get-secret-value --secret-id about/backend --query SecretString --output text | jq -r '.APPLE_TEAM_ID')

docker pull 294951093594.dkr.ecr.ap-northeast-2.amazonaws.com/about/front:latest
docker stop nest-app || true
docker rm nest-app || true
docker run -d \
    -e EDGE_AWS_ACCESS_KEY_ID=$EDGE_AWS_ACCESS_KEY_ID \
    -e EDGE_AWS_SECRET_ACCESS_KEY=$EDGE_AWS_SECRET_ACCESS_KEY \
    -e EDGE_DISTRIBUTION_ID=$EDGE_DISTRIBUTION_ID \
    -e EDGE_URL=$EDGE_URL \
    -e KAKAO_CLIENT_ID=$KAKAO_CLIENT_ID \
    -e KAKAO_CLIENT_SECRET=$KAKAO_CLIENT_SECRET \
    -e MONGODB_URI=$MONGODB_URI \
    -e NEXTAUTH_SECRET=$NEXTAUTH_SECRET \
    -e NEXTAUTH_URL=$NEXTAUTH_URL \
    -e NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID \
    -e NEXT_PUBLIC_KAKAO_CLIENT_ID=$NEXT_PUBLIC_KAKAO_CLIENT_ID \
    -e NEXT_PUBLIC_KAKAO_JS=$NEXT_PUBLIC_KAKAO_JS \
    -e NEXT_PUBLIC_KAKAO_JS_KEY=$NEXT_PUBLIC_KAKAO_JS_KEY \
    -e NEXT_PUBLIC_NAVER_CLIENT_ID=$NEXT_PUBLIC_NAVER_CLIENT_ID \
    -e NEXT_PUBLIC_NAVER_CLIENT_SECRET=$NEXT_PUBLIC_NAVER_CLIENT_SECRET \
    -e NEXT_PUBLIC_PWA_KEY=$NEXT_PUBLIC_PWA_KEY \
    -e NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN \
    -e NEXT_PUBLIC_SENTRY_ORGANIZATION=$NEXT_PUBLIC_SENTRY_ORGANIZATION \
    -e NEXT_PUBLIC_SENTRY_PROJECT=$NEXT_PUBLIC_SENTRY_PROJECT \
    -e NEXT_PUBLIC_SERVER_URI=$NEXT_PUBLIC_SERVER_URI \
    -e SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN \
    -e APPLE_ID=$APPLE_ID \
    -e APPLE_KEY_ID=$APPLE_KEY_ID \
    -e APPLE_PRIVATE_KEY=$APPLE_PRIVATE_KEY \
    -e APPLE_TEAM_ID=$APPLE_TEAM_ID \
    --name my-app -p 80:3001 294951093594.dkr.ecr.ap-northeast-2.amazonaws.com/about/front:latest 