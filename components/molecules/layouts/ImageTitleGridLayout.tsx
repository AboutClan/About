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
}
export default function ImageTileGridLayout({
  imageDataArr,
  grid,
  selectedId,
  selectedSubId,
  hasToggleHeart,
}: IImageTileGridLayout) {
  const { row = 2, col = 2 } = grid || {};

  return (
    <GridContainer row={row} col={col}>
      {imageDataArr.map((imageData, idx) =>
        imageData?.url ? (
          <Link key={idx} href={imageData.url} passHref>
            <ImageTileLayout
              url={imageData.imageUrl}
              text={imageData.text}
              isPriority={idx === 0}
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

export const ImageTileLayout = ({
  url,
  text,
  isPriority,
  id,
  selected,
  hasToggleHeart,
}: {
  url: string;
  text: string;
  isPriority: boolean;
  id?: string;
  selected: "main" | "sub" | null;
  hasToggleHeart: boolean;
}) => {
  return (
    <Flex direction="column" textAlign="center" mb={2}>
      <PlaceImage
        selected={selected}
        image={{ url, isPriority }}
        id={id}
        hasToggleHeart={hasToggleHeart}
      />
      <TextContainer selected={selected}>{text}</TextContainer>
    </Flex>
  );
};

const GridContainer = styled.div<{ row: number; col: number }>`
  display: grid;
  grid-template-columns: ${(props) => `repeat(${props.col}, 1fr)`};
  grid-template-rows: ${(props) => `repeat(${props.row}, 1fr)`};
  gap: 8px;
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
