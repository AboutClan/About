import styled from "styled-components";

import ImageTileSlider, { IImageTile } from "../../components/organisms/sliders/ImageTileSlider";
import { IGroup } from "../../types/models/groupTypes/group";
import { getRandomImage } from "../../utils/imageUtils";

interface IGroupMine {
  myGroups: IGroup[];
}

function GroupMine({ myGroups }: IGroupMine) {
  const imageTileArr: IImageTile[] = myGroups?.map((group) => ({
    imageUrl: group.image || getRandomImage(),
    text: group.title,
    url: `/group/${group.id}`,
  }));
 
  return (
    <Layout>
      {myGroups?.length ? (
        <ImageTileSlider imageTileArr={imageTileArr} slidesPerView={2.2} size="md" aspect={2} />
      ) : (
        <BlockLayout>가입중인 소모임이 없습니다.</BlockLayout>
      )}
    </Layout>
  );
}

const Layout = styled.div`
  background-color: var(--gray-100);
  border-bottom: 6px solid var(--gray-200);
  padding: 16px;
`;

const BlockLayout = styled.div`
  height: 110px;

  margin-right: var(--gap-4);
  padding: var(--gap-3) var(--gap-3);
  padding-bottom: var(--gap-2);
  background-color: inherit;

  border-radius: var(--rounded);
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: var(--gap-4);
  margin-bottom: var(--gap-4);
  font-size: 18px;
  color: var(--gray-600);
`;

export default GroupMine;
