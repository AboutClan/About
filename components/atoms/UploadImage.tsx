import { Box } from "@chakra-ui/react";
import Image from "next/image";
import styled from "styled-components";

interface UploadImageProps {
  url: string;
  onClose: () => void;
}

function UploadImage({ url, onClose }: UploadImageProps) {
  return (
    <Box position="relative" w="60px" h="60px">
      <Image src={url} alt="uploadImage" fill sizes="80px" />
      <XButton onClick={onClose}>
        <i className="fa-light fa-x fa-xs" />
      </XButton>
    </Box>
  );
}

const XButton = styled.button`
  padding: 2px;
  width: 12px;
  height: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  overflow: hidden;
  position: absolute;
  top: 0;
  right: -12px;
  transform: translate(-50%, -50%);
  background-color: black;
  color: white;
`;

export default UploadImage;
