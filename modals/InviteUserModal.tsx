import { Box } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";

import { MainLoadingAbsolute } from "../components/atoms/loaders/MainLoading";
import ButtonGroups from "../components/molecules/groups/ButtonGroups";
import InviteUserGroups from "../components/molecules/groups/InviteUserGroups";
import { GATHER_CONTENT } from "../constants/keys/queryKeys";
import { useAdminUsersLocationControlQuery } from "../hooks/admin/quries";
import { useTypeToast } from "../hooks/custom/CustomToast";
import { useGatherParticipationMutation } from "../hooks/gather/mutations";
import { IModal } from "../types/components/modalTypes";
import { IUserSummary } from "../types/models/userTypes/userInfoTypes";
import { ActiveLocation } from "../types/services/locationTypes";
import { IFooterOptions, ModalLayout } from "./Modals";

interface IInviteUserModal extends IModal {}

export default function InviteUserModal({ setIsModal }: IInviteUserModal) {
  const typeToast = useTypeToast();
  const { data: session } = useSession();
  const { id } = useParams<{ id: string }>() || {};

  const [location, setLocation] = useState<ActiveLocation>(session?.user.location || "수원");
  const [inviteUser, setInviteUser] = useState<IUserSummary>(null);
  const [users, setUsers] = useState<IUserSummary[]>(null);

  const {
    data: usersAll,

    isLoading,
  } = useAdminUsersLocationControlQuery(location, null, true, { enabled: true });

  const queryClient = useQueryClient();

  const { mutate } = useGatherParticipationMutation("post", +id, {
    onSuccess() {
      typeToast("invite");
      queryClient.invalidateQueries([GATHER_CONTENT]);
    },
  });

  useEffect(() => {
    setUsers(usersAll);
  }, [usersAll]);

  useEffect(() => {
    if (!inviteUser) return;
    mutate({ phase: "first", userId: inviteUser._id });
    setUsers((old) => old.filter((who) => who.uid !== inviteUser.uid));
    setInviteUser(null);
  }, [inviteUser]);

  const footerOptions: IFooterOptions = {
    main: {
      text: "닫기",
    },
  };

  const buttonDataArr = [
    {
      text: "수원",
      func: () => setLocation("수원"),
    },
    {
      text: "양천",
      func: () => setLocation("양천"),
    },
    {
      text: "강남",
      func: () => setLocation("강남"),
    },
    {
      text: "안양",
      func: () => setLocation("안양"),
    },
    {
      text: "동대문",
      func: () => setLocation("동대문"),
    },
    {
      text: "인천",
      func: () => setLocation("인천"),
    },
  ];

  return (
    <ModalLayout setIsModal={setIsModal} title="인원 초대" footerOptions={footerOptions}>
      <ButtonGroups buttonDataArr={buttonDataArr} currentValue={location} />

      <Box
        h="300px"
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {!isLoading ? (
          <InviteUserGroups users={users} inviteUser={(who) => setInviteUser(who)} />
        ) : (
          <MainLoadingAbsolute />
        )}
      </Box>
    </ModalLayout>
  );
}
