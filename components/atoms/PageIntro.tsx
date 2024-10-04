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
    <Box pt={2} pb={10} px={5} bgColor="white">
      <Box mb={2} fontSize="24px" fontWeight={600}>
        {first} <br /> {second}
      </Box>
      <Box fontWeight={300} color="var(--gray-500)" fontSize="13px">
        {sub}
      </Box>
    </Box>
  );
}

export default PageIntro;
