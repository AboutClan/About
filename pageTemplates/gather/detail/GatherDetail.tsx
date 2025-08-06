import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { Fragment, useState } from "react";
import styled from "styled-components";

import { CopyBtn } from "../../../components/Icons/CopyIcon";
import { GatherCategory, IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";
dayjs.locale("ko");

interface IGatherDetailInfo {
  data: IGather;
  gatherType: GatherCategory;
}

function GatherDetailInfo({
  data: { location, date, age, user, password, genderCondition, isApprovalRequired },
  gatherType,
}: IGatherDetailInfo) {
  const { data: session } = useSession();
  const isOrganizer = (user as IUserSummary)?.uid === session?.user?.uid;
  const [isSubLocation, setIsSubLocation] = useState(false);

  return (
    <Box px={5} py={3} bg="gray.100" fontSize="13px">
      <Flex px={4} py={2} direction="column" bg="white" border="var(--border)" borderRadius="4px">
        {gatherType !== "event" && (
          <FirstItem isOpen={isSubLocation} onClick={() => setIsSubLocation(true)}>
            <ItemText>장소</ItemText>
            <>
              {location.main ? (
                <Fragment>
                  <span>{location.main}</span>
                  <i className="fa-solid fa-chevron-down fa-2xs" />
                </Fragment>
              ) : (
                "온라인 진행"
              )}
            </>
          </FirstItem>
        )}
        {isSubLocation && <LocationSub>{location.sub}</LocationSub>}
        {gatherType === "event" ? (
          <Item>
            <ItemText>종료 날짜</ItemText>
            <span>{date === "미정" ? date : dayjsToFormat(dayjs(date), "M.D(ddd) HH:mm")}</span>
          </Item>
        ) : (
          <Item>
            <ItemText>날짜</ItemText>
            <span>{date === "미정" ? date : dayjsToFormat(dayjs(date), "M.D(ddd) HH:mm")}</span>
          </Item>
        )}
        <Item>
          <ItemText>나이</ItemText>
          <span>
            {age[0]} ~ {age[1]}세
          </span>
          {genderCondition && <i className="fa-solid fa-venus-mars" style={{ color: "#9E7CFF" }} />}
        </Item>
        <Item>
          <ItemText>방식</ItemText>
          <span>{isApprovalRequired ? "승인제" : "선착순"}</span>
        </Item>
        {isOrganizer && password && (
          <Item>
            <ItemText>초대코드</ItemText>
            <Secret>
              <span>{password}</span>
              <CopyBtn text={password} />
            </Secret>
          </Item>
        )}
      </Flex>
    </Box>
  );
}

const ItemText = styled.span`
  font-weight: 600;
  margin-right: var(--gap-3);
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  margin: 4px 0;
  > span:nth-child(2) {
    margin: 0 var(--gap-1);
  }
`;

const FirstItem = styled(Item)<{ isOpen: boolean }>`
  margin-bottom: ${(props) => (props.isOpen ? "0" : "var(--gap-1)")};
`;

const LocationSub = styled.div`
  color: var(--gray-600);
  font-size: 12px;
  margin: 2px 0;
  margin-left: 44px;
`;

const Secret = styled.div`
  display: flex;
  align-items: center;

  > span:first-child {
    margin-left: var(--gap-1);
    margin-right: var(--gap-2);
  }
`;

export default GatherDetailInfo;
