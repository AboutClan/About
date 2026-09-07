# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

프로젝트 개요·기능 설명·배포 파이프라인은 [README.md](README.md)에 상세히 있습니다. 이 문서는 거기에 없거나, 여러 파일을 읽어야만 드러나는 것만 다룹니다.

## Commands

```bash
nvm use                  # .nvmrc = Node 24.20.0 (npm 11)
npm ci                   # npm install 아님 — lockfile 그대로 재현 설치
npm run dev              # localhost:3000
npm run build            # 프로덕션 빌드 (156개 정적 페이지)
npm start                # 빌드 결과물 기동
npm run typecheck        # tsc --noEmit
npm run lint             # eslint .
npm run storybook        # localhost:6006
npm run build-storybook
npm run chromatic        # CHROMATIC_PROJECT_TOKEN 환경변수 필요
```

**테스트 러너가 없습니다.** jest/vitest 설정 자체가 없어 "단일 테스트 실행" 명령이 존재하지 않습니다. 회귀 검증은 `typecheck` → `build` → 수동 스모크가 담당하고, Storybook/Chromatic은 `stories/atoms/` 하위 9개 파일(원자 컴포넌트)만 커버합니다. 변경이 이 범위 밖이면 시각 회귀 테스트는 아무것도 잡아주지 못합니다.

`next.config.js`에 `eslint: { ignoreDuringBuilds: true }`가 있어 **lint는 빌드 게이트가 아닙니다.** 별도로 돌려야 합니다.

## 절대 무심코 바꾸면 안 되는 것

### Pages Router + React 18 조합은 의도적입니다

`pages/` 기반이고 App Router를 쓰지 않습니다. Next 15 문서 대부분이 App Router를 전제하므로, Async Request API·`cacheComponents`·Server Actions 관련 가이드는 이 저장소에 해당하지 않습니다.

React는 **18.3.1에 의도적으로 머물러 있습니다.** Next 15 Pages Router가 React 18을 공식 지원하기 때문입니다(peer: `react ^18.2.0 || ^19.0.0`). React 19로 올리면 다음이 연쇄로 딸려옵니다:

- `@chakra-ui/react` 2 → 3 (547개 파일, `extendTheme` 제거 + compound 컴포넌트 전면 개편)
- `styled-components` 5 → 6 (293개 파일, transient props 미사용이라 unknown-prop 경고 광범위 발생)
- `recoil` 제거 (유지보수 중단, React 19 미지원)

React 버전을 올리는 건 이 세 가지를 함께 하겠다는 결정입니다. 단독으로 올리지 마세요.

### Chakra UI와 styled-components가 공존합니다

Chakra가 547개 파일(전체의 50%), styled-components가 293개 파일(27%)에 걸쳐 있고 같은 파일 안에서 섞여 쓰입니다. 이건 정리 대상이 아니라 현재 구조입니다. 한쪽으로 통일하려면 컴포넌트 단위 수작업이 필요하므로 지나가는 길에 하지 마세요.

styled-components SSR은 **두 곳이 짝을 이룹니다** — `pages/_document.tsx`의 `ServerStyleSheet`/`collectStyles`와 `next.config.js`의 `compiler: { styledComponents: true }`. 둘 중 하나만 건드리면 hydration 스타일이 깨집니다.

### mongodb는 v5에 묶여 있습니다

`@next-auth/mongodb-adapter@1.1.3`의 peer가 `mongodb: ^5 || ^4`입니다. v6로 올리려면 `@auth/mongodb-adapter`로 바꿔야 하고, 이는 next-auth v4 → Auth.js v5 마이그레이션(119개 파일, `useSession` 95곳)을 강제합니다. mongoose 8이 내부적으로 mongodb 6을 번들해 드라이버가 이중으로 존재하지만, 정상 동작하므로 그대로 둡니다.

## 코드 컨벤션 (기존 코드가 이미 지키고 있음)

### React Query 호출은 전용 파일에만

`useQuery` 97곳이 전부 `**/hooks/queries.ts`(19개 파일)에, `useMutation` 110곳이 전부 `**/hooks/mutations.ts`(21개 파일)에 있습니다. 컴포넌트에 직접 쓴 곳은 **0건**입니다. 이 경계를 유지하세요.

단, `useQueryClient()` 57곳은 컴포넌트에 흩어져 있습니다(캐시 무효화 용도). 이건 기존 상태입니다.

`types/hooks/reactTypes.ts`의 `QueryOptions<T>` / `MutationOptions<T, R>`가 **단일 초크포인트**입니다. 이 파일이 깨지면 40개 래퍼 파일이 동시에 타입 에러를 냅니다. 반대로 여기만 정확히 고치면 대부분 전파 해결됩니다.

버전은 `react-query` v3(`@tanstack/react-query` 아님)이므로 v4/v5 API 시그니처를 쓰지 마세요.

### feature 모듈 구조

`features/<도메인>/` 아래에 `components/ hooks/ modals/ screens/ lib/`를 두는 형태입니다(도메인 28개: study, gather, group, cafeMap, community, point, register 등). 새 화면은 `pages/`에 얇은 라우트만 두고 실제 구현은 `features/`에 넣는 것이 기존 패턴입니다.

상태 관리 담당 구분은 [README의 "상태 관리 원칙"](README.md#상태-관리-원칙) 표를 따릅니다. Recoil atom은 `recoils/`에 모여 있고(29개, selector는 0개), 예외적으로 `features/gather/state.ts` 하나가 feature-local입니다.

### 토스트

`hooks/custom/CustomToast.tsx`가 Chakra의 `useToast`를 감싼 프로젝트 전용 훅이고 155곳에서 호출됩니다. Chakra의 `useToast`를 직접 부르지 마세요.

## 인증

`pages/api/auth/[...nextauth].ts`에 provider 4종(guest / credentials / kakao / apple)이 있습니다. 주의할 두 가지:

- **Apple**은 `generateClientSecret()`이 `jsonwebtoken`으로 ES256 JWT를 **매 요청 런타임 서명**합니다. Node 메이저 버전을 올릴 때 OpenSSL 동작 영향을 받을 수 있는 유일한 지점이므로 최우선 검증 대상입니다.
- `NEXTAUTH_URL` 프로토콜에 따라 `__Secure-` 쿠키 prefix와 `pkceCodeVerifier` 쿠키 이름을 **수동 분기**합니다.

`types/next-auth.d.ts`의 모듈 확장(`uid`, `role`, `location`, `isActive`)이 초크포인트입니다 — 깨지면 `useSession()` 95곳이 전부 타입 에러를 냅니다.

SSR 인증 게이트는 `libs/serverSideProps/adminAuth.ts` + `pages/gather/[id]/admin.tsx`, `pages/group/[id]/admin.tsx`, `pages/group/[id]/profile.tsx` 네 곳입니다.

## 데이터 흐름

Next.js API Route는 **16개뿐**이고 auth / cookiepay(결제) / store / token / naver-local / health만 담당합니다. 나머지 데이터는 전부 axios로 외부 NestJS 백엔드를 직접 호출합니다. 새 데이터가 필요할 때 API Route부터 만들지 마세요 — 기존 패턴은 백엔드 호출입니다.

DB 접근은 6개 파일에 격리되어 있습니다: `libs/backend/mongodb.ts`(MongoClient 싱글턴, NextAuth 어댑터 전용), `libs/backend/dbConnect.ts`(mongoose), `models/{account,gift,user}.ts`.

## 기타 확인된 사실

- **PWA는 동작하지 않습니다.** `next-pwa`는 제거되었습니다(설정 버그로 상시 비활성이었고, `manifest.json` 부재, `public/worker.js`를 등록하는 코드도 0건). "PWA가 왜 안 되지"를 디버깅하지 마세요 — 활성화하려면 새로 붙여야 합니다.
- `images.unoptimized: true`라 Next 이미지 최적화 파이프라인을 타지 않습니다. `formats`/`deviceSizes`/`imageSizes`/`domains` 설정은 현재 실효가 없습니다.
- `middleware.ts`는 `/home` 한 경로만 대상으로 하며 `cafe_map_auth_pending` 쿠키 분기만 합니다.
- ESLint는 legacy `.eslintrc.cjs` 형식입니다(flat config 아님). `eslint-plugin-react-hooks` v5가 `SwiperCore.use()`를 훅으로 오탐하므로 해당 지점에 disable 주석이 달려 있습니다 — swiper 11에 실재하는 유효한 static API입니다.
- `.npmrc`가 `.gitignore`에 있는데도 git에 추적 중이며 FontAwesome 토큰이 평문으로 이력에 남아 있습니다. `@fortawesome` 패키지는 현재 사용되지 않습니다.

## 배포

CodeBuild(`buildspec.yml`) → ECR → CodeDeploy(`appspec.yml`) → EC2 Docker(`scripts/deploy.sh`). Dockerfile은 멀티스테이지이고 `.dockerignore`가 `node_modules`/`.next`를 제외하므로 `COPY . .`가 Linux 바이너리를 덮어쓰지 않습니다 — 이 파일을 지우면 빌드가 깨집니다.

`.env.production`은 빌드 단계에서 이미지에 복사됩니다(`NEXT_PUBLIC_` 변수가 번들에 구워짐).

## 이 저장소에서 작업할 때

계획(플랜 모드)을 마치면 **실행 단계의 모델/effort 조정을 먼저 한 줄로 제안할 것.** 판단 기준은 계획서 자체입니다:

- "파일 N개 수정, 패턴 반복, 앱 소스 변경 없음" → Sonnet + medium 권장
- "A냐 B냐에 따라 이후가 갈린다"가 여러 번 등장 → Opus + high 유지 권장

전환은 계획↔실행 경계에서 **한 번만** 합니다(모델이든 effort든 중간에 바꾸면 프롬프트 캐시가 무효화됨). 실행 중 예상 못 한 문제가 터지면 다시 올립니다.

기계적 조사(파일 개수 세기, 사용처 집계)에 서브에이전트를 띄울 때는 `model: "sonnet"`을 지정합니다.
