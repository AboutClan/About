import { Flex } from "@chakra-ui/react";
import Link from "next/link";
import styled from "styled-components";

import { useGatherCountQuery } from "@/features/gather/hooks/queries";
import { useGroupMyStatusQuery } from "@/features/group/hooks/queries";
import { useStudyMineQuery } from "@/features/study/hooks/queries";
import { useReviewableItems } from "@/features/user/hooks/useReviewableItems";
import { ArrowIcon } from "@/features/user/screens/UserProfile2";
import { useTypeToast } from "@/hooks/custom/CustomToast";
import { useUserInfo } from "@/hooks/custom/UserHooks";

// 소모임 목록 API 한 페이지 크기(groupStudy.service getMyGroupStudy gap)
const GROUP_PAGE_SIZE = 12;

function UserMenuRows({ isGuest }: { isGuest: boolean }) {
  const userInfo = useUserInfo();
  const typeToast = useTypeToast();
  const enabled = !isGuest && !!userInfo;

  const { items: reviewables } = useReviewableItems(enabled);
  const { data: groups } = useGroupMyStatusQuery(0, "isParticipating", { enabled });
  const { data: gatherCount } = useGatherCountQuery(userInfo?._id, { enabled });
  const { data: studies } = useStudyMineQuery({ enabled });

  const groupCount =
    groups === undefined
      ? undefined
      : groups.length >= GROUP_PAGE_SIZE
        ? `${GROUP_PAGE_SIZE}+`
        : groups.length;

  const rows: {
    text: string;
    count?: number | string;
    unit: string;
    href: string;
    isTodo?: boolean;
  }[] = [
    {
      text: "할 수 있는 멤버 평가",
      count: reviewables.length,
      unit: "개",
      href: "/user/review",
      isTodo: true,
    },
    { text: "가입중인 소모임", count: groupCount, unit: "개", href: "/user/group" },
    { text: "내가 참여했던 번개 모임", count: gatherCount, unit: "회", href: "/user/gather" },
    { text: "내 스터디 기록", count: studies?.length, unit: "회", href: "/user/study" },
  ];

  return (
    <Flex direction="column" borderTop="var(--border)">
      {rows.map((row) => (
        <Link
          key={row.href}
          href={row.href}
          onClick={(e) => {
            if (isGuest) {
              e.preventDefault();
              typeToast("guest");
            }
          }}
        >
          <UserRowItem>
            <span>
              {row.text}
              {/* 해야 할 일(멤버 평가)이 남았을 때만 민트로 강조, 나머지·0건은 회색. 값이 없으면 0 */}
              <b className={row.isTodo && !!row.count ? "todo" : undefined}>
                {" "}
                {row.count ?? 0}
                {row.unit}
              </b>
            </span>
            <ArrowIcon />
          </UserRowItem>
        </Link>
      ))}
    </Flex>
  );
}

// [활동] 행(UserProfile2 BlockItem)과 같은 크기. 버튼이라 눌림 배경만 더한다
export const UserRowItem = styled.div`
  width: 100%;
  display: flex;
  line-height: 20px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: var(--border);
  font-size: 13px;
  cursor: pointer;
  &:active {
    background-color: var(--gray-100);
  }
  > span:first-child {
    > b {
      color: var(--gray-500);
    }
    > b.todo {
      color: var(--color-mint);
    }
  }
`;

export default UserMenuRows;
