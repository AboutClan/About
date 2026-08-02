import { Box } from "@chakra-ui/react";

interface PageIntroProps {
  main: {
    first: string;
    second?: string;
  };
  sub: string;
}

function PageIntro({ main: { first, second }, sub }: PageIntroProps) {
  return (
    <Box pt={2} pb={10} bgColor="white">
      <Box mb={2} fontSize="24px" fontWeight="bold">
        {first} <br /> {second}
      </Box>
      <Box fontWeight="light" color="gray.600" fontSize="13px">
        {sub}
      </Box>
    </Box>
  );
}

export default PageIntro;
