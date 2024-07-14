import { Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import Header from "../../../components/layouts/Header";
import GatherKakaoShareModal from "../../../modals/gather/GatherKakaoShareModal";
import { isGatherEditState } from "../../../recoils/checkAtoms";
import { sharedGatherWritingState } from "../../../recoils/sharedDataAtoms";
import { IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";

interface IGatherHeader {
  gatherData: IGather;
}

function GatherHeader({ gatherData }: IGatherHeader) {
  const router = useRouter();

  const title = gatherData?.title;
  const date = gatherData?.date;
  const locationMain = gatherData?.location.main;
  const organizer = gatherData?.user;
  const { data: session } = useSession();
  const setGatherWriting = useSetRecoilState(sharedGatherWritingState);
  const setIsGatherEdit = useSetRecoilState(isGatherEditState);

  const [isModal, setIsModal] = useState(false);

  const onClick = () => {
    setGatherWriting({ ...gatherData, date: dayjs(gatherData.date) });
    setIsGatherEdit(true);
    router.push("/gather/writing/category");
  };

  return (
    <>
      <Header title="" url="/gather">
        <Flex>
          {session?.user.uid === (organizer as IUserSummary)?.uid && (
            <IconWrapper onClick={onClick}>
              <i className="fa-light fa-pen-circle fa-xl" />
            </IconWrapper>
          )}
          <IconWrapper>
            <i className="fa-light fa-share-nodes fa-lg" onClick={() => setIsModal(true)} />
          </IconWrapper>
        </Flex>
      </Header>
      {isModal && (
        <GatherKakaoShareModal
          setIsModal={setIsModal}
          title={title}
          date={date}
          locationMain={locationMain}
        />
      )}
    </>
  );
}

const IconWrapper = styled.button`
  width: 26px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: var(--gap-3);
`;

export default GatherHeader;
