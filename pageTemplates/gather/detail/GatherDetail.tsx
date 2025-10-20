import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";

import Divider from "../../../components/atoms/Divider";
import BlurredLink from "../../../components/molecules/BlurredLink";
import InfoBoxCol from "../../../components/molecules/InfoBoxCol";
import { IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";
dayjs.locale("ko");

interface IGatherDetailInfo {
  data: IGather;
  isMember: boolean;
}

function GatherDetailInfo({ data, isMember }: IGatherDetailInfo) {
  const { data: session } = useSession();
  const isOrganizer = (data?.user as IUserSummary)?.uid === session?.user?.uid;

  return (
    <>
      <Box px={5} pb={2}>
        <InfoBoxCol
          infoBoxPropsArr={[
            {
              category: "장 소",
              rightChildren: (
                <Flex align="center">
                  <Box ml={1} color="gray.600">
                    {data?.location.main || "온라인"}{" "}
                  </Box>
                </Flex>
              ),
            },
            {
              category: "날 짜",
              text: dayjsToFormat(dayjs(data?.date), "M.D(ddd) HH:mm"),
            },
            {
              category: "단톡방",
              rightChildren: !data?.kakaoUrl ? (
                <Box color="gray.600">미 개설</Box>
              ) : (
                <BlurredLink isBlur={!isMember} url={data?.kakaoUrl} />
              ),
            },
            ...(isOrganizer
              ? [
                  {
                    category: "초대코드",
                    text: data?.password,
                  },
                ]
              : []),
          ]}
          size="md"
          highlightSide="left"
        />
      </Box>
      <Divider />
    </>
  );
}

export default GatherDetailInfo;
