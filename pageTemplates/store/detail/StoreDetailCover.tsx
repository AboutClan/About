import Image from "next/image";
import styled from "styled-components";

interface IStoreDetailCover {
  image: string;
  isCompleted: boolean;
}

function StoreDetailCover({ image, isCompleted }: IStoreDetailCover) {
  return (
    <Layout>
      <Image width={200} height={200} alt="storeGiftDetail" src={image} priority={true} />
      {isCompleted && (
        <CompletedRapple>
          <Circle>추첨 완료</Circle>
        </CompletedRapple>
      )}
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  align-items: center;
`;

const CompletedRapple = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  opacity: 0.8;
`;
const Circle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  border: 2px solid var(--gray-800);
  display: flex;
  font-size: 14px;
  justify-content: center;
  align-items: center;

  font-weight: 800;
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;

export default StoreDetailCover;
