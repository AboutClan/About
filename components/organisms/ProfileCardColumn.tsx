import styled from "styled-components";

import ProfileCommentCard, { IProfileCommentCard } from "../molecules/cards/ProfileCommentCard";
interface IProfileCardColumn {
  userCardArr: IProfileCommentCard[];
}
export default function ProfileCardColumn({ userCardArr }: IProfileCardColumn) {

  return (
    <Layout>
      {userCardArr.map((userCard, idx) => (
        <ProfileCommentCard
          key={idx}
          user={userCard.user}
          comment={userCard?.comment}
          setMemo={userCard?.setMemo}
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
