import styled from "styled-components";

import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import Avatar from "../../atoms/Avatar";
interface IFeedHeader {
  writer: IUserSummary;
  date: string;
}

function FeedHeader({ writer, date }: IFeedHeader) {
  return (
    <Layout>
      <Profile>
        <Avatar user={writer} size="sm1" />
        <div>
          <Writer>{writer.name}</Writer>
          <span>{date}</span>
        </div>
      </Profile>
    </Layout>
  );
}

const Layout = styled.div`
  background-color: white;
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  align-items: center;
`;

const Writer = styled.span`
  font-weight: 600;
  font-size: 13px;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  > div:last-child {
    margin-left: var(--gap-3);
    display: flex;
    flex-direction: column;

    > span:last-child {
      color: var(--gray-600);
      font-size: 10px;
    }
  }
`;

export default FeedHeader;
