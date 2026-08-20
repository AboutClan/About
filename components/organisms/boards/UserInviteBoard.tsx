import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";

import { GATHER_CONTENT } from "../../../constants/keys/queryKeys";
import { useAllUserDataQuery } from "../../../hooks/admin/quries";
import { useTypeToast } from "../../../hooks/custom/CustomToast";
import { useGatherInviteDummyMutation, useGatherInviteMutation } from "../../../hooks/gather/mutations";
import { useGroupIdQuery } from "../../../hooks/groupStudy/queries";
import { IUser, UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";
import { searchName } from "../../../utils/stringUtils";
import { Input } from "../../atoms/Input";
import { MainLoadingAbsolute } from "../../atoms/loaders/MainLoading";
import InviteUserGroups from "../../molecules/groups/InviteUserGroups";

interface UserInviteBoardProps {
  members: string[];
  gatherId?: string;
  groupId: string;
}

const DUMMY_AGE_OPTIONS = Array.from({ length: 11 }, (_, i) => 19 + i); // 19세 ~ 29세 (2007년생 ~ 1997년생)

const ageToBirth = (age: number) => {
  const birthYear = new Date().getFullYear() - age;
  return `${String(birthYear).slice(2, 4)}0101`;
};

function UserInviteBoard({ gatherId, members, groupId }: UserInviteBoardProps) {
  const typeToast = useTypeToast();
  const queryClient = useQueryClient();

  const [inviteUser, setInviteUser] = useState<UserSimpleInfoProps>(null);
  const [users, setUsers] = useState<UserSimpleInfoProps[] | UserSimpleInfoProps[]>(null);
  const [existUsers, setExistUsers] = useState<string[]>(members);
  const [nameValue, setNameValue] = useState("");
  const [filter, setFilter] = useState<"소모임 멤버" | "친구인 멤버">(
    groupId ? "소모임 멤버" : null,
  );
  const [dummyGender, setDummyGender] = useState<"남성" | "여성">(null);
  const [dummyAge, setDummyAge] = useState<number>(null);

  const { data: usersAll, isLoading } = useAllUserDataQuery(null);
  const { data: group, isLoading: isLoading2 } = useGroupIdQuery(groupId, { enabled: !!groupId });

  const { mutate } = useGatherInviteMutation(+gatherId, {
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [GATHER_CONTENT], exact: false });

      typeToast("invite");
    },
  });

  const { mutate: mutateDummy, isLoading: isLoadingDummy } = useGatherInviteDummyMutation(
    +gatherId,
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: [GATHER_CONTENT], exact: false });
        typeToast("invite");
        setDummyGender(null);
        setDummyAge(null);
      },
    },
  );

  useEffect(() => {
    if (nameValue) setUsers(searchName(usersAll, nameValue));
    else setUsers(usersAll as IUser[]);
  }, [nameValue, usersAll]);

  useEffect(() => {
    if (!inviteUser) return;
    mutate({ phase: "first", userId: inviteUser._id });
    setUsers((old) => old.filter((who) => who.uid !== inviteUser.uid));
    setExistUsers((old) => [...old, inviteUser._id]);
    setInviteUser(null);
  }, [inviteUser]);

  return (
    <>
      <Flex mx={5}>
        <Button
          size="sm"
          mr={3}
          onClick={() => setFilter((old) => (old === "소모임 멤버" ? null : "소모임 멤버"))}
          colorScheme={filter === "소모임 멤버" ? "mint" : "gray"}
        >
          소모임 멤버
        </Button>
        <Button size="sm" mr={3} onClick={() => typeToast("not-yet")}>
          친구인 멤버
        </Button>
      </Flex>
      <Box mt="16px" mx={5}>
        <Input
          placeholder="이름 검색"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          size="md"
        />
      </Box>
      <Box mt="16px" mx={5} p={3} borderRadius="md" bg="gray.50">
        <Text fontSize="sm" fontWeight="bold" mb={2}>
          더미 멤버 추가
        </Text>
        <Flex mb={2}>
          {(["남성", "여성"] as const).map((gender) => (
            <Button
              key={gender}
              size="sm"
              mr={2}
              onClick={() => setDummyGender(gender)}
              colorScheme={dummyGender === gender ? "mint" : "gray"}
            >
              {gender}
            </Button>
          ))}
        </Flex>
        <Flex mb={3} flexWrap="wrap">
          {DUMMY_AGE_OPTIONS.map((age) => (
            <Button
              key={age}
              size="sm"
              mr={2}
              mb={2}
              onClick={() => setDummyAge(age)}
              colorScheme={dummyAge === age ? "mint" : "gray"}
            >
              {age}세
            </Button>
          ))}
        </Flex>
        <Button
          size="sm"
          colorScheme="mint"
          isDisabled={!dummyGender || !dummyAge}
          isLoading={isLoadingDummy}
          onClick={() =>
            mutateDummy({ phase: "first", gender: dummyGender, birth: ageToBirth(dummyAge) })
          }
        >
          더미 멤버로 추가
        </Button>
      </Box>
      <Box
        mb={5}
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {!isLoading && !isLoading2 && users ? (
          <InviteUserGroups
            users={users
              .filter((user) =>
                filter !== "소모임 멤버"
                  ? user
                  : [...group.participants.map((par) => par.user._id)].includes(user._id),
              )
              .sort((a, b) => {
                if (filter === "소모임 멤버") {
                  const aInGroup = members.includes(a._id);
                  const bInGroup = members.includes(b._id);
                  if (aInGroup && !bInGroup) return -1;
                  if (!aInGroup && bInGroup) return 1;
                  // 둘 다 포함되거나 둘 다 미포함인 경우 이름으로 정렬
                }
                if (a.monthScore !== b.monthScore) {
                  return b.monthScore - a.monthScore;
                }

                // 이름 기준 내림차순
                return a.name > b.name ? 1 : -1;
              })}
            inviteUser={(who) => setInviteUser(who)}
            existUsers={existUsers}
          />
        ) : (
          <MainLoadingAbsolute />
        )}
      </Box>
    </>
  );
}

export default UserInviteBoard;
