import { faVenusMars } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import styled from "styled-components";

import { IGroup } from "../../../types/models/groupTypes/group";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";
dayjs.locale("ko");

interface IGroupDetailInfo {
  group: IGroup;
}

function GroupDetailInfo({ group }: IGroupDetailInfo) {
  return (
    <Layout>
      <Item>
        <ItemText>지역</ItemText>
        <span>{group.location}</span>
      </Item>
      <Item>
        <ItemText>목적</ItemText>
        <span>
          {group.category.main} - {group.category.sub}
        </span>
        {group.gender && <FontAwesomeIcon icon={faVenusMars} color="#9E7CFF" />}
      </Item>
      <Item>
        <ItemText>활동</ItemText>
        <span>{group.period}</span>
      </Item>
      <Item>
        <ItemText>개설</ItemText>
        <span>{dayjsToFormat(dayjs(group.createdAt), "YYYY년 M월 D일")}</span>
      </Item>
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--gap-2) var(--gap-3);

  background-color: white;
  border-radius: var(--rounded);
  box-shadow: var(--shadow);
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

export default GroupDetailInfo;
