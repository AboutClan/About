import Image from "next/image";
import styled from "styled-components";

import Skeleton from "../../../components/atoms/skeleton/Skeleton";

interface IStudyCoverSkeleton {
  coverImageUrl: string;
}

function StudyCoverSkeleton({ coverImageUrl }: IStudyCoverSkeleton) {
  return (
    <Layout>
      {coverImageUrl && <Image src={coverImageUrl} width={343} height={165} alt="study" />}
      <SpaceIcon>
        <Skeleton>temp</Skeleton>
      </SpaceIcon>
    </Layout>
  );
}

const Layout = styled.div`
  margin: 0 var(--gap-4);
  height: 165px;
  position: relative;
`;

const SpaceIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  border-radius: 18px;
  position: absolute;
  border: 1px solid var(--gray-400);
  overflow: hidden;
  bottom: -24px;
  left: 12px;
  background-color: white;
`;

export default StudyCoverSkeleton;
