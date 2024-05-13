import { Box, Button, Collapse, useDisclosure } from "@chakra-ui/react";
import { faX } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

import { DispatchBoolean } from "../../../types/hooks/reactTypes";
import { IStoreApplicant } from "../../../types/models/store";

interface IStoreDetailNav {
  applyUsers: IStoreApplicant[];
  isCompleted: boolean;
  setIsWinModal: DispatchBoolean;
  setIsApplyModal: DispatchBoolean;
}

function StoreDetailNav({
  applyUsers,
  isCompleted,
  setIsWinModal,
  setIsApplyModal,
}: IStoreDetailNav) {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Layout>
      <ButtonNav>
        <Button bg="var(--gray-200)" size="lg" width="50%" onClick={onToggle}>
          참여현황
        </Button>
        {isCompleted ? (
          <Button size="lg" width="50%" onClick={() => setIsWinModal(true)}>
            당첨자 확인
          </Button>
        ) : (
          <Button size="lg" width="50%" onClick={() => setIsApplyModal(true)}>
            응모하기
          </Button>
        )}
      </ButtonNav>
      <Collapse in={isOpen} animateOpacity>
        <Box fontSize="12px" p="var(--gap-2)" bg="var(--gray-200)" color="var(--gray-2)">
          {applyUsers?.length === 0 ? (
            "참여 인원 없음"
          ) : (
            <Applicant>
              {applyUsers.map((who, idx) => (
                <ApplicantBlock key={idx}>
                  <span>{who.name}</span>
                  <div>
                    <FontAwesomeIcon icon={faX} size="2xs" />
                  </div>
                  <span>{who.cnt} 회</span>
                </ApplicantBlock>
              ))}
            </Applicant>
          )}
        </Box>
      </Collapse>
    </Layout>
  );
}

const Layout = styled.div`
  margin-top: var(--gap-5);
  display: flex;
  flex-direction: column;
`;

const ButtonNav = styled.div`
  margin: var(--gap-3) 0;
  display: flex;
  > button:first-child {
    color: var(--color-mint);
    margin-right: var(--gap-2);
  }
  > button:last-child {
    background-color: var(--color-mint);
    color: white;
  }
`;

const Applicant = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;

const ApplicantBlock = styled.div`
  display: flex;
  align-items: center;
  > div {
    margin: 0 var(--gap-1);
  }
`;

export default StoreDetailNav;
