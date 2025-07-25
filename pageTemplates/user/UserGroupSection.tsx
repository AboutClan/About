import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import { CheckCircleIcon } from "../../components/Icons/CircleIcons";
import { GroupThumbnailCard } from "../../components/molecules/cards/GroupThumbnailCard";
import ButtonGroups from "../../components/molecules/groups/ButtonGroups";
import { useGroupMyStatusQuery } from "../../hooks/groupStudy/queries";
import { createGroupThumbnailProps } from "../../pages/group";
import { IGroup } from "../../types/models/groupTypes/group";
import GroupSkeletonMain from "../group/GroupSkeletonMain";

type GroupType = "참여중인 모임" | "내가 개설한 모임";

function UserGroupSection() {
  const [groupType, setGroupType] = useState<GroupType>("참여중인 모임");

  const [groups, setGroups] = useState<IGroup[]>([]);
  const [cursor, setCursor] = useState(0);
  const loader = useRef<HTMLDivElement | null>(null);
  const firstLoad = useRef(true);

  const { data: groupData, isLoading } = useGroupMyStatusQuery(
    cursor,
    groupType === "참여중인 모임" ? "isParticipating" : "isOwner",
  );

  useEffect(() => {
    setGroups([]);
    setCursor(0);
  }, [groupType]);

  useEffect(() => {
    if (groupData) {
      setGroups((old) => [...old, ...groupData]);
      firstLoad.current = false;
    }
  }, [groupData, groupType]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !firstLoad.current) {
          setCursor((prevCursor) => prevCursor + 1);
        }
      },
      { threshold: 1.0 },
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, []);

  return (
    <Box mx={5} pb={10}>
      {/* <Flex h="44px" bg="rgba(66,66,66,0.04)" mb={3}>
        <Button
          flex={1}
          variant="unstyled"
          fontSize="12px"
          fontWeight="semibold"
          lineHeight="16px"
          color="gray.700"
          onClick={() => router.push("/user/review/group/mine")}
          rightIcon={
            <Flex
              justify="center"
              align="center"
              fontSize="10px"
              fontWeight="bold"
              lineHeight="12px"
              px="6px"
              h="16px"
              borderRadius="50%"
              bg="var(--color-mint-light)"
              color="mint"
            >
              {data?.writtenReviewCnt}
            </Flex>
          }
        >
          작성한 후기
        </Button>
        <Box color="gray.300" fontWeight="light" fontSize="13px" w={1} h="20px" my="auto">
          |
        </Box>
        <Button
          flex={1}
          onClick={() => router.push("/user/review/group/received")}
          variant="unstyled"
          fontSize="12px"
          fontWeight="semibold"
          lineHeight="16px"
          color="gray.700"
          rightIcon={
            <Flex
              justify="center"
              align="center"
              fontSize="10px"
              fontWeight="bold"
              lineHeight="12px"
              px="6px"
              h="16px"
              borderRadius="50%"
              bg="var(--color-mint-light)"
              color="mint"
            >
              {data?.reviewReceived}
            </Flex>
          }
        >
          받은 후기
        </Button>
      </Flex> */}
      <Box py={2} mb={3}>
        <ButtonGroups
          buttonOptionsArr={(["참여중인 모임", "내가 개설한 모임"] as GroupType[]).map((prop) => ({
            icon: (
              <CheckCircleIcon color={groupType === prop ? "black" : "gray"} size="sm" isFill />
            ),
            text: prop,
            func: () => setGroupType(prop),
            color: "black",
          }))}
          currentValue={groupType}
          isEllipse
          size="md"
        />
      </Box>

      <Box minH="100dvh">
        {!groups.length && isLoading ? (
          [1, 2, 3, 4, 5].map((num) => <GroupSkeletonMain key={num} />)
        ) : groups.length ? (
          <Flex direction="column">
            {groups
              ?.slice()
              ?.reverse()
              ?.map((group, idx) => {
                const status =
                  group.status === "end"
                    ? "end"
                    : group.memberCnt.max === 0
                    ? "pending"
                    : group.memberCnt.max <= group.participants.length
                    ? "full"
                    : group.memberCnt.max - 2 <= group.participants.length
                    ? "imminent"
                    : group.status;

                return (
                  <Box key={group.id} pb={3} mb={3} borderBottom="var(--border)">
                    <GroupThumbnailCard
                      {...createGroupThumbnailProps(group, status, idx, null, true)}
                    />
                  </Box>
                );
              })}
          </Flex>
        ) : (
          <Flex
            justify="center"
            align="center"
            fontSize="14px"
            fontWeight="medium"
            bg="gray.100"
            px={3}
            py={4}
            minH="114px"
            borderRadius="8px"
            color="gray.600"
            border="var(--border)"
          >
            {groupType === "참여중인 모임"
              ? " 현재 참여중인 모임이 없습니다."
              : "개설한 모임이 없습니다."}
          </Flex>
        )}
      </Box>
      <div ref={loader} />
      {isLoading && groups?.length ? (
        <Box position="relative" mt="32px">
          <MainLoadingAbsolute size="sm" />
        </Box>
      ) : undefined}
    </Box>
  );
}

export default UserGroupSection;
