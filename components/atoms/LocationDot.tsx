import { Box, Flex } from "@chakra-ui/react";
import { TriangleIcon } from "../Icons/DiagramIcon";
import { LocationDotIcon } from "../Icons/LocationIcons";

interface LocationDotProps {
  name: string;
}

function LocationDot({ name }: LocationDotProps) {
  return (
    <Box position="relative">
      <Box p={1} pr={2} borderRadius="14px" bg="mint" w="max-content">
        <Flex justify="center" align="center" w={4} h={4} mr={1} bg="white" borderRadius="50%">
          <LocationDotIcon />
        </Flex>
        <Box fontWeight="semiBold" fontSize="8px" color="white">
          {name}
        </Box>
      </Box>
      <Flex justify="flex-end" left="0" bottom="-3.5px" w="15.1px" position="absolute">
        <TriangleIcon />
      </Flex>
    </Box>
  );
}

export default LocationDot;
