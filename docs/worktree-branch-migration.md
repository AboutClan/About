# `worktree-luminous-bubbling-pike` 브랜치를 새 구조로 가져오기

`.claude/worktrees/luminous-bubbling-pike`에서 작업하던 내용을 커밋 `84af669e6`으로 보존해 두었다.
이 브랜치는 **main보다 265커밋 뒤처져 있고**, 그 사이 main에서 도메인 기반 구조로의 이관이
있었기 때문에 그냥 merge하면 대부분 파일이 "삭제 vs 수정" 충돌로 나온다.

아래는 그 작업을 다시 적용할 때 참고할 경로 매핑이다.

## 옮겨진 파일 — 새 경로에 다시 적용해야 함

| 이전 경로 (브랜치 기준) | 현재 경로 (main) |
|---|---|
| `components/organisms/StarRatingForm.tsx` | `features/study/components/StarRatingForm.tsx` |
| `components/services/study/apply/ui/parts/StudyCrewCards.tsx` | `features/study/components/study/apply/ui/parts/StudyCrewCards.tsx` |
| `pageTemplates/home/HomeInitialSetting.tsx` | `features/home/screens/HomeInitialSetting.tsx` |
| `pageTemplates/register/access/RegisterPaymentButton.tsx` | `features/register/screens/access/RegisterPaymentButton.tsx` |
| `pageTemplates/studyPage/PlaceInfoDrawer.tsx` | `features/studyMap/components/PlaceInfoDrawer.tsx` |
| `pageTemplates/studyPage/StudyReviewDrawer.tsx` | `features/studyMap/components/StudyReviewDrawer.tsx` |
| `pageTemplates/user/UserReviewBar.tsx` | `features/user/screens/UserReviewBar.tsx` |

## 위치가 그대로인 파일 — 경로 수정 불필요

`components/molecules/PlaceImage.tsx` · `components/molecules/SocialingScoreBadge.tsx` ·
`components/molecules/cards/StudyThumbnailCard.tsx` · `constants/contentsText/accordionContents.ts` ·
`pages/_document.tsx` · `pages/study/[id]/[date]/index.tsx` · `public/fonts/*`

(파일 위치는 같아도 265커밋 사이에 내용이 바뀌었을 수 있으므로 diff는 확인할 것.)

## 별도 확인이 필요한 두 파일

- **`components/services/study/apply/ui/FirstPageSection.tsx`** — 이 브랜치에만 있는 파일이다.
  main에는 없고, 그 상위 디렉터리는 `features/study/components/study/apply/ui/`로 옮겨졌다.
  살릴 거라면 새 경로에 두어야 한다.
- **`constants/contents/groupInfo.ts`** — 이 브랜치에서 새로 만들었지만 main에도 같은 경로에
  파일이 있다. 두 버전을 비교해 어느 쪽을 남길지 정해야 한다.

## 권장 방법

265커밋 차이를 한 번에 rebase하기보다, **변경 내용이 작으므로(18파일, +43/−41) 새 브랜치를
main에서 따서 위 매핑대로 수동 재적용**하는 편이 안전하다.

```bash
git diff main~1 84af669e6 -- <파일>   # 브랜치의 변경 내용 확인
```

변경 성격은 리뷰 문구 수정, 게스트 게이팅을 `typeToast("not-yet")`으로 교체,
전체 AppleSDGothicNeo woff2 제거(서브셋만 유지), 모임 매핑 데이터 추가다.
