import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";

import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProfileCommentCard from "../../../components/molecules/cards/ProfileCommentCard";
import { GROUP_STUDY } from "../../../constants/keys/queryKeys";
import { useGroupMonthAttendMutation } from "../../../hooks/groupStudy/mutations";
import { useGroupIdQuery } from "../../../hooks/groupStudy/queries";
import { GroupParicipantProps } from "../../../types/models/groupTypes/group";

export default function Month() {
  const { data: session } = useSession();
  const { id } = useParams<{ id: string }>() || {};

  const { data: groupData, refetch: refetchGroupData } = useGroupIdQuery(id, { enabled: false });

  useEffect(() => {
    if (id) {
      refetchGroupData();
    }
  }, [id]);

  const [users, setUsers] = useState<GroupParicipantProps[]>([]);

  useEffect(() => {
    if (groupData) {
      setUsers(groupData.participants);
    }
  }, [groupData]);

  const queryClient = useQueryClient();

  const { mutate: attend } = useGroupMonthAttendMutation(id, {
    onSuccess() {
      queryClient.invalidateQueries([GROUP_STUDY, groupData.id + ""]);
    },
  });

  const handleAttend = (userId: string) => {
    attend({ userId });
    setUsers((old) => {
      return old.map((props) =>
        props.user._id === userId ? { ...props, monthAttendance: !props.monthAttendance } : props,
      );
    });
  };

  return (
    <>
      <Header title="멤버 관리" />
      <Slide>
        <Box>
          <Box p="12px 0" fontSize="16px" fontWeight={800}>
            참여중인 멤버
          </Box>
          <Flex direction="column">
            {users
              ?.slice()
              ?.sort((a, b) => (!a.user || !b.user ? 1 : a.user.name > b.user.name ? 1 : -1))
              .map((who, idx) => {
                const isMonthAttendance = who.monthAttendance;
                return (
                  <Box key={idx}>
                    <ProfileCommentCard
                      user={who.user}
                      comment={{
                        comment: `${dayjs().month()}월 출석: ${
                          who?.lastMonthAttendance ? "o" : "x"
                        } /${dayjs().month() + 1}월 출석: ${who?.monthAttendance ? "o" : "x"} `,
                      }}
                      rightComponent={
                        <Flex align="center">
                          <Flex align="center" mr={2}>
                            {isMonthAttendance ? <CheckCircleIcon /> : <XCircleIcon />}
                          </Flex>

                          <Button
                            isDisabled={who.user?.uid === session?.user.uid}
                            colorScheme={isMonthAttendance ? "red" : "mint"}
                            variant={isMonthAttendance ? "outline" : "solid"}
                            size="sm"
                            ml={3}
                            onClick={() => handleAttend(who.user._id)}
                          >
                            {isMonthAttendance ? "출석 취소" : "출석 체크"}
                          </Button>
                        </Flex>
                      }
                      isNoBorder
                    />
                    <Flex></Flex>
                  </Box>
                );
              })}
          </Flex>
        </Box>
      </Slide>
    </>
  );
}

function XCircleIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    height="16px"
    viewBox="0 -960 960 960"
    width="16px"
    fill="var(--color-red)"
  >
    <path d="m480-424 116 116q11 11 28 11t28-11q11-11 11-28t-11-28L536-480l116-116q11-11 11-28t-11-28q-11-11-28-11t-28 11L480-536 364-652q-11-11-28-11t-28 11q-11 11-11 28t11 28l116 116-116 116q-11 11-11 28t11 28q11 11 28 11t28-11l116-116Zm0 344q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
  </svg>
}
function CheckCircleIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    height="16px"
    viewBox="0 -960 960 960"
    width="16px"
    fill="var(--color-mint)"
  >
    <path d="m424-408-86-86q-11-11-28-11t-28 11q-11 11-11 28t11 28l114 114q12 12 28 12t28-12l226-226q11-11 11-28t-11-28q-11-11-28-11t-28 11L424-408Zm56 328q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
  </svg>
}
