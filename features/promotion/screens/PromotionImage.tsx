import Image from "next/image";
import styled from "styled-components";

function PromotionImage() {
  return (
    <Layout>
      <Image
        src="https://user-images.githubusercontent.com/84257439/235453825-026ca653-d356-485a-a916-19c21352e10a.png"
        alt="promotionImage"
        width={200}
        height={200}
      />
    </Layout>
  );
}

const Layout = styled.div``;

export default PromotionImage;
