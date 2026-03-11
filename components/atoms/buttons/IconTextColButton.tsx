import { Box, Button, Flex } from "@chakra-ui/react";

interface IconTextColButtonProps {
  icon: React.ReactNode;
  text: string;
  func: () => void;
}

function IconTextColButton({ icon, text, func }: IconTextColButtonProps) {
  return (
    <Button
      mr={3}
      display="flex"
      flexDir="column"
      alignItems="center"
      variant="unstyled"
      w="48px"
      h={10}
      color="gray.500"
      onClick={func}
    >
      <Flex justify="center" align="center" w="26px" h="26px">
        {icon}
      </Flex>

      <Box mt={0.5} fontSize="11px" fontWeight="medium" lineHeight="12px">
        {text}
      </Box>
    </Button>
  );
}

export default IconTextColButton;
