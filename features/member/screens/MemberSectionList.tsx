import styled from "styled-components";

import ImageSlider from "@/components/organisms/imageSlider/ImageSlider";
import ImageSliderMember from "@/features/member/components/ImageSliderMember";
import { IUser } from "@/types/models/userTypes/userInfoTypes";

interface IMemberMember {
  members: IUser[];
}

function MemberSectionList({ members }: IMemberMember) {
  return (
    <Layout>
      <ImageSlider type="member" imageContainer={members}>
        <ImageSliderMember imageContainer={members} />
      </ImageSlider>
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;

export default MemberSectionList;
