import { useRouter } from "next/router";
import styled from "styled-components";

import ImageSlider from "../../components/organisms/imageSlider/ImageSlider";
import { STORE_GIFT } from "../../storage/Store";

interface IPointPoint {
  mypoint: number;
}

function PointPoint({ mypoint }: IPointPoint) {
  const router = useRouter();

  const imageContainer = STORE_GIFT.map((item) => item.image);

  return (
    <Layout>
      <Button onClick={() => router.push("/point/pointLog")}>
        <div>About 포인트</div>
        <div>
          <span>{mypoint}점</span>
          <i className="fa-solid fa-chevron-right" />
        </div>
      </Button>
      <Store onClick={() => router.push("/store")}>
        <Button>
          <div>포인트 스토어</div>
          <div>
            <i className="fa-solid fa-chevron-right" />
          </div>
        </Button>
        <Wrapper>
          <ImageSlider type="point" imageContainer={imageContainer} />
        </Wrapper>
      </Store>
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: var(--gap-5);
  padding: var(--gap-4);
  border-radius: var(--rounded-lg);
  background-color: white;
`;
const Button = styled.button`
  width: 100%;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  padding: var(--gap-3) var(--gap-2);
  > div:first-child {
    font-size: 14px;
  }
  > div:last-child {
    display: flex;
    align-items: center;
    > span:first-child {
      margin-right: var(--gap-2);
    }
  }
`;

const Wrapper = styled.div`
  margin-top: var(--gap-3);
`;

const Store = styled.div``;

export default PointPoint;
