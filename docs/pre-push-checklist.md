# 푸시 전 최종 확인 체크리스트

대상: `main` 브랜치의 미푸시 커밋 71개 (872파일, 도메인 기반 구조 이관)

> 이 리팩토링은 **파일 위치 변경이 대부분**이고 로직은 거의 그대로다.
> 다만 저장소에 테스트가 없어 "빌드 통과 = 동작 보존"이 성립하지 않는다.
> 아래에서 **[자동]** 은 이미 검증됐고, **[수동]** 은 사람이 직접 봐야 하는 항목이다.

---

## 1. 자동 검증 (이미 통과, 푸시 직전 재확인 권장)

```bash
# dev 서버가 떠 있으면 build가 EPERM으로 깨진다. 먼저 종료할 것.
yarn typecheck && yarn lint && yarn build
```

- [ ] `yarn typecheck` — 0 errors
- [ ] `yarn lint` — 0 errors
- [ ] `yarn build` — 성공, 156/156 페이지 생성
- [ ] `git status` — 작업트리 clean
- [x] `yarn build-storybook` — 성공 (확인 완료) (**CI가 push마다 Chromatic으로 실행하므로 여기서 깨지면 CI가 빨개진다**)

## 2. 라우팅 무결성 [자동, 확인 완료]

- [x] `pages/` 아래 파일의 추가·삭제·이름변경 **0건** → 모든 URL이 이전과 동일
  ```bash
  git diff --name-status -M origin/main..HEAD -- pages/ | grep -E "^(A|D|R)"   # 결과 없어야 정상
  ```

---

## 3. 수동 확인 — 우선순위 높음

이번 작업에서 **마크업 경로나 컴포넌트 구성이 실제로 바뀐 곳**이다. 여기부터 볼 것.

### 3-1. `/member` — 멤버 슬라이더
`ImageSlider`가 타입 분기 대신 컴포넌트를 주입받도록 바뀐 유일한 화면.
- [ ] 멤버 목록이 이전과 동일하게 보이는가 (가로 스와이프, 페이지네이션 점)
- [ ] 하트 버튼 동작 — 누르면 상대방에게 알림이 가는가

### 3-2. 나이 범위 선택 (`/gather/writing/condition`, `/group/writing/condition`)
`GatherWritingConditionAgeRange` → `AgeRangePicker`로 이동·리네임.
- [ ] 프리셋 버튼 5개(상관 없음 / 20대 초반 / 초중반 / 중반 / 중후반) 선택 시 슬라이더가 맞게 움직이는가
- [ ] gather와 group **양쪽 다** 확인

### 3-3. `/gather` — 랜딩 (232줄 → 5줄로 재구성된 유일한 라우트)
- [ ] 탭 3개(번개 / 라운지 / 이런 번개 어때요?) 전환
- [ ] URL `?tab=` 동기화 — 탭 바꾸고 새로고침 시 그 탭이 유지되는가
- [ ] "모임 제안" → GatherPickModal 열기 / 제출 (페이지에서 분리한 모달)

### 3-4. `/study/result` — 하트 아이콘
`HeartIcon`이 `components/Icons/`에서 user 도메인으로 이동.
- [ ] 하트 버튼 노출·동작

---

## 4. 수동 확인 — 도메인별 스모크

파일 이동만 있었던 영역이다. 각 도메인에서 **화면이 뜨는지, 데이터가 로드되는지** 정도만 봐도 충분하다.
(경로가 틀렸다면 빌드가 이미 실패했을 것이므로, 여기서 볼 것은 런타임 오류 정도다.)

- [ ] `/home` — 홈 화면, 헤더 팝업, 각 섹션(스터디/모임/그룹) 로드
- [ ] `/studyPage` — 스터디 탭, 지도, 장소 목록
- [ ] `/study/[id]/[date]` — 스터디 상세, 출석, 멤버, 참여 신청
- [ ] `/cafe-map` — 지도, 피드, 아카이브, 마이페이지 탭
- [ ] `/group`, `/group/[id]` — 목록·상세, **하단 네비 노출 조건**(`!isAdmin` 수정 반영된 곳)
- [ ] `/user` — 마이페이지, 회원 요청 모달들(휴식/탈퇴/프로필 변경 등 11개 이동)
- [ ] `/register` 가입 플로우 — 15개 화면이 이동한 가장 광범위한 영역
- [ ] `/community` — 목록·상세·작성 (댓글 `ReplyProps` 타입 이동 영향)
- [ ] `/vote`, `/ranking`, `/point`, `/notice`, `/store/[id]`, `/studyCalendar`

### 상태 저장이 걸린 항목 (recoil atom이 이동한 곳)
atom `key` 문자열은 그대로 유지했으므로 동작이 같아야 하지만, 확인해두면 좋다.
- [ ] 모임 개설 중간에 나갔다가 다시 들어오면 작성 내용이 남아 있는가 (`sharedGatherWritingState`)
- [ ] 모임 상세 → 목록 이동 시 데이터 전달 (`transferGatherDataState`)

---

## 5. 푸시 후 확인

- [ ] GitHub Actions의 Chromatic 잡이 통과하는가
- [ ] Chromatic에 시각적 diff가 잡히면 **의도된 것인지** 확인
      (스토리는 atoms 9개뿐이고 이번에 그 파일들은 옮기지 않았으므로, diff가 없는 것이 정상)
- [ ] 배포가 자동으로 걸려 있다면(Vercel 등) 배포 성공 및 실제 사이트 동작 확인
      — GitHub Actions에는 배포 잡이 없으므로 외부 연동 여부는 별도 확인 필요

---

## 6. 문제 발생 시 되돌리기

푸시 전이라면 로컬에서 되돌리면 된다.

```bash
git reset --hard origin/main     # 71커밋 전부 취소 (작업 유실 주의)
```

푸시 후라면 **되돌리기보다 문제 지점만 수정**하는 편이 낫다. 커밋이 도메인·책임 단위로
잘게 나뉘어 있어 개별 revert가 가능하다.

```bash
git log --oneline origin/main..HEAD          # 커밋 목록
git revert <sha>                             # 특정 도메인 이관만 되돌리기
```

각 커밋 메시지에 무엇을·왜 옮겼는지와 검증 결과가 적혀 있으니 원인 추적에 활용할 것.

---

## 7. 참고

- 구조 규칙과 알려진 예외: [`docs/architecture.md`](architecture.md)
- 리팩토링 배경과 결과 요약: [`refactor-plan.md`](../refactor-plan.md)
- 오래된 워크트리 브랜치를 가져오는 법: [`docs/worktree-branch-migration.md`](worktree-branch-migration.md)
- **`yarn dev` 실행 중에는 `yarn build`가 `EPERM: .next\trace`로 실패한다.** 빌드 전 dev 종료.
