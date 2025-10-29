import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

export interface SummaryBlockProps {
  url: string;
  title: string;
  text: string;
  writer?: string;
  image?: string;
}

function SummaryBlock({ image, url, title, text }: SummaryBlockProps) {
  return (
    <Link href={url} style={{ width: "100%" }}>
      <Flex
        p="10px"
        pr={3}
        bgColor="white"
        borderRadius="var(--rounded-lg)"
        border="var(--border-main)"
      >
        <Flex justify="center" align="center" p="8px" mr="10px" ml="2px">
          {!image ? <SearchIcon /> : <Image src={image} alt="feedImage" />}
        </Flex>
        <Flex h="inherit" direction="column" justify="space-around">
          <Box
            fontWeight={600}
            fontSize="13px"
            mb={1}
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: "1",
              overflow: "hidden",
            }}
          >
            {title}
          </Box>
          <Box
            fontSize="12px"
            color="var(--gray-600)"
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: "1",
              overflow: "hidden",
            }}
          >
            {text}
          </Box>
        </Flex>
      </Flex>
    </Link>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="var(--gray-500)"
    >
      <path d="M380-320q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l224 224q11 11 11 28t-11 28q-11 11-28 11t-28-11L532-372q-30 24-69 38t-83 14Zm0-80q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
    </svg>
  );
}

export default SummaryBlock;
