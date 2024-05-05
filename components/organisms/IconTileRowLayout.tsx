import styled from "styled-components";

import { Size } from "../../types/components/assetTypes";
import IconLinkTile, { IIconLinkTile } from "../atoms/IconLinkTile";

interface IIconTileRowLayout {
  tileDataArr: IIconLinkTile[];
  size?: Size;
}
export default function IconTileRowLayout({ tileDataArr, size }: IIconTileRowLayout) {
  return (
    <Layout>
      {tileDataArr.map((tile, idx) => (
        <IconLinkTile
          key={idx}
          url={tile.url}
          text={tile.text}
          icon={tile.icon}
          func={tile.func}
          size={size}
        />
      ))}
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  justify-content: space-between;
`;
