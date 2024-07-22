import { Box, Flex } from "@chakra-ui/react";
import Link from "next/link";

export interface SummaryBlockProps {
  url: string;
  title: string;
  text: string;
}

function SummaryBlock({ url, title, text }: SummaryBlockProps) {
  return (
    <Link href={url} style={{ width: "100%" }}>
      <Flex p="10px " bgColor="white" borderRadius="var(--rounded-lg)" border="var(--border-main)">
        <Flex justify="center" align="center" p="8px" mr="10px">
          <i className="fa-solid fa-magnifying-glass fa-lg" style={{ color: "var(--gray-500)" }} />
        </Flex>
        <Flex h="inherit" direction="column" justify="space-around">
          <Box fontWeight={600} fontSize="13px">
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

export default SummaryBlock;
