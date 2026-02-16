# 1. Builder stage
FROM public.ecr.aws/docker/library/node:20.11.0 AS builder
WORKDIR /app

COPY package*.json ./
# 빌드 단계에서 생성된 .env.production을 복사합니다.
COPY .env.production .env.production 

RUN npm install -g npm@10.2.4 && npm install
COPY . .

# Next.js 빌드 (이때 .env.production 안의 NEXT_PUBLIC_ 변수들이 앱에 구워집니다)
RUN npm run build

# 2. Production stage
FROM public.ecr.aws/docker/library/node:20.11.0 AS production
WORKDIR /app

# 빌드 결과물만 가져옵니다.
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
# 런타임에 서버 사이드 변수가 필요한 경우를 위해 .env 파일도 복사합니다.
COPY --from=builder /app/.env.production .env.production

ENV NODE_ENV=production

EXPOSE 3000
CMD ["npm", "start"]