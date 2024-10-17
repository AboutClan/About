import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import styled from "styled-components";

export interface IImageTileData {
  imageUrl: string;
  text: string;
  url?: string;
  func?: () => void;
  id?: string;
}

interface IImageTileFlexLayout {
  imageDataArr: IImageTileData[];
  selectedId?: string[];
  selectedSubId?: string[];
}
export default function ImageTileFlexLayout({
  imageDataArr,

  selectedId,
  selectedSubId,
}: IImageTileFlexLayout) {
  function ImageTileLayout({ url, text }: { url: string; text: string }) {
    return (
      <Flex direction="column" alignItems="center">
        <Box w="64px" h="64px" borderRadius="8px" overflow="hidden">
          <Image width={64} height={64} src={url} alt="studyPlaceImage" />
        </Box>
        <Box textAlign="center" mt="12px" whiteSpace="nowrap">
          {text}
        </Box>
      </Flex>
    );
  }

  return (
    <Flex overflow="auto" pb="12px">
      {imageDataArr.map((imageData, idx) => (
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
      ))}
    </Flex>
  );
}

const Button = styled.button<{ $isSelected: "main" | "sub" | null }>`
  background-color: ${(props) =>
    props.$isSelected === "main"
      ? "var(--color-mint)"
      : props.$isSelected === "sub"
        ? "var(--color-orange)"
        : null};
  color: ${(props) => (props.$isSelected ? "white" : "inherit")};
  border-radius: var(--rounded);
  margin-right: 12px;
  height: 100px;
`;
