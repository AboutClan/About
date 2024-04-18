import { faChevronDown, faVenusMars } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";

import { CopyBtn } from "../../../components/atoms/Icons/CopyIcon";
import { IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";
dayjs.locale("ko");

interface IGatherDetailInfo {
  data: IGather;
}

function GatherDetailInfo({
  data: { location, date, age, memberCnt, user, password, genderCondition },
}: IGatherDetailInfo) {
  const { data: session } = useSession();
  const isOrganizer = user?.uid === session?.user?.uid;
  const [isSubLocation, setIsSubLocation] = useState(false);

  return (
    <Layout>
      <FirstItem isOpen={isSubLocation} onClick={() => setIsSubLocation(true)}>
        <ItemText>장소</ItemText>
        <span>{location.main}</span>
        <FontAwesomeIcon icon={faChevronDown} size="2xs" />
      </FirstItem>
      {isSubLocation && <LocationSub>{location.sub}</LocationSub>}
      <Item>
        <ItemText>날짜</ItemText>
        <span>{date === "미정" ? date : dayjsToFormat(dayjs(date), "M.D(ddd) hh:mm")}</span>
      </Item>
      <Item>
        <ItemText>나이</ItemText>
        <span>
          {age[0]} ~ {age[1]}세
        </span>
        {genderCondition && <FontAwesomeIcon icon={faVenusMars} color="#9E7CFF" />}
      </Item>
      <Item>
        <ItemText>오픈</ItemText>
        <span>{memberCnt.min}명 이상 오픈</span>
      </Item>
      {isOrganizer && password && (
        <Item>
          <ItemText>암호</ItemText>
          <Secret>
            <span>{password}</span>
            <CopyBtn text={password} />
          </Secret>
        </Item>
      )}
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  margin: var(--gap-3) var(--gap-4);
  padding: var(--gap-2) var(--gap-3);
  background-color: white;
  border-radius: var(--rounded);
  box-shadow: var(--shadow);
  border: var(--border);
`;

const ItemText = styled.span`
  font-weight: 600;
  margin-right: var(--gap-3);
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--gap-1);
  > span:nth-child(2) {
    margin: 0 var(--gap-1);
  }
`;

const FirstItem = styled(Item)<{ isOpen: boolean }>`
  margin-bottom: ${(props) => (props.isOpen ? "0" : "var(--gap-1)")};
`;

const LocationSub = styled.div`
  color: var(--gray-3);
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
