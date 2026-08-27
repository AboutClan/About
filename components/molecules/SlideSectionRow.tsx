import { Box, BoxProps } from "@chakra-ui/react";

interface SlideSectionRowProps extends Pick<BoxProps, "gap"> {
  children: React.ReactNode;
}

function SlideSectionRow({ gap = "12px", children }: SlideSectionRowProps) {
  return (
    <Box
      display="flex"
      overflowX="auto"
      ml="20px"
      gap={gap}
      sx={{
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch",
        overscrollBehaviorX: "contain",
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
        "& > *": {
          scrollSnapAlign: "start",
        },
      }}
    >
      {children}
    </Box>
  );
}

export default SlideSectionRow;
