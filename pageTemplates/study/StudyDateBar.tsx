import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import styled from "styled-components";

import { PlusIcon } from "../../components/Icons/MathIcons";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { DispatchBoolean } from "../../types/hooks/reactTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";

interface IStudyDateBar {
  date: string;
  setIsInviteModal: DispatchBoolean;
  memberCnt: number;
}
function StudyDateBar({ date, memberCnt, setIsInviteModal }: IStudyDateBar) {
  const typeToast = useTypeToast();

  return (
    <>
      <Box mt={10} mb={2}>
        <Flex justify="space-between" align="center">
          <Box fontWeight="bold" fontSize="18px">
            {dayjsToFormat(dayjs(date), "M월 D일 참여 멤버")}
          </Box>
          <Button variant="unstyled" onClick={() => typeToast("not-yet")}>
            <PlusIcon />
          </Button>
        </Flex>
        <Box mt={1} fontSize="12px" color="gray.500">
          현재 <b>{memberCnt}의 멤버</b>가 참여중이에요 !
        </Box>
      </Box>
    </>
  );
}

const StudyDateBarContainer = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
`;

const DateText = styled.span`
  font-size: 18px; /* text-lg */
  font-weight: 700; /* font-semibold */
`;

export default StudyDateBar;
