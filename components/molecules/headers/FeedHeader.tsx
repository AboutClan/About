import styled from "styled-components";

import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import Avatar from "../../atoms/Avatar";

interface IFeedHeader {
  writer: IUserSummary;
  date: string;
}

function FeedHeader({ writer, date }: IFeedHeader) {
  const isABOUT = writer.name === "이승주";
  return (
    <Layout>
      <Profile>
        <Avatar image={writer?.profileImage} avatar={writer?.avatar} uid={writer?.uid} size="smd" />
        <div>
          <Writer isABOUT={isABOUT}>{isABOUT ? "어바웃" : writer.name}</Writer>
          <span>{date}</span>
        </div>
      </Profile>
      <i className="fa-solid fa-ellipsis" />
    </Layout>
  );
}

const Layout = styled.div`
  background-color: white;
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border: var(--border);
  align-items: center;
`;

const Writer = styled.span<{ isABOUT: boolean }>`
  font-weight: 600;
  font-size: 13px;
  ${(props) =>
    props.isABOUT &&
    `
background: linear-gradient(90deg, #04e19b, #03b1e8);
-webkit-background-clip: text;
color: transparent;
display: inline;`}
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
