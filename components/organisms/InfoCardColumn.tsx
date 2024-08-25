import styled from "styled-components";

import InfoCard, { IInfoCard } from "../atoms/InfoCard";

interface IInfoCardColumn {
  placeCardArr: IInfoCard[];
  isLink?: boolean;
}
export default function InfoCardColumn({ placeCardArr, isLink = true }: IInfoCardColumn) {
  return (
    <Layout>
      {placeCardArr.map((userCard, idx) => (
        <InfoCard
          key={idx}
          image={userCard.image}
          text={userCard.text}
          name={userCard.name}
          isLink={isLink}
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
