import styled from "styled-components";

import ProfileCommentCard, { IProfileCommentCard } from "../molecules/cards/ProfileCommentCard";
interface IProfileCardColumn {
  userCardArr: IProfileCommentCard[];
  changeComment?: (comment: string) => void;
  hasCommentButton: boolean;
}
export default function ProfileCardColumn({ userCardArr, hasCommentButton }: IProfileCardColumn) {
  console.log(54, userCardArr);
  return (
    <Layout>
      {userCardArr.map((userCard, idx) => (
        <ProfileCommentCard
          key={idx}
          hasCommentButton={hasCommentButton}
          user={userCard.user}
          comment={userCard?.comment}
          memo={userCard?.memo}
          changeComment={userCard?.changeComment}
          leftComponent={userCard?.leftComponent}
          rightComponent={userCard?.rightComponent}
          crownType={userCard?.crownType}
        />
      ))}
    </Layout>
  );
}

const Layout = styled.div`
  background-color: white;

  border-radius: var(--rounded-lg);
`;
