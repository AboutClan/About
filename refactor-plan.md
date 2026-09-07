# About 웹 프론트엔드 컴포넌트 아키텍처 재설계 계획 (v2)

> **이 문서는 계획서다. 실행 결과와 현재 구조 규칙은
> [`docs/architecture.md`](docs/architecture.md)를 본다.**
>
> ## 실행 결과 요약 (브랜치 `refactor/component-architecture`, 커밋 67개)
>
> | 완료 | 내용 |
> |---|---|
> | 기준선 | `typecheck`/`lint` 스크립트 신설, `@/*` 경로 별칭 도입 후 상대경로 import 전량 전환(802파일) |
> | 도메인 이관 | **28개 도메인**을 `features/<domain>/`로 이관. `pageTemplates/`는 `layout`·`setting`만 남음 |
> | 이름 통일 | `groupStudy`→`group`, `secretSquare`→`community` |
> | 지도 경계 분리 | `studyPage`/`study`/`cafeMap`/`studyMap` 4개 도메인으로 정리, cafeMap↔studyPage 순환 0건 |
> | 모달 통합 | 흩어져 있던 5곳 → 도메인 모달은 각 feature로, 공통 기반은 `components/modals/`로 |
> | 공유 계층 정리 | 공유→feature 위반 20건 중 14건 해소 |
> | 문서화 | `docs/architecture.md`에 구조 규칙·의존 방향·알려진 예외 기록 |
>
> **검증**: 매 배치마다 typecheck·lint·build 실행. 최종 전부 통과(156/156 페이지 생성).
> **`pages/` 아래 파일의 추가·삭제·이름변경 0건 — 모든 URL이 리팩토링 전과 동일하다.**
>
> 남은 작업과 그 위험도는 `docs/architecture.md` §10에 정리했다. 요지는,
> 남은 것들은 전부 **컴파일이 잡아주지 못하는 변경**이라 지금까지와 성격이 다르다는 것이다.

> v1 대비 변경: 공유 컴포넌트 판단 기준(도메인 지식/소유권 우선, 사용처 개수는 보조), `components/shared`의 잡동사니화 방지(`components/patterns`로 재정의 + 엄격한 편입 기준), 모달 Props를 하나로 강제 통일하지 않고 `ModalLayout`/`RightDrawer`/`AlertDialog`의 실제 API를 재조사해 계약 유형별로 재설계, `pages/*`의 JSX/훅 절대 금지 완화(라우팅 책임 vs 도메인 책임 기준으로 판단), 수동 검증을 "통과"로 자칭하지 않고 체크리스트로 명시, 실행 범위를 Phase 0~2(gather 파일럿)까지로 한정하고 재승인 게이트 추가, 순수 이동과 구조 변경 커밋 분리 원칙 명문화, 별도 브랜치 + 기존 미커밋 변경 선(先) 커밋 원칙 추가.

## 실행 중 확정된 변경 (Phase 0)

계획 승인 후 실제 코드를 확인하며 드러난 사실에 따라 두 가지를 수정했다.

**1. `@/*` 경로 별칭 도입 (사용자 승인, 전체 일괄 전환)**
`tsconfig.json`에 `baseUrl`/`paths`가 없어 모든 import가 상대경로였다. 이 상태에서는 파일을 옮길 때
그 파일 **자신의** import가 전부 함께 바뀐다(예: `pageTemplates/gather/detail/GatherHeader.tsx`는
20줄). 즉 §9가 롤백 안전장치로 정의한 "순수 이동 = 내용 무변경"이 물리적으로 불가능했다.
별칭 도입 후에는 파일이 어디로 옮겨져도 내부 import가 바뀌지 않으므로, 이동 = `git mv` +
호출부의 경로 문자열 치환이 되어 git이 rename(R100)으로 인식한다.
저장소 전체 802개 파일 / 4139개 import를 일괄 전환했고, diff가 import 문에만 국한됨을 확인했다.

**2. 공유 계층(`ui`/`patterns`) 확립을 도메인 이관 *이후*로 옮김 (사용자 승인, §11 Phase 1 축소)**
Phase 1 후보 12개를 실제로 읽어보니 6개만 공유 자격이 있었다. `Avatar`(user 도메인 규칙 내장),
`MenuButton`(`pageTemplates/user`에서 아이콘 import + 대기인원 배지), `BottomNav`(라우트/IA 맵 하드코딩),
`PageTracker`(5개 도메인 글쓰기 단계 맵), `AlertDialog`("가입 거절" 문구 고정)는 도메인 소유였다.
즉 **무엇이 공유인지는 도메인을 걷어내야 확정된다.** 또한 별칭 도입으로 "공유 계층이 도메인 이동의
전제조건"이라는 §11의 가정도 사라졌다(도메인 파일은 공유 컴포넌트 위치와 무관하게 import한다).
따라서 Phase 1은 **도메인 지식이 전혀 없고 즉시 가치가 있는 모달 통합**으로 한정하고,
`components/ui`·`patterns`는 도메인 이관이 끝나 `atoms|molecules|organisms`에 공유분만 남았을 때 정리한다.
폴더 이름도 새로 만들지 않고 기존 `components/layouts/`·`components/modals/`를 그대로 목표로 삼는다
(`layout/`·`modal/` 단수형을 새로 만들면 유사한 두 폴더가 공존해 오히려 혼란스럽다).

**3. Storybook/Chromatic은 이번 마이그레이션의 검증 수단이 아니다 (§6·§12 정정)**
스토리가 9개뿐이고 전부 `components/atoms/` 프리미티브다. gather 도메인 스토리는 0개이므로
Phase 2에서 Chromatic은 아무 신호도 주지 못한다. 계획에서 이를 검증 수단으로 적은 것은 과대평가였다.
**실질 안전망은 typecheck + lint + build + 사용자 수동 확인뿐이다.**
단, Storybook 빌드 자체는 CI(`.github/workflows/chromatic.yml`)에서 돌므로 깨지지 않아야 하며,
Phase 1에서 atoms를 옮길 때 그 9개 스토리의 import를 함께 고쳐야 한다.

## Context

`About`은 Next.js 14(Pages Router) + React 18 + TypeScript 5 기반, 페이지 200개 이상·컴포넌트 수백 개 규모 저장소다. 시각적 디자인(색상/타이포/간격/레이아웃/UX)과 기존 기능·API 동작은 그대로 유지한 채, **컴포넌트 아키텍처 자체**(폴더 구조, 컴포넌트 분류 기준, 책임 경계, 의존 방향, 네이밍 규칙)를 저장소 규모와 실제 코드 사용 패턴에 맞게 다시 설계하는 것이 목표다. 기존 Atomic Design을 그대로 유지할 필요도, 유행하는 구조를 근거 없이 적용할 필요도 없다는 전제 하에, 6개의 심층 조사 에이전트와 추가 코드 확인을 통해 다음을 실증적으로 확인했다. **도메인 기반 아키텍처(features/&lt;domain&gt;) 방향 자체는 사용자 승인 완료.** 이 문서는 세부 설계와 실행 방식을 사용자 피드백에 맞게 재조정한 버전이다.

### 현재 구조가 유지보수를 어렵게 만드는 핵심 원인 (증거 기반)

1. **Atomic Design 계층이 실제로는 지켜지지 않는다.** `components/atoms/badges/SpecialBadge.tsx`가 `useUserInfo()`를 호출하고 멤버십 모달을 직접 띄우는 등, "atom"에 훅 호출·모달 오픈·도메인 타입 임포트가 섞여 있다. `components/molecules/cards/GatherThumbnailCard.tsx`(321줄) 같은 완전한 도메인 기능 컴포넌트가 "molecule"로 분류돼 있다.
2. **계층 간 의존 방향이 양방향으로 깨져 있다.** `components/atoms/BottomCommentInput.tsx:5`(atom→pageTemplates), `components/molecules/ContentHeartBar.tsx:17`(molecule→organism), `components/organisms/WritingConditionLayout.tsx:5`(organism→pageTemplates) 등 확인됨.
3. **모달/드로어 관련 컴포넌트가 5곳에 흩어져 있다.** `modals/`, `components/modals/`, `components/overlay/`, `components/drawers/`, `components/organisms/drawer/`.
4. **도메인 이름이 폴더마다 다르다.** `hooks/groupStudy/` vs `pages/group/`·`libs/group/` (사용자 확인: 통합), `hooks/secretSquare/` vs `pages/community/` (사용자 확인: `community`로 통일). `pageTemplates/study/`와 `pageTemplates/studyPage/`는 내비게이션 레벨이 다른 별개 화면임을 확인(studyPage=바텀네비 최상위 탭, study=여러 진입점에서 들어가는 개별 화면 — studyPage 외에도 여러 화면에서 study로 진입 가능하다고 사용자 확인) → **별도 도메인 유지**.
5. **`pages/`↔`pageTemplates/`의 얇은 페이지 원칙이 일관되게 지켜지지 않는다.** `pages/study/[id]/[date]/index.tsx`(635줄)는 react-query 훅 4개를 직접 호출하고 다른 페이지 파일(`pages/group/index.tsx`)에서 헬퍼를 가져오는 page-to-page 결합까지 있다. 반대로 `pages/home/index.tsx`(66줄)는 얇다.
6. **데이터 요청·비즈니스 로직 위치가 도메인마다 다르다.** `libs/<domain>/`이 있는 도메인(study, group)과 없는 도메인(gather)이 섞여 있고, `utils/groupUtils.ts`처럼 도메인 전용 로직이 범용 `utils/`에 섞여 있다.
7. **모달의 "닫기" 계약이 파일마다 다르게 구현돼 있다** — 아래 섹션 4에서 실제 코드 3건을 직접 읽어 재분석함.
8. **공유 가능한 부분과 도메인 전용 부분의 경계가 재사용 횟수만으로는 판단되지 않는다** — 아래 섹션 2에서 기준을 재정의함.

---

## 1. 아키텍처 옵션 비교 (변경 없음, 승인됨)

| 옵션 | 설명 | 채택 여부 |
|---|---|---|
| A. 현행 Atomic Design 유지 + 위반사항만 수정 | 계층은 유지, 의존성 위반만 고침 | 기각 — 근본 원인(도메인 코드가 UI 계층 기준 폴더에 흩어짐) 미해결 |
| B. Feature-Sliced Design 등 트렌드 구조 전면 도입 | entities/widgets/features 다계층 | 기각 — 근거 없는 유행 구조 도입, 학습/전환 비용 대비 이득 불명확 |
| **C. 도메인(Feature) 기반 구조** — `features/<domain>/{screens, components, modals, hooks, lib, types, constants, state}` + 얇은 공유 계층 | 기존 `hooks/<domain>/queries.ts`, `pages/<domain>/` 컨벤션의 자연스러운 확장 | **채택 (승인됨)** |

---

## 2. 공유 컴포넌트 판단 기준 (재설계 — 사용처 개수는 더 이상 절대 기준이 아님)

### 이전 기준의 문제
"3개 이상 도메인에서 사용됨 → 공유 계층"이라는 규칙은 두 방향 모두에서 틀릴 수 있다.
- **2개 도메인에서만 쓰여도** 특정 도메인 소유로 보기 어려운 순수 범용 UI일 수 있다(예: 범용 액션 버튼).
- **3개 이상에서 쓰여도** 비즈니스 개념(엔티티의 필드/상태값)에 강하게 결합된 컴포넌트일 수 있다.

### 새 판단 기준 (우선순위 순)
1. **도메인 지식 결합 여부 (1차 기준)** — 이 컴포넌트가 특정 도메인의 엔티티 필드명, 상태값(enum), 비즈니스 규칙을 알고 있는가? 예: "그룹 참여자 수", "스터디 출석 상태" 같은 값을 직접 다루면 도메인 지식 결합으로 판단.
2. **변경 이유 (1차 기준)** — 이 컴포넌트가 바뀌어야 하는 이유가 "해당 도메인의 비즈니스 규칙이 바뀔 때"인가, 아니면 "디자인 시스템/범용 UI 패턴이 바뀔 때"인가? 전자면 도메인 소유, 후자면 공유 후보.
3. **소유권 (1차 기준)** — 이 컴포넌트를 누가 책임지고 유지보수해야 하는가? 특정 도메인 담당자가 관리해야 자연스럽다면 도메인 소유.
4. **사용처 개수 (보조 근거만)** — 위 세 기준을 판단하기 애매할 때 참고하는 부가 정보일 뿐, 그 자체로 결론을 내리지 않는다.

### 재평가 예시 (v1의 판단을 뒤집음)
- **`components/molecules/cards/GroupThumbnailCard.tsx`** (gather/study/group/home/user 5개 도메인 사용): 참여자 수, 그룹 상태(status) 등 **group 도메인의 엔티티 필드를 직접 알고 있음** → 도메인 지식 결합 있음 → **`features/group/components/`로 소유권 유지**. 다른 도메인이 "group 엔티티를 그대로 보여주고 싶을 때"는 group 도메인 소유 컴포넌트를 직접 import하는 것을 허용한다(→ 섹션 4 의존 규칙 수정 참고). 사용처가 5곳이라는 사실만으로 무주공산(shared)으로 옮기지 않는다.
- **`components/atoms/buttons/MenuButton.tsx`** (5개 도메인 사용): 아이콘+클릭 콜백만 받는 범용 액션 트리거로, 어떤 도메인의 데이터/상태도 알지 못함 → 도메인 지식 결합 없음 → `components/ui/`(프리미티브)로 이동 타당.
- **`components/molecules/navs/TabNav.tsx`** (17개 파일): 탭 라벨/선택 상태만 받는 순수 UI → `components/ui/`.
- **`components/molecules/cards/PostAuthorCard.tsx`** (community 1곳만 사용): 사용처가 1곳뿐이지만, 이것만으로 도메인 로컬이라 단정하지 않고 "author/user 프로필 요약을 다른 도메인에서도 재사용할 가능성이 있는가"를 확인해야 함 — 현재 증거로는 community의 게시글 작성자 표시에 강하게 결합돼 있어 `features/community/components/`로 배치(기존 결론 유지, 근거만 사용처 수 대신 도메인 결합도로 교체).

---

## 3. `components/` 공유 계층 — `patterns/`로 재정의 (잡동사니 폴더 방지)

v1의 `components/shared/`는 "애매하면 여기"라는 회피 폴더가 될 위험이 있어 폐기한다. 대신 공유 계층을 **역할이 명확한 4개 폴더**로만 구성하고, 각 폴더는 편입 체크리스트를 통과해야만 파일을 받을 수 있다.

| 폴더 | 정의 | 편입 체크리스트 |
|---|---|---|
| `components/ui/` | 도메인 지식이 전혀 없는 단일 책임 프리미티브 (Button, Input, Avatar 표시부, Badge, Text, MenuButton 등) | ① props가 순수 표시값/콜백만 받는가 ② 어떤 도메인 엔티티도 import하지 않는가 ③ 디자인 시스템 변경 시에만 수정될 것인가 — 셋 다 예일 때만 편입 |
| `components/layout/` | 앱 셸/내비게이션 골격 (Header, PageSlide, BottomNav, PageTracker, Layout 래퍼) | 앱 전체에서 정확히 1벌만 존재해야 하는 구조적 컴포넌트인가 — 예일 때만 편입 |
| `components/modal/` | 모달/드로어의 **공통 기반**(계약 유형별 base — 섹션 4 참고)과, 도메인 데이터를 다루지 않는 범용 다이얼로그(예: 순수 확인/취소만 하는 AlertDialog) | ① 모달의 열림/닫힘 매커니즘 자체를 다루는가(콘텐츠는 다루지 않음) ② 콘텐츠 슬롯(children)으로만 도메인 내용을 주입받는가 — 도메인 데이터를 직접 알면 편입 불가 |
| `components/patterns/` | 도메인 지식은 전혀 없지만 프리미티브보다 복합적인 **재사용 UI 패턴** (Carousel/Slider 래퍼, Accordion, Pagination, InfiniteScroll 래퍼, EmptyState, Skeleton 리스트 래퍼) | ① 도메인 이름이 붙지 않고 붙일 수도 없는가(예: "GatherCarousel"이 아니라 "Carousel"인가) ② 다른 프로젝트에 그대로 복사해도 의미가 통하는가 — 하나라도 아니오면 편입 불가, 해당 도메인 `components/`로 |

이동 시점에 위 체크리스트를 통과하지 못하면 기본값은 **도메인 로컬 유지**다(섹션 2의 우선순위와 동일 원칙). `components/patterns/`가 비어 있거나 소수 파일만 있는 상태가 정상이며, 억지로 채우지 않는다.

---

## 4. 모달 Props — 강제 단일화 대신 실제 API 기반 계약 유형 분리

### 재조사 결과 (코드 직접 확인)
- **`modals/Modals.tsx`의 `ModalLayout`** (`IModalLayout extends IModal`, `IModal { setIsModal: DispatchBoolean }`): `isOpen`이라는 prop이 아예 없다. 내부적으로 `<Modal isOpen={true} onClose={...}>`로 **항상 열린 상태로 렌더링**되며, 호출부가 `{show && <ModalLayout setIsModal={setShow} .../>}`처럼 **조건부 마운트로 열림/닫힘을 제어**하는 패턴이다. "닫기"는 `setIsModal(false)` 호출로 구현된다. 224곳 대부분이 이 패턴이다.
- **`components/organisms/drawer/RightDrawer.tsx`**: 동일하게 `isOpen`을 하드코딩(`isOpen` 리터럴, prop 아님)하고 부모가 조건부 마운트로 제어하는 **같은 마운트-제어 패턴**이지만, 닫기 콜백 이름이 `onClose: () => void`(순수 콜백)로, `setIsModal`(state setter)과 타입이 다르다.
- **`modals/AlertDialog.tsx`**: `IAlertDialog { isOpen: boolean; onClose: () => void }`로 **진짜 `isOpen` prop을 받아 Chakra `useDisclosure` 관용구처럼 마운트 유지 + 가시성만 토글**하는, 완전히 다른 렌더링 모델이다.

즉 최소 **2가지 서로 다른 렌더링 모델**(조건부 마운트 vs 상시 마운트+isOpen 토글)이 실재하며, 이를 하나의 `{isOpen, onClose}` Props로 강제 통일하는 것은 v1의 오류였다 — 렌더링 모델이 다른 컴포넌트를 같은 계약으로 묶으면 동작이 바뀔 위험이 있다.

### 재설계: 계약 유형을 분리하고, 같은 유형 안에서만 이름을 통일

| 계약 유형 | 실제 렌더링 모델 | 현재 존재하는 이름 변형 | 조치 |
|---|---|---|---|
| **A. 조건부 마운트형 닫기 콜백** | 부모가 `{show && <X />}`로 마운트 자체를 제어, 컴포넌트는 "닫아달라"는 신호만 부모에 전달 | `IModal{setIsModal: DispatchBoolean}`(224곳), `CloseProps{onClose: () => void}`, 비타입 `{onClose}` | **이 유형끼리만** `onClose: () => void`로 이름 통일 (섹션 8의 "이름만 바꾸는 별도 커밋"에서 처리). `setIsModal` 호출부는 `onClose={() => setIsModal(false)}` 어댑터로 감싸되, **다른 곳에서 그 boolean 상태를 추가로 읽고 있는지 이동 전에 개별 확인** — 상태가 오직 이 모달의 마운트 여부만을 위해 쓰인다고 확인된 경우에만 통일 대상에 포함 |
| **B. 상시 마운트 + isOpen 토글형** | Chakra `useDisclosure` 관용구, 컴포넌트는 항상 마운트되고 `isOpen`으로 가시성만 바뀜 | `AlertDialog` 등 | **그대로 유지.** A유형과 절대 섞지 않음. `isOpen`을 A유형에 추가하지 않음(A유형은 애초에 isOpen을 쓰지 않는 렌더링 모델이므로) |
| **C. 확인/선택/폼 등 부가 계약** | A 또는 B 위에 목적별 props가 추가로 얹힘 | `footerOptions.main.func`(확인 버튼 콜백), RHF 기반 폼 모달의 `onSubmit`/필드 props, 선택형 모달의 `onSelect` 등 | **통일하지 않는다.** 각 목적별 인터페이스로 유지하되, 베이스는 A 또는 B 중 하나를 extends하도록 정리 (예: `interface IConfirmModalProps extends ADismissProps { onConfirm: () => void }`) |

`components/modal/types.ts`에는 **하나의 만능 `ModalProps`가 아니라** `ADismissProps { onClose: () => void }`와 `BControlledProps { isOpen: boolean; onClose: () => void }` 두 개의 베이스만 정의하고, 나머지는 각 모달이 필요한 만큼 조합해서 확장한다. 기존 `types/components/modalTypes.ts`의 `ModalProps{handleClick}`은 위 어느 유형과도 다른 세 번째 변형이므로, 실제 사용처를 확인해 A/B 중 어디에 해당하는지 판별한 뒤 흡수한다(지금 추측하지 않음 — 마이그레이션 시 해당 파일들을 직접 읽고 결정).

이 통일 작업(A유형 이름 통일)은 **가치는 있지만 224곳에 걸친 대규모 기계적 diff**이므로, 아키텍처 이전과 같은 커밋에 절대 섞지 않고, gather 파일럿 이후 별도로 도메인 단위 배치를 나눠 진행한다(섹션 9 참고, 필수 작업이 아니라 각 도메인 이전 완료 후 선택적으로 뒤따르는 정리 작업으로 격하).

---

## 5. `pages/*`의 책임 — 절대 금지 대신 "라우팅 책임 vs 도메인 책임" 기준

v1의 "JSX/훅 호출 전면 금지"는 과도하다. Next.js Pages Router에서 `pages/*` 파일이 자연스럽게 소유해야 하는 코드까지 억지로 `features/<domain>/screens/`로 밀어내면 오히려 라우팅 관심사가 두 파일에 쪼개져 추적하기 어려워진다.

### 판단 기준
- **라우팅 계약 함수**(`getServerSideProps`, `getStaticProps`, `getStaticPaths`, `middleware` 연동)는 Next.js가 `pages/*` 파일에만 요구하는 것이므로 항상 `pages/*`에 남는다.
- **라우트 파라미터 파싱/유효성 검사/리다이렉트**처럼 "이 URL 자체에 대한 처리"는 라우팅 책임 → `pages/*`에 남아도 된다(예: `id`가 없으면 404로 리다이렉트하는 `useEffect`).
- **`useRouter()` 호출 자체, 페이지 진입/이탈 시점의 얕은 side effect**(스크롤 복원 트리거 등 이미 `navigationRecoils`가 다루는 것과 연동되는 수준)는 라우팅 책임으로 보고 `pages/*`에 남겨도 된다.
- **도메인 데이터 조회(react-query 훅), 비즈니스 계산/변환, 여러 하위 컴포넌트에 걸친 상태 관리**는 도메인 책임 → `features/<domain>/screens/`로 옮긴다. (`pages/study/[id]/[date]/index.tsx`가 훅 4개를 직접 호출하는 것, `pages/group/index.tsx`가 상태 라벨 매핑 로직을 갖고 있는 것 등은 여전히 이전 대상.)
- **다른 `pages/*` 파일에서 헬퍼를 import하는 page-to-page 결합**은 예외 없이 제거 대상(라우팅 책임도 도메인 책임도 아닌, 우연한 결합이므로).

이 기준은 파일마다 개별 판단이 필요하므로, 마이그레이션 시 "이 코드가 라우팅에 관한 것인가, 도메인에 관한 것인가"를 커밋 메시지에 한 줄로 남긴다.

---

## 6. 검증 방법 — Claude가 실제로 수행 가능한 것과 사용자 확인이 필요한 것 구분

Claude(에이전트)가 이 세션에서 직접 실행/확인할 수 있는 것과 없는 것을 명확히 나눈다. **브라우저에서 실제로 열어보지 않은 것을 "통과"로 기록하지 않는다.**

### Claude가 직접 실행하고 결과를 보고할 수 있는 것 (자동 검증)
- `npm run typecheck`(신규 스크립트), `npm run lint`(신규 스크립트), `npm run build` — 실행 결과(성공/실패, 에러 로그)를 그대로 보고.
- grep 기반 참조 0건 확인(레거시 폴더 삭제 전).
- 코드 diff 자체의 논리적 검토(이동 전후 파일 내용이 순수 이동인지, 의도치 않은 변경이 섞였는지).

### Claude가 브라우저 자동화 도구(claude-in-chrome 등)를 실제로 사용해 확인하는 경우에만 보고 가능한 것
- 특정 화면의 렌더링/클릭 동작 확인. 이 도구를 실제로 호출해 확인한 경우에만 "확인함"으로 기록하고, 호출하지 않았다면 아래 체크리스트로 대체한다.

### 사용자 수동 확인이 필요한 체크리스트 (Claude가 "통과"라고 대신 말하지 않음)
각 도메인 배치 완료 시, 아래 형식으로 **사용자가 직접 확인할 항목**을 제시한다(예시, gather 기준):
- [ ] `/gather` 목록 화면이 이전과 동일하게 보이는가
- [ ] 특정 gather 상세 화면 진입/뒤로가기가 정상 동작하는가
- [ ] gather 작성(글쓰기) 플로우가 끝까지 완료되는가
- [ ] gather 관련 모달(신청/취소 등) 열기·닫기가 정상 동작하는가
- [ ] Storybook/Chromatic에 새로 잡히는 시각적 diff가 없는가(있다면 의도된 것인지 확인)

Claude는 이 체크리스트를 배치별로 제공하고, 사용자가 확인 결과를 알려주면 그 결과를 근거로 다음 배치를 진행한다.

---

## 7. 목표 폴더 트리 (v1 대비 `shared/`→`patterns/` + 모달 타입 구조만 수정)

```
pages/                        # Pages Router. 라우팅 계약 + 라우팅 책임 코드는 유지 (섹션 5 기준)
  <domain>/...

features/                     # 도메인 단위 1급 폴더
  <domain>/                   #   예: study, studyPage(별도), gather, group(구 groupStudy 포함), community(구 secretSquare 포함), ...
    screens/                  #   구 pageTemplates/<domain>/
    components/                #   도메인 전용 프레젠테이션 컴포넌트. 다른 도메인이 이 도메인 개념을 그대로 쓰고 싶을 때 직접 import 허용(섹션 2/9 참고)
    modals/                    #   도메인 전용 모달/드로어 — components/modal의 A/B 베이스 위에서 구성
    hooks/                     #   queries.ts / mutations.ts
    lib/                       #   순수 비즈니스 로직/계산
    state.ts                   #   도메인 범위 recoil atom
    types.ts (또는 types/)
    constants.ts

components/                    # 공유 계층 — 섹션 3 기준으로만 편입
  ui/                          #   순수 프리미티브 (MenuButton, TabNav 등 재평가 결과 포함)
  layout/                      #   앱 셸
  modal/                       #   ADismissProps / BControlledProps 베이스 + 도메인 무관 범용 다이얼로그
  patterns/                    #   도메인 무관 복합 UI 패턴 (엄격한 체크리스트 통과분만)
  Icons/

hooks/                         # 교차 도메인 전용 훅만
libs/                          # backend/ (서버 전용)만
utils/                         # 진짜 범용 헬퍼만
types/                         # 교차 도메인 공용 타입만 (ADismissProps/BControlledProps 등)
constants/                     # 앱 전역 상수만
content/                       # 구 storage/
recoils/                       # 진짜 전역 atom만 (navigationRecoils.ts, transferRecoils.ts)
models/                        # 서버 전용, 유지
docs/                          # date-cafe/ 문서 이동
```

---

## 8. 의존 방향 규칙 (수정 — 도메인 간 "소유 개념 직접 참조"를 조건부 허용)

**허용**
- `pages/<domain>/*` → `features/<domain>/screens/*`(해당 도메인) + `components/layout/*` + (섹션 5 기준을 만족하는 라우팅 책임 코드는 페이지 파일 자체에 유지)
- `features/<domain>/screens/*` → 같은 도메인의 하위 폴더 전부 + 공유 `components/{ui,layout,modal,patterns,Icons}` + 전역 `hooks/`, `utils/`, `recoils/`(전역 atom)
- `features/<domain>/components|modals/*` → 같은 도메인의 `hooks/`, `lib/`, `types`, `state.ts` + 공유 `components/*`
- **`features/<domainA>/*` → `features/<domainB>/components/*` (조건부 허용, v1에서 변경)**: domainA가 domainB가 소유한 엔티티/개념을 "그대로" 보여줄 때만 허용(예: gather 화면이 관련 group을 보여주기 위해 `features/group/components/GroupThumbnailCard`를 직접 import). 소유권은 항상 domainB에 남고, domainA는 그 컴포넌트의 내부를 수정하지 않는다. 이런 참조가 실제로 필요한 경우가 늘어나면(예: 4~5개 도메인이 group 카드를 각자 다르게 변형해서 씀) 그때 재검토해 `components/patterns/`로 승격할지 판단한다 — 미리 승격하지 않는다.
- `components/{ui,layout,modal,patterns}/*` → `types/`(공용), `utils/`, `recoils/`(전역 atom), 서로 간

**금지**
- `components/{ui,layout,modal,patterns}/*` → `features/<domain>/*` 전체 금지(현재 atoms→pageTemplates류 위반 재발 방지)
- `pages/*` → `pages/*` 금지
- `features/<domain>/lib|hooks/*` → `features/<domain>/screens|components/*` 금지(역방향)
- `features/<domainA>/*` → `features/<domainB>/screens|hooks|lib|modals/*` 금지 (컴포넌트 재사용과 달리, 다른 도메인의 화면/데이터훅/로직/모달을 직접 끌어쓰는 것은 여전히 금지 — 이건 소유 개념을 "그대로 보여주는" 것이 아니라 로직 결합이므로)

---

## 9. 커밋 원칙 — 순수 이동과 구조 변경을 반드시 분리

한 커밋에는 아래 중 **정확히 한 종류**의 변경만 포함한다. 섞이면 diff와 롤백이 불가능해지므로 예외를 두지 않는다.

1. **순수 이동/rename** — 파일 내용은 한 글자도 바꾸지 않고 경로만 이동, import 경로만 기계적으로 갱신. (예: `pageTemplates/gather/GatherHeader.tsx` → `features/gather/screens/GatherHeader.tsx`)
2. **내부 리팩토링** — 같은 위치에서 로직을 함수/파일로 쪼개거나 추출(위치는 그대로, 내용 구조만 변경).
3. **Props/타입 변경** — 예: `IModal{setIsModal}` → `onClose` 어댑터 적용, `I` 접두사 제거.
4. **Export 방식 변경** — named export를 default로 통일하는 등.
5. **네이밍 변경** — 오타 수정(`quries.ts`→`queries.ts` 등), 도메인명 통일(groupStudy→group, secretSquare→community).

같은 파일이 여러 종류의 변경을 필요로 하면(예: 이동 + 오타 수정), **이동 커밋 → 별도의 리네임 커밋** 순서로 나눈다. 커밋 메시지에 다섯 종류 중 어떤 것인지 명시한다: `refactor(gather): move [pure-move]`, `refactor(gather): adapt modal props to onClose [props-change]` 등.

---

## 10. 브랜치 전략과 기존 변경 보존

- 이 리팩토링은 `main`이 아닌 **별도 브랜치**(예: `refactor/component-architecture`)에서 진행한다. 도메인별 진행 상황을 이 브랜치 위에 순차 커밋하고, 사용자가 검토 후 병합 여부를 결정한다.
- 브랜치를 만들기 전에, 현재 `main`에 존재하는 **미커밋 변경**(`hooks/groupStudy/queries.ts`의 react-query 캐시 키 버그 수정)을 **독립 커밋으로 먼저 `main`에 반영**한다 — 리팩토링 작업과 섞이지 않도록 별도 커밋으로 보존.
- `refactor-plan.md`(이 문서)는 계획 문서이므로 `main`에 바로 커밋해도 무방한지, 혹은 리팩토링 브랜치에 포함할지는 실행 시작 시 확인한다.

---

## 11. 실행 순서 — 이번 승인 범위는 Phase 0~2(gather 파일럿)까지

**Phase 3 이후(나머지 도메인 전체 자동 이전)는 이번에 미리 승인받지 않는다.** Phase 0~2를 완료하고 실제 결과(생성된 diff 크기, 발견된 예외 케이스, 검증 체크리스트 결과)를 사용자와 함께 평가한 뒤, 목표 구조가 적합한지 다시 확인하고 나서만 Phase 3부터 도메인별로 승인받아 연속 진행한다.

### Phase 0 — 기준선 확보 + 브랜치 생성 (가장 낮은 위험)
1. `hooks/groupStudy/queries.ts`의 미커밋 변경을 `main`에 독립 커밋 [순수 버그 수정 커밋, 구조 변경 아님].
2. `refactor/component-architecture` 브랜치 생성.
3. `package.json`에 `typecheck`/`lint` 스크립트 추가, `tsc --noEmit`/`eslint`/`next build` 베이스라인 기록 [구조 변경 아님, 신규 추가].
4. `features/`, `components/{ui,layout,modal,patterns}/` 빈 스캐폴딩 생성, `docs/architecture.md` 초안(섹션 2~9 내용 기반).
5. `storage/`→`content/`, `date-cafe/`→`docs/date-cafe/` 순수 이동(코드 의존성 없음).
- 검증: typecheck/lint/build 자동 실행 결과 보고.

### Phase 1 — 공유 계층 확립
1. 섹션 2/3 기준으로 재평가한 프리미티브(`Header`, `PageSlide`, `BottomNav`, `TabNav`, `MenuButton` 등)를 `components/{ui,layout}/`로 순수 이동.
2. `ModalLayout`, `RightDrawer`류를 `components/modal/`로 순수 이동하고, `components/modal/types.ts`에 `ADismissProps`/`BControlledProps` 정의(신규 타입 추가 — 기존 호출부는 아직 변경하지 않음, 이름 통일은 Phase 2 이후 별도 배치).
- 검증: typecheck/lint/build 자동 실행 + 이동된 각 컴포넌트가 쓰이는 화면 목록을 사용자 체크리스트로 제공.

### Phase 2 — 파일럿 도메인: `gather`
1. `pageTemplates/gather/*` → `features/gather/screens/*` [순수 이동 커밋].
2. `hooks/gather/*` → `features/gather/hooks/*` [순수 이동 커밋].
3. gather 전용 `components/`(atoms/molecules/organisms/overlay 등에 흩어진 것) → `features/gather/components|modals/*` — 재분류 판단이 필요한 파일은 근거를 커밋 메시지에 기록 [순수 이동 커밋, 판단 근거는 메시지에만 — 내용은 안 바꿈].
4. `pages/gather/*`를 섹션 5 기준으로 검토해 도메인 책임 코드만 `features/gather/screens/*`로 이전 [이 부분만 별도의 "책임 이전" 커밋, 순수 이동과 구분].
5. gather 전용 recoil atom(`checkAtoms.ts` 등 gather에 속하는 것) → `features/gather/state.ts` [순수 이동].
- 검증: typecheck/lint/build 자동 실행 결과 보고 + 섹션 6 형식의 gather 사용자 체크리스트 제공 + Storybook/Chromatic diff(스토리 있는 파일).

### ⏸ 체크포인트 — Phase 3 진입 전 재승인 필요
Phase 0~2 완료 후 다음을 사용자와 함께 검토한다.
- 실제 발생한 diff 규모/커밋 수가 예상과 맞는지
- gather 마이그레이션 중 발견된 예외 케이스(재분류 판단이 필요했던 파일 등)가 목표 구조 규칙으로 잘 설명되는지, 규칙을 더 다듬어야 하는지
- 섹션 6 체크리스트 기반 사용자 확인 결과가 모두 이상 없는지
이 검토를 통과해야만 Phase 3(나머지 도메인 순차 이관, 도메인별 승인 하에 연속 진행)로 넘어간다.

### Phase 3 이후 (참고용 로드맵, 이번 승인 대상 아님)
- 도메인별 순차 이관(작고 정돈된 도메인 → group → study/studyPage 순), `pages/*` 책임 정리, 레거시 폴더 삭제(참조 0건 확인 후), 모달 A유형 이름 통일(섹션 4, 선택적 후속 작업), 아키텍처 문서 완성 — v1 문서의 Phase 3~7 내용을 기본 로드맵으로 유지하되, 각 도메인 착수 전 개별 승인을 받는다.

---

## 12. 검증 요약 (섹션 6과 연결)

| 항목 | 수행 주체 | 방식 |
|---|---|---|
| typecheck/lint/build | Claude | 실제 실행, 성공/실패 로그 그대로 보고 |
| grep 참조 0건 확인 | Claude | 실제 실행, 결과 보고 |
| Storybook/Chromatic diff | Claude가 실행은 하되, 시각적 판단은 사용자 확인 필요 항목으로 별도 제시 | 실행 결과 링크/스크린샷 + 사용자 확인 요청 |
| 실제 화면 동작(클릭, 폼 제출 등) | 사용자 (또는 Claude가 브라우저 자동화 도구를 실제로 사용한 경우에 한해 Claude) | 섹션 6 체크리스트 형식으로 제공, 결과는 사용자 응답으로 기록 |

---

## 요약: 이번에 승인 요청하는 범위

`Phase 0(기준선+브랜치) → Phase 1(공유 계층) → Phase 2(gather 파일럿) → [체크포인트: 결과 평가 및 재승인]`

Phase 3 이후(나머지 15개+ 도메인 순차 이관, 모달 이름 통일, 레거시 삭제, 문서화)는 위 체크포인트를 통과한 뒤 도메인 단위로 별도 승인을 받아 진행한다. 아직 코드는 수정하지 않았다.
