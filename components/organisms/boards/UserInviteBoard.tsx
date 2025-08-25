import { Box, Button, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";

import { GATHER_CONTENT } from "../../../constants/keys/queryKeys";
import { useAllUserDataQuery } from "../../../hooks/admin/quries";
import { useTypeToast } from "../../../hooks/custom/CustomToast";
import { useGatherInviteMutation } from "../../../hooks/gather/mutations";
import { useGroupIdQuery } from "../../../hooks/groupStudy/queries";
import { IUser, IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import { searchName } from "../../../utils/stringUtils";
import { Input } from "../../atoms/Input";
import { MainLoadingAbsolute } from "../../atoms/loaders/MainLoading";
import InviteUserGroups from "../../molecules/groups/InviteUserGroups";

interface UserInviteBoardProps {
  members: string[];
  gatherId: string;
  groupId: string;
}

function UserInviteBoard({ gatherId, members, groupId }: UserInviteBoardProps) {
  const typeToast = useTypeToast();

  const queryClient = useQueryClient();

  const [inviteUser, setInviteUser] = useState<IUserSummary>(null);
  const [users, setUsers] = useState<IUserSummary[]>(null);
  const [existUsers, setExistUsers] = useState<string[]>(members);
  const [nameValue, setNameValue] = useState("");
  const [filter, setFilter] = useState<"소모임 멤버" | "친구인 멤버">(
    groupId ? "소모임 멤버" : null,
  );

  const { data: usersAll, isLoading } = useAllUserDataQuery(null);
  const { data: group, isLoading: isLoading2 } = useGroupIdQuery(groupId, { enabled: !!groupId });
 
  const { mutate } = useGatherInviteMutation(+gatherId, {
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [GATHER_CONTENT], exact: false });

      typeToast("invite");
    },
  });

  useEffect(() => {
    if (nameValue) setUsers(searchName(usersAll as IUser[], nameValue));
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
      <Flex mt={5}>
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
      <Box mt="16px">
        <Input
          placeholder="이름 검색"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          size="md"
        />
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
