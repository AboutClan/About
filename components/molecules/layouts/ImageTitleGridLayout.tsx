import { Box, Flex } from "@chakra-ui/react";
import Link from "next/link";
import styled from "styled-components";

import { SingleLineText } from "../../../styles/layout/components";
import PlaceImage from "../PlaceImage";

export interface IImageTileData {
  imageUrl: string;
  text: string;
  url?: string;
  func?: () => void;
  id?: string;
  priority?: boolean;
}

interface IImageTileGridLayout {
  imageDataArr: IImageTileData[];
  grid?: {
    row: number;
    col: number;
  };
  selectedId?: string[];
  selectedSubId?: string[];
  hasToggleHeart?: boolean;
  size?: "sm" | "lg";
}
export default function ImageTileGridLayout({
  imageDataArr,
  grid,
  selectedId,
  selectedSubId,
  hasToggleHeart,
  size = "sm",
}: IImageTileGridLayout) {
  const { row = 2, col = 2 } = grid || {};

  return (
    <GridContainer row={row} col={col} size={size}>
      {imageDataArr.map((imageData, idx) =>
        imageData?.url ? (
          <Link key={idx} href={imageData.url} passHref>
            <ImageTileLayout
              size={size}
              url={imageData.imageUrl}
              text={imageData.text}
              isPriority={imageData?.priority}
              hasToggleHeart={hasToggleHeart}
              id={imageData?.id}
              selected={
                selectedId?.includes(imageData?.id)
                  ? "main"
                  : selectedSubId?.includes(imageData?.id)
                  ? "sub"
                  : null
              }
            />
          </Link>
        ) : (
          <Box as="button" key={idx} onClick={imageData.func}>
            <ImageTileLayout
              size={size}
              url={imageData.imageUrl}
              hasToggleHeart={hasToggleHeart}
              text={imageData.text}
              isPriority={idx === 0}
              id={imageData?.id}
              selected={
                selectedId?.includes(imageData?.id)
                  ? "main"
                  : selectedSubId?.includes(imageData?.id)
                  ? "sub"
                  : null
              }
            />
          </Box>
        ),
      )}
    </GridContainer>
  );
}

export function ImageTileLayout({
  url,
  text,
  isPriority,
  id,
  selected,
  hasToggleHeart,
  size,
}: {
  url: string;
  text: string;
  isPriority: boolean;
  id?: string;
  selected: "main" | "sub" | null;
  hasToggleHeart: boolean;
  size: "sm" | "lg";
}) {
  return (
    <Flex direction="column" textAlign="center" mb={2} w="full" aspectRatio={1 / 1}>
      <PlaceImage
        selected={selected}
        imageProps={{ image: url, isPriority }}
        id={id}
        hasToggleHeart={hasToggleHeart}
        size={size === "sm" ? "sm" : undefined}
        isFull={size === "lg"}
      />
      <TextContainer selected={selected}>{text}</TextContainer>
    </Flex>
  );
}

const GridContainer = styled.div<{ row: number; col: number; size: "sm" | "lg" }>`
  display: grid;
  grid-template-columns: ${(props) => `repeat(${props.col}, 1fr)`};
  grid-template-rows: ${(props) => `repeat(${props.row}, 1fr)`};
  gap: ${(props) => (props.size === "sm" ? "8" : "12")}px;
`;

const TextContainer = styled(SingleLineText)<{ selected: "main" | "sub" | null }>`
  margin-top: 8px;
  font-size: 11px;
  font-weight: ${(props) => (props.selected ? "700" : "500")};
  color: ${(props) =>
    props.selected === "main"
      ? "var(--color-mint)"
      : props.selected === "sub"
      ? "var(--color-orange)"
      : null};
`;
