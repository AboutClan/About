# About 프론트엔드 아키텍처 규칙

이 문서는 새 기능을 추가하거나 기존 코드를 수정할 때 따라야 할 구조 규칙을 정의한다.
전체 배경과 마이그레이션 계획은 저장소 루트의 [`refactor-plan.md`](../refactor-plan.md)를 참고한다.

> **상태: 도메인 이전 완료.** 28개 도메인이 `features/` 아래로 옮겨졌고 `pageTemplates/`는
> `layout`·`setting`만 남았다. 공유 계층(`components/`)에는 아직 `atoms`/`molecules`/`organisms`라는
> 예전 이름이 남아 있는데, 이는 **이름만 남은 것이고 분류 기준은 이 문서를 따른다**(§3 참고).
> 남은 작업과 알려진 예외는 §9에 정리했다.

---

## 1. 기본 원칙

이 프로젝트는 **도메인(기능) 단위**로 코드를 조직한다. UI 계층(atom/molecule/organism)이 아니라
비즈니스 도메인이 1급 폴더 단위다.

핵심 규칙은 하나다. **같은 도메인의 코드는 한 폴더 아래에 모두 모인다.**

---

## 2. 폴더 구조와 책임

```
pages/                  Next.js Pages Router. 라우팅 진입점
features/<domain>/      도메인별 코드 (화면/컴포넌트/모달/훅/로직/상태/타입/상수)
components/             도메인 지식이 없는 공유 UI (layouts/, modals/, Icons/)
hooks/                  여러 도메인이 공유하는 훅
libs/backend/           서버 전용 코드
utils/                  도메인과 무관한 범용 헬퍼
types/                  여러 도메인이 공유하는 타입
constants/              앱 전역 상수
recoils/                앱 전역 상태 atom
content/                정적 콘텐츠 데이터 (공지/후기 등)
models/                 mongoose 모델 (서버 전용)
```

### `pages/` — 라우팅 진입점

Next.js가 라우팅을 위해 요구하는 것과, **이 URL 자체에 관한 처리**만 담는다.

| pages/에 남는 것 | features/screens로 옮기는 것 |
|---|---|
| `getServerSideProps` / `getStaticProps` / `getStaticPaths` | 도메인 데이터 조회 (react-query 훅) |
| 라우트 파라미터 파싱·검증·리다이렉트 | 비즈니스 계산 / 데이터 변환 |
| `useRouter()` 및 진입·이탈 시점의 얕은 처리 | 여러 하위 컴포넌트에 걸친 상태 관리 |
| 화면 컴포넌트를 렌더링하는 최소한의 JSX | 화면 레이아웃 구성 |

판단 기준은 **"이 코드가 라우팅에 관한 것인가, 도메인에 관한 것인가"** 다.
다른 `pages/` 파일에서 무언가를 import하는 것은 어떤 경우에도 금지한다.

### `features/<domain>/` — 도메인 코드

```
features/<domain>/
  screens/       페이지 단위 조합 컴포넌트. 데이터 훅 호출 + 하위 컴포넌트 조합
  components/    도메인 전용 프레젠테이션 컴포넌트 (카드, 리스트 아이템 등)
  modals/        도메인 전용 모달/드로어
  hooks/         queries.ts / mutations.ts (react-query 래퍼)
  lib/           순수 비즈니스 로직/계산
  state.ts       도메인 범위 recoil atom
  types.ts       도메인 모델 및 prop 타입 (커지면 types/ 폴더)
  constants.ts   도메인 전용 상수
```

도메인 이름은 `pages/<name>` 라우트 이름을 기준으로 한다. 같은 도메인을 두 이름으로 부르지 않는다.
(과거에 `groupStudy`/`group`, `secretSquare`/`community`처럼 같은 도메인을 두 이름으로 부르던 것은
각각 `group`, `community`로 통일했다.)

**스터디 관련 4개 도메인의 경계** — 이름이 비슷해 혼동하기 쉬우므로 명시한다.

| 도메인 | 책임 | 진입점 |
|---|---|---|
| `studyPage` | 바텀네비 스터디 탭 화면 | `pages/studyPage.tsx` |
| `study` | 여러 곳에서 진입하는 스터디 개별 화면 | `pages/study/*` |
| `cafeMap` | 카페맵 제품 전용 화면 | `pages/cafe-map*` (13개 라우트) |
| `studyMap` | 위 셋과 `vote`가 함께 쓰는 **지도·장소 선택 UI** | 없음 (다른 도메인이 참조) |

`studyMap`은 화면이 아니라 공유 모듈이다. 지도(`StudyPageMap`)와 지도가 여는 드로어
(`PlaceInfoDrawer`, `CafeListDrawer`, `StudyReviewDrawer`, `LocationAddDrawer`, `StudyMapMenuDrawer`)만
소유한다. 지도와 무관한 코드를 여기에 넣지 않는다.

### `components/` — 공유 UI

도메인 지식이 **전혀 없는** 코드만 들어간다. `features/`를 import하는 것은 금지한다.

| 폴더 | 담는 것 | 편입 조건 |
|---|---|---|
| `layouts/` | 앱 셸 (Header, PageSlide, Layout) | 앱 전체에 1벌만 존재하는 구조적 컴포넌트 |
| `modals/` | 모달/드로어 공통 기반(`Modals.tsx`, `drawer/`)과 범용 다이얼로그 | 열림/닫힘 메커니즘만 다루고, 내용은 children으로 주입받음 |
| `Icons/` | 아이콘 컴포넌트 | 도메인 화면이 아이콘 저장소 역할을 하지 않는다. 화면 안에 아이콘을 정의해 다른 곳에서 가져다 쓰지 말 것 |
| `atoms/` | 단일 책임 프리미티브 (Button, Badge, Skeleton) | 표시값·콜백만 받고, 도메인 엔티티를 import하지 않으며, 디자인 변경 시에만 수정됨 |
| `molecules/`, `organisms/` | 프리미티브보다 복합적인 범용 UI 패턴 | 도메인 이름을 붙일 수 없고, 다른 프로젝트에 복사해도 의미가 통함 |

> 폴더 이름은 예전 Atomic Design에서 왔지만 **계층 규칙으로 쓰지 않는다.** 실질적인 구분은
> `atoms` = 프리미티브, `molecules`/`organisms` = 복합 패턴이며, 판단 기준은 §3이다.
> 이름을 `ui`/`patterns`로 바꾸는 것은 400개 이상 파일의 import가 바뀌는 대형 변경이라
> 실익 대비 비용을 이유로 보류했다.

---

## 3. 공유 vs 도메인 소유 판단 기준

컴포넌트를 `components/`에 둘지 `features/<domain>/`에 둘지는 **사용처 개수로 정하지 않는다.**
2곳에서만 쓰여도 공유일 수 있고, 5곳에서 쓰여도 도메인 소유일 수 있다.

우선순위대로 판단한다.

1. **도메인 지식 결합** — 특정 도메인의 엔티티 필드명, 상태값, 비즈니스 규칙을 아는가?
   (예: "그룹 참여자 수", "스터디 출석 상태"를 다루면 도메인 결합)
2. **변경 이유** — 이 컴포넌트가 바뀌는 이유가 도메인 규칙 변경인가, 디자인 변경인가?
3. **소유권** — 누가 유지보수해야 자연스러운가?
4. **사용처 개수** — 위 셋으로 애매할 때만 참고하는 보조 근거.

**애매하면 도메인 로컬에 둔다.** 나중에 진짜 공유가 필요해지면 그때 올린다.

예: `GroupThumbnailCard`는 5개 도메인에서 쓰이지만 group 엔티티 필드를 직접 다루므로
`features/group/components/`가 소유한다. 다른 도메인은 이를 직접 import한다(아래 4번 참고).

---

## 4. 의존 방향

### 허용

- `pages/<domain>` → `features/<domain>/screens`, `components/layout`
- `features/<domain>/screens` → 같은 도메인의 모든 하위 폴더, `components/*`, 전역 `hooks|utils|recoils`
- `features/<domain>/components|modals` → 같은 도메인의 `hooks|lib|types|state`, `components/*`
- `features/<A>` → **`features/<B>/components`** — B가 소유한 개념을 그대로 보여줄 때만.
  소유권은 B에 남고, A는 그 컴포넌트 내부를 수정하지 않는다.
- `components/*` → `types`, `utils`, `recoils`, 다른 `components/*`

### 금지

- `components/*` → `features/*` (공유 UI가 도메인을 알면 안 됨)
- `pages/*` → `pages/*`
- `features/<domain>/lib|hooks` → `features/<domain>/screens|components` (역방향)
- `features/<A>` → `features/<B>/screens|hooks|lib|modals` (컴포넌트 재사용과 달리 로직 결합)

---

## 5. 네이밍

| 대상 | 규칙 |
|---|---|
| 컴포넌트 파일 | PascalCase, **기본 export 컴포넌트 이름과 정확히 일치** |
| 컴포넌트 export | 파일당 대표 컴포넌트 하나를 `export default` |
| Props 인터페이스 | `<ComponentName>Props` (`I` 접두사 없음) |
| 도메인 모델 타입 | `IUser`, `IStudy` 처럼 `I` 접두사 유지 (컴포넌트 계약과 구분) |
| 훅 파일 | `queries.ts` / `mutations.ts` (복수형) |
| 도메인 폴더 | `pages/<name>` 라우트 이름과 동일 |

파일 안에 부가 컴포넌트를 함께 정의하지 않는다. 다른 곳에서도 쓰면 별도 파일로 분리하고,
그 파일 안에서만 쓰면 export하지 않는다.

---

## 6. Import 경로

모든 내부 import는 **`@/` 별칭 절대경로**를 쓴다. 상대경로(`../`, `./`)는 쓰지 않는다.

```ts
// O
import Header from "@/components/layouts/Header";
import { useGatherQuery } from "@/features/gather/hooks/queries";

// X
import Header from "../../../components/layouts/Header";
```

이유: 파일을 옮겨도 그 파일 내부의 import가 바뀌지 않으므로, 구조 변경이 안전하고 diff가 작다.
`@/`는 저장소 루트를 가리킨다 (`tsconfig.json`의 `paths`).

---

## 7. 모달 Props

모달은 **렌더링 모델이 두 가지**이며, 서로 섞지 않는다.

### A. 조건부 마운트형 (대부분의 모달)

부모가 마운트 자체를 제어하고, 모달은 "닫아달라"는 신호만 보낸다.

```tsx
// 부모
{isOpen && <SomeModal onClose={() => setIsOpen(false)} />}

// 모달
interface SomeModalProps {
  onClose: () => void;
}
```

`isOpen` prop을 받지 않는다. 이 유형은 `onClose: () => void`로 통일한다.

### B. 상시 마운트 + 가시성 토글형

Chakra `useDisclosure` 관용구. 컴포넌트가 항상 마운트되고 `isOpen`으로 가시성만 바뀐다.

```tsx
interface SomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
```

### C. 목적별 추가 계약

확인/선택/폼 모달은 A 또는 B를 확장하되, 억지로 하나의 공통 타입으로 합치지 않는다.

```tsx
interface ConfirmModalProps extends DismissProps {
  onConfirm: () => void;
}
```

---

## 8. 새 기능을 추가할 때

1. **어느 도메인인가?** 기존 `features/<domain>/`이 있으면 거기에, 없으면 새로 만든다.
2. **화면을 추가한다면** `features/<domain>/screens/`에 만들고, `pages/`에는 그것을 렌더링하는 진입점만 둔다.
3. **데이터가 필요하면** `features/<domain>/hooks/queries.ts` 또는 `mutations.ts`에 추가한다.
   컴포넌트에서 `axios`를 직접 호출하지 않는다.
4. **비즈니스 계산이 있으면** `features/<domain>/lib/`로 분리한다. 컴포넌트에 인라인하지 않는다.
5. **컴포넌트를 만들면** 기본값은 `features/<domain>/components/`다.
   3번 항목의 기준을 통과할 때만 `components/`로 올린다.
6. **import는 `@/`로** 쓴다.
7. **커밋은** 파일 이동과 내용 변경을 같은 커밋에 섞지 않는다.

---

## 9. 검증

저장소에 테스트 스위트가 없다. 변경 후 최소한 아래를 실행한다.

```bash
yarn typecheck   # tsc --noEmit
yarn lint        # eslint .
yarn build       # next build
```

Storybook 스토리는 9개(atoms 전용)뿐이라 시각 회귀 검증 범위가 매우 좁다.
화면 동작은 `yarn dev`로 직접 확인해야 한다.

> **`yarn build`는 `yarn dev`가 떠 있으면 실패한다.** 두 프로세스가 같은 `.next` 디렉터리를
> 쓰기 때문이며, Windows에서는 `EPERM: ... .next\trace` 오류로 죽거나 타입 검사 단계에서
> 무한 대기한다. 빌드 전에 dev 서버를 종료할 것.

---

## 10. 알려진 예외와 남은 작업

아래는 **의도적으로 남겨둔 것**이다. 단순 이동으로는 해결되지 않고 코드 변경이 필요해서,
발견 시점에 근거와 함께 기록했다. 건드릴 일이 있으면 이 목록을 먼저 확인할 것.

### 공유 코드가 feature를 참조하는 곳 (남은 6건)

전부 **도메인 훅 호출을 호출부로 끌어올려야** 해결되는 것들이다. 단순 이동으로는 위반이 다른
파일로 옮겨갈 뿐이라 남겨두었다.

| 위치 | 참조 | 왜 그냥 못 옮기는가 |
|---|---|---|
| `components/molecules/cards/StudyThumbnailCard` | `features/study/lib` | 공유 `PickerRowButton`이 사용 |
| `components/molecules/cards/ProfileCommentCard` | `features/user/hooks` | 공유 컴포넌트 4개가 사용 |
| `components/molecules/ContentHeartBar` | feed·user 훅 | 공유 `FeedLayout`이 사용 → 영향이 7곳으로 번짐 |
| `components/molecules/PlaceImage` | study·user 훅 | 공유 컴포넌트 3개가 사용 |
| `components/drawers/PaymentConfirmationDrawer` | register·user | 소비처 0건 |
| `components/modals/common/BasicLiModal` | `features/user` | 소비처 0건 |

**해결한 사례를 참고할 것.** 위반이라고 해서 항상 역전이 필요한 건 아니다. 실제로는 절반이
"잘못된 위치" 문제였다.

- `GatherWritingConditionAgeRange` — 이름만 gather였고 `age`/`setAge`만 받는 범용 컴포넌트였다.
  공유 계층으로 옮기고 `AgeRangePicker`로 이름을 고치자 위반이 사라졌다.
- `HeartIcon`, `HeartCircleIcon` — `Icons/`에 있었지만 아이콘이 아니라 user mutation을
  호출하는 액션 버튼이었다. 도메인으로 옮기면 끝이었다.
- `ImageSlider` — 이건 진짜 역전이 필요했다. 타입 문자열로 6개 슬라이드를 하드코딩 분기하면서
  그중 둘이 도메인 코드였다. `children` 주입을 받도록 바꿨다.

**먼저 물어볼 것: 이게 정말 그 도메인의 것인가, 아니면 이름/위치만 틀린 범용 코드인가?**

### 소유권 미결정

`modals/aboutHeader`(14) · `modals/pop-up`(10) · `modals/system`(2) — 각각 여러 도메인이
소비해 한 곳으로 정할 수 없다. 이 안에 도메인 훅을 호출하는 모달이 11개 있는데, 배치를
정하기 전에는 손대지 않는 게 낫다. `pageTemplates/layout`도 앱 셸이라 도메인이 아니다.

### 그 외

- `features/cafeMap/screens/CafeMapStudyPage`가 `features/studyPage`의 화면 2개를 참조한다
  (도메인 간 화면 참조는 원칙상 금지이나, 카페맵이 스터디 탭 UI를 재사용하는 실제 관계다).
- `features/studyMap/components/StudyPageMap`이 `features/study/screens/StudyReview`의
  `RightReviewDrawer`를 참조한다 — 컴포넌트 추출이 필요하다.
- `features/community`가 `features/studyMap/components/TopNav`의 `XIcon`을 가져다 쓴다.
- 소비처가 0건인 파일이 10여 개 있다(`libs/group/checkGroupGathering`,
  `constants/contentsText/GroupStudyContents`, group 관련 recoil atom 3개 등). 확인 없이
  삭제하지 않았다.

### 남은 단계

우선순위 순으로 정리한다. 앞의 두 개는 **컴파일이 잡아주지 못하는 변경**이라, 손대기 전에
테스트를 붙이는 편이 낫다는 점을 감안할 것.

| 작업 | 규모 | 컴파일이 잡아주는가 |
|---|---|---|
| 위 6건의 훅 호출을 호출부로 끌어올리기 | 파일당 3~7곳 | 시그니처는 잡지만, 데이터 로딩·mutation 발생 **시점 변화**는 못 잡음 |
| 모달 Props 계약 통일 (§7의 A/B 유형) | 호출부 다수 | 시그니처는 잡음. 단 `setIsModal`을 여닫기 외 용도로 읽는 곳이 있으면 깨짐 |
| `pages/*` 얇은 진입점화 | 라우트 180여 개 | **거의 못 잡음.** `useEffect`를 화면으로 옮기면 실행 시점이 달라질 수 있음 |
| `modals/aboutHeader`·`pop-up`·`system` 배치 결정 | 26개 파일 | 결정이 먼저, 이동은 그다음 |
| 소비처 0건 파일 정리 | 10여 개 | 삭제 판단 필요 |

**`pages/*` 얇은 진입점화는 한 번에 하지 않는 것을 권한다.** 180개 라우트를 동시에 바꾸면
앱 전체를 다시 확인해야 하는데, 테스트가 없어 그 부담을 사람이 전부 진다. 대신 §8의 규칙을
지키면서 **그 페이지를 어차피 수정할 일이 생겼을 때 함께 정리하면** 위험 없이 같은 결과에
도달한다. gather 랜딩 라우트(232줄 → 5줄)가 그 예시다.
