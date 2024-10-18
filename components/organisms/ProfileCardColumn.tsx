import styled from "styled-components";

import ProfileCommentCard, { IProfileCommentCard } from "../molecules/cards/ProfileCommentCard";
interface IProfileCardColumn {
  userCardArr: IProfileCommentCard[];
  changeComment?: (comment: string) => void;
}
export default function ProfileCardColumn({ userCardArr }: IProfileCardColumn) {
  return (
    <Layout>
      {userCardArr.map((userCard, idx) => (
        <ProfileCommentCard
          key={idx}
          user={userCard.user}
          comment={userCard?.comment}
          memo={userCard?.memo}
          changeComment={userCard?.changeComment}
          leftComponent={userCard?.leftComponent}
          rightComponent={userCard?.rightComponent}
        />
      ))}
    </Layout>
  );
}

const Layout = styled.div`
  background-color: white;

  border-radius: var(--rounded-lg);
`;
