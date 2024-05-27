import { Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";

import { SingleLineText } from "../../../styles/layout/components";

export interface IImageTileData {
  imageUrl: string;
  text: string;
  url?: string;
  func?: () => void;
  id?: string;
}

interface IImageTileGridLayout {
  imageDataArr: IImageTileData[];
  grid?: {
    row: number;
    col: number;
  };
  selectedId?: string[];
  selectedSubId?: string[];
}
export default function ImageTileGridLayout({
  imageDataArr,
  grid,
  selectedId,
  selectedSubId,
}: IImageTileGridLayout) {
  const { row = 2, col = 2 } = grid || {};

  function ImageTileLayout({ url, text }: { url: string; text: string }) {
    return (
      <Flex direction="column" textAlign="center">
        <ImageContainer>
          <Image src={url} sizes="180px" fill={true} alt="reviewThumbnailImage" />
        </ImageContainer>
        <TextContainer>{text}</TextContainer>
      </Flex>
    );
  }

  return (
    <GridContainer row={row} col={col}>
      {imageDataArr.map((imageData, idx) =>
        imageData?.url ? (
          <Link key={idx} href={imageData.url} passHref>
            <ImageTileLayout url={imageData.imageUrl} text={imageData.text} />
          </Link>
        ) : (
          <Button
            key={idx}
            $isSelected={
              selectedId?.includes(imageData?.id)
                ? "main"
                : selectedSubId?.includes(imageData?.id)
                  ? "sub"
                  : null
            }
            onClick={imageData.func}
          >
            <ImageTileLayout url={imageData.imageUrl} text={imageData.text} />
          </Button>
        ),
      )}
    </GridContainer>
  );
}
const GridContainer = styled.div<{ row: number; col: number }>`
  display: grid;
  grid-template-columns: ${(props) => `repeat(${props.col}, 1fr)`};
  grid-template-rows: ${(props) => `repeat(${props.row}, 1fr)`};
  gap: 12px;
`;

const ImageContainer = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
`;

const TextContainer = styled(SingleLineText)`
  margin-top: 12px;
`;

const Button = styled.button<{ $isSelected: "main" | "sub" | null }>`
  background-color: ${(props) =>
    props.$isSelected === "main"
      ? "var(--color-mint)"
      : props.$isSelected === "sub"
        ? "var(--color-orange)"
        : null};
  color: ${(props) => (props.$isSelected ? "white" : "inherit")};
  border-radius: var(--rounded);
`;
