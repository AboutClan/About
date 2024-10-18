import { Box, Button } from "@chakra-ui/react";

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
      {icon}

      <Box mt={0.5} fontSize="11px" fontWeight="medium">
        {text}
      </Box>
    </Button>
  );
}

export default IconTextColButton;
