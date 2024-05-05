import Image from "next/image";
import styled from "styled-components";

import { SQUARE_RANDOM_IMAGE } from "../../../assets/images/imageUrl";

interface IGroupCover {
  image: string;
}

function GroupCover({ image }: IGroupCover) {
  return (
    <Layout>
      <Image
        src={image || SQUARE_RANDOM_IMAGE[0]}
        fill={true}
        sizes="400px"
        alt="study"
        priority={true}
      />
    </Layout>
  );
}

const Layout = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
`;

export default GroupCover;
