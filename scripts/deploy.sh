#!/bin/bash

set -e  # 오류 발생 시 즉시 종료

# 디렉토리 이동
cd /home/ubuntu/frontend

# 1. ECR 로그인
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 294951093594.dkr.ecr.ap-northeast-2.amazonaws.com/frontend

# 2. SecretsManager에서 값을 가져와 .env 파일 생성 (핵심 추가 파트)
echo "Fetching secrets and creating .env file..."
aws secretsmanager get-secret-value --secret-id about/frontend --query SecretString --output text | jq -r 'to_entries|map("\(.key)=\(.value)")|.[]' > .env

# 3. Docker 이미지 pull
docker pull 294951093594.dkr.ecr.ap-northeast-2.amazonaws.com/frontend:latest

# 4. 기존 컨테이너 중지 및 삭제
docker stop next-app || true
docker rm next-app || true

# 5. 새 컨테이너 실행
# 위에서 생성한 .env 파일을 주입합니다.
docker run -d --name next-app \
  --env-file .env \
  -p 3000:3000 \
  294951093594.dkr.ecr.ap-northeast-2.amazonaws.com/frontend:latest

# 6. 보안을 위해 사용 후 .env 파일 삭제 (선택 사항)
# rm .env