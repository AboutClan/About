# 스터디 매칭 기준점(anchors)

스터디 신청 시 **매칭 기준점을 최대 2개**까지 지정할 수 있다. 두 기준점 중 **어느 하나라도** 범위에 들면 그 장소에 참여 가능한 것으로 본다(union).

프론트(About)와 백엔드(nest-back) 양쪽 구현이 끝난 상태이며, 이 문서는 그 계약과 판단 근거를 남긴다.

---

## 요청 스키마

`POST vote2/:date/dateArr`

```jsonc
{
  "latitude": 37.54024,          // = anchors[0]. 레거시 호출 지점 때문에 계속 보낸다
  "longitude": 127.070525,
  "locationDetail": "서울특별시 광진구",
  "start": "2026-09-10T12:00:00.000Z",
  "end": "2026-09-10T15:00:00.000Z",
  "eps": 3,                      // 매칭 반경(km). 유저당 1개, 모든 anchor에 공통 적용
  "dates": ["2026-09-10"],
  "anchors": [                   // 1~2개
    { "latitude": 37.54024, "longitude": 127.070525, "locationDetail": "서울특별시 광진구" },
    { "latitude": 37.496193, "longitude": 127.030907, "locationDetail": "서울특별시 강남구" }
  ]
}
```

- `anchors`가 **없으면** 서버가 `[{latitude, longitude, locationDetail}]`로 정규화한다. 레거시 호출 지점(`StudyNavigation`의 expectedVote·장소변경·취소, `StudyInviteDrawer`의 초대)은 anchors를 보내지 않으므로 이 정규화에 의존한다.
- `anchors`의 **순서에는 의미가 없다.** `anchors[0]`은 flat 필드를 채우기 위한 미러링일 뿐 우선순위가 아니다.
- `eps`는 유저당 1개다. anchor마다 다른 반경을 주지 않는다.

## eps는 km 단위다

`ClusterUtils.haversineDistance`가 km를 반환하고, 매칭은 `distance <= coord.eps`로 판정한다. 프론트 슬라이더 1/2/3단계 → `eps` 2/3/4는 곧 **반경 2/3/4km**이고, 이는 지도에 그려지는 안쪽(파란) 원의 반경과 정확히 일치한다.

> ⚠️ 프론트 `StudyApplySection.tsx`의 `RANGE_FILTER_KM`(10/15/20km)은 "현재 범위 내 신청 인원"을 세는 데만 쓰이는 값인데, 실제 매칭 반경(2/3/4km)보다 훨씬 넓다. **지도와 숫자가 안 맞는 원인이 이것이고, 틀린 쪽은 지도가 아니라 이 상수다.** 수치를 바꾸면 표시 인원이 크게 줄어 기획 판단이 필요하므로 이번엔 손대지 않았다.

---

## 매칭 알고리즘 (nest-back)

`Vote2Service.doAlgorithm`은 **장소 중심(place-centric)** 이다. DBSCAN이 아니다.
(`ClusterUtils.DBSCANClustering`과 `refineClusters`는 현재 어디서도 호출되지 않는 잔재다.)

대략의 흐름:

1. 참여자별로 **갈 수 있는 장소 수**(`reachableCount`)를 센다.
2. 장소를 정렬한다 — `status: 'main'` 우선 → 후보 많은 곳 → 평점.
3. **형성 패스**: 각 장소마다 후보를 "선택지 적은 사람 우선"으로 정렬해 최소 인원(3~4명)만 채워 그룹을 만든다.
4. **채우기 패스**: 만들어진 그룹을 6명까지 보충한다.
5. **확장 패스**: 남은 사람을 `eps × 1.5`로 기존 그룹에 붙이거나 새 그룹을 만든다.

### anchors 도입 방식

모든 거리 판정이 `haversineDistance(장소, 참여자) <= eps` 한 가지 모양이었다. 그래서 참여자 항목에 `anchors`를 달고, 그 자리를 전부 아래 헬퍼로 바꿨다.

```ts
// ClusterUtils
static minDistanceToAnchors(anchors, placeLat, placeLon): number
// = 기준점 중 가장 가까운 것까지의 거리
```

교체 지점 5곳: `reachableCount`, `getCandidatesForPlace`, `getSortedCandidates`, 확장 패스의 `placeRank`, `formNewGroupsWithExpandedEpsAtPlace`.

**참여자 1명당 `coords` 항목은 계속 1개다.** 기준점이 2개여도 항목을 늘리지 않는다. 이게 핵심으로, 덕분에

- 후보 인원 집계가 **사람 단위**로 유지된다 (한 사람이 두 번 세지지 않는다),
- `clusteredParticipantIds` 기반 중복 배정 방지가 그대로 동작한다,
- 최소 인원 3명 판정이 실제 3명을 의미한다.

### 겹치는 기준점은 접는다

`Vote2Service.normalizeAnchors`가 저장 시점과 매칭 시점 양쪽에서 **500m 이내로 붙어 있는 기준점을 하나로 병합**한다. 강남역+역삼역처럼 사실상 같은 범위를 두 번 등록해도 왜곡이 없다. 프론트도 추가 시 안내 토스트를 띄우지만 막지는 않으므로, 서버가 최종 방어선이다.

### 번들 키

"같은 좌표 참여자는 같은 그룹에 배정" 규칙의 키를 단일 좌표에서 **기준점 집합**으로 바꿨다. 순서에 의미가 없으므로 정렬 후 결합한다.

### 배정 최적화는 추가하지 않았다

여러 장소에 갈 수 있는 유연한 참여자가 앞 장소에 흡수되어 뒤 장소가 못 열리는 문제를 우려해 보정 패스를 만들었다가 **되돌렸다.** 검증해 보니 기존 휴리스틱이 이미 그 상황을 처리한다.

- `formMinimalGroup(targetSize)`는 `groupMembers.length >= targetSize`에서 즉시 끊어 **필요한 만큼만** 데려간다.
- 후보 정렬이 `reachableCount` 오름차순이라 **선택지가 적은 사람이 먼저** 배정되고, 유연한 참여자는 자연히 뒤 장소로 남는다.

검증한 세 케이스(유연 참여자 2명이 두 장소에 걸친 경우 / 전원 단일 기준점 / 빼가면 원 그룹이 무너지는 경우) 모두에서 보정 패스는 결과를 바꾸지 못했다. 그룹을 헤집고 해체하는 코드를 이득 없이 둘 이유가 없어 제거했다. 실운영에서 미매칭이 늘어나는 게 관측되면 그때 다시 검토한다.

### `results[].center`

장소 자체의 좌표를 쓴다(`place.location`). 참여자 좌표의 평균이 아니므로 anchors 도입과 무관하다.

---

## 응답

`GET vote2/week`의 `getBeforeVoteInfo`가 participation 문서를 통째로 spread하므로, 스키마에 `anchors`를 추가한 것만으로 응답에 자동으로 실린다.

```jsonc
"participations": [{
  "date": "2026-09-10",
  "study": [{
    "user": { "_id": "...", "name": "..." },
    "latitude": 37.54, "longitude": 127.07,   // 기존 유지
    "locationDetail": "...",
    "eps": 3,
    "anchors": [
      { "latitude": 37.54, "longitude": 127.07, "locationDetail": "..." },
      { "latitude": 37.49, "longitude": 127.03, "locationDetail": "..." }
    ]
  }]
}]
```

**프론트 후속 작업**: `StudyApplySection.tsx`의 `nearbyCount`가 아직 `study.location` 한 점만 본다. `study.anchors`를 순회하도록 바꾸면 상대방의 두 번째 기준점까지 반영된다. 그전까지는 과소집계된다.

---

## 변경된 파일

**nest-back**

| 파일 | 내용 |
|---|---|
| `src/MSA/Study/entity/vote2.entity.ts` | `IAnchor`, `AnchorSchema`, `IParticipation.anchors` |
| `src/MSA/Study/core/domain/Vote2/Vote2Participation.ts` | 도메인 객체에 `anchors` |
| `src/MSA/Study/dtos/vote2.dto.ts` | `AnchorDTO`, 두 DTO에 `anchors?` |
| `src/MSA/Study/core/services/vote2.service.ts` | `normalizeAnchors`, `doAlgorithm` 거리 판정 5곳, 번들 키 |
| `src/utils/ClusterUtils.ts` | `minDistanceToAnchors` |

**About (프론트)**

| 파일 | 내용 |
|---|---|
| `types/models/studyTypes/studyInterActions.ts` | `StudyVoteAnchorProps`, `StudyVoteProps.anchors` |
| `features/study/hooks/mutations.ts` | 전송 타입 |
| `features/study/components/study/apply/StudyApplyDrawer.tsx` | 기준점 배열 상태, 겹침 경고, payload 조립 |
| `features/study/components/study/apply/ui/StudyApplySection.tsx` | 기준 위치 리스트, `nearbyCount` |
| `features/study/components/study/apply/ui/parts/StudyCrewPlacePicker.tsx` | 크루 장소 선택 |
| `features/study/lib/getClosestStudyCrew.ts` | 최근접 크루 |
| `features/study/screens/StudyExpectedMap.tsx`, `components/organisms/VoteMap.tsx` | 원 2쌍 + `fitBounds` |
| `pages/register/location.tsx`, `.../overlay/PlaceDrawer.tsx` | `topSlot` 주입 |

## 배포 순서

`anchors`는 optional이고 서버가 없으면 정규화하므로 **어느 쪽을 먼저 배포해도 안전하다.**

- 백엔드 먼저 → 기존 프론트는 anchors를 안 보내고, 서버가 한 점으로 정규화 → 현행과 동일.
- 프론트 먼저 → 서버가 `anchors`를 무시하고 flat 필드만 읽음 → 현행과 동일.

기존 DB 문서에는 `anchors` 필드가 없지만, `doAlgorithm`이 매번 `normalizeAnchors`로 정규화하므로 **마이그레이션이 필요 없다.**
