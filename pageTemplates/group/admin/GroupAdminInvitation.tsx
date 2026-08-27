import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import AlertModal, { IAlertModalOptions } from "../../../components/AlertModal";
import { Input } from "../../../components/atoms/Input";
import { MainLoadingAbsolute } from "../../../components/atoms/loaders/MainLoading";
import InviteUserGroups from "../../../components/molecules/groups/InviteUserGroups";
import { useAllUserDataQuery } from "../../../hooks/admin/quries";
import { useResetGroupQuery } from "../../../hooks/custom/CustomHooks";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useUserInfo } from "../../../hooks/custom/UserHooks";
import {
  useGroupInviteDummyMutation,
  useGroupInviteMutation,
} from "../../../hooks/groupStudy/mutations";
import { useUserInfoFieldMutation } from "../../../hooks/user/mutations";
import { IGroup } from "../../../types/models/groupTypes/group";
import { IUser, UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";
import { searchName } from "../../../utils/stringUtils";

const DUMMY_AGE_OPTIONS = Array.from({ length: 11 }, (_, i) => 19 + i); // 19세 ~ 29세 (2007년생 ~ 1997년생)

const ageToBirth = (age: number) => {
  const birthYear = new Date().getFullYear() - age;
  return `${String(birthYear).slice(2, 4)}0101`;
};

export default function GroupAdminInvitation({ group }: { group: IGroup }) {
  const toast = useToast();
  const userInfo = useUserInfo();
  const { id } = useParams<{ id: string }>() || {};
  const [filterUsers, setFilterUsers] = useState<
    UserSimpleInfoProps[] | IUser[] | UserSimpleInfoProps[]
  >();
  const [inviteUser, setInviteUser] = useState<UserSimpleInfoProps>(null);
  const [nameValue, setNameValue] = useState("");
  const [dummyName, setDummyName] = useState("");
  const [dummyGender, setDummyGender] = useState<"남성" | "여성">(null);
  const [dummyAge, setDummyAge] = useState<number>(null);

  const { data: usersAll, refetch, isLoading } = useAllUserDataQuery(null);

  const resetGroup = useResetGroupQuery();

  const { mutate: mutate2 } = useGroupInviteMutation(id, {
    onSuccess() {
      toast("success", "가입되었습니다.");
      resetGroup();
      refetch();
    },
  });

  const { mutate: mutateDummy, isLoading: isLoadingDummy } = useGroupInviteDummyMutation(id, {
    onSuccess() {
      toast("success", "더미 멤버가 추가되었습니다.");
      resetGroup();
      setDummyName("");
      setDummyGender(null);
      setDummyAge(null);
    },
  });

  const { mutate: changeBelong } = useUserInfoFieldMutation("belong");
  function getRegionPrefix(text: string): string | null {
    const match = text.match(/^\[[^\]]+\]/);
    return match ? match[0] : null;
  }
  const isStudy = group?.title.includes("크루");
  const title = getRegionPrefix(group?.title);

  useEffect(() => {
    setFilterUsers(null);

    if (isLoading || !usersAll) return;
    if (nameValue) {
      setFilterUsers(searchName(usersAll, nameValue));
    } else setFilterUsers(usersAll as IUser[]);
  }, [usersAll, nameValue]);

  const alertOptions: IAlertModalOptions = {
    title: "유저 초대",
    subTitle: `${inviteUser?.name}님을 초대합니다. 즉시 가입이 되기 때문에 해당 멤버와 사전 이야기가 된 경우에 이용해주세요!`,
    func: () => {
      mutate2({ status: "agree", userId: inviteUser._id });
      if (isStudy) {
        changeBelong({ uid: inviteUser.uid, belong: title });
      }
      setInviteUser(null);
      resetGroup();
    },
    text: "초대",
  };

  return (
    <>
      {userInfo?.role === "previliged" && (
        <Box mt="16px" p={3} borderRadius="md" bg="gray.50">
          <Text fontSize="sm" fontWeight="bold" mb={2}>
            더미 멤버 추가
          </Text>
          <Box mb={2}>
            <Input
              placeholder="이름 입력"
              isLine
              size="sm"
              value={dummyName}
              onChange={(e) => setDummyName(e.target.value)}
            />
          </Box>
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
            isDisabled={!dummyName.trim() || !dummyGender || !dummyAge}
            isLoading={isLoadingDummy}
            onClick={() =>
              mutateDummy({
                name: dummyName.trim(),
                gender: dummyGender,
                birth: ageToBirth(dummyAge),
              })
            }
          >
            더미 멤버로 추가
          </Button>
        </Box>
      )}
      <Box mt="16px">
        <Flex justify="space-between" align="flex-end">
          <Box>
            <Input
              placeholder="이름 검색"
              isLine
              size="sm"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
            />
          </Box>
        </Flex>
        <Box position="relative">
          {isLoading ? (
            <Box h="200px">
              <MainLoadingAbsolute />
            </Box>
          ) : (
            <InviteUserGroups users={filterUsers} inviteUser={setInviteUser} />
          )}
        </Box>
      </Box>
      {inviteUser && <AlertModal options={alertOptions} setIsModal={() => setInviteUser(null)} />}
    </>
  );
}
