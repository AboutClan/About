import { Box, Flex, Text } from "@chakra-ui/react";
import styled from "styled-components";

interface ICheckBoxNav {
  buttonList: string[];
  selectedButton: string;
  setSelectedButton: (value: string) => void;
}

function CheckBoxNav({ buttonList, selectedButton, setSelectedButton }: ICheckBoxNav) {
  const handleCheckBoxChange = (value: string) => {
    setSelectedButton(selectedButton === value ? "" : value);
  };

  return (
    <Layout>
      <Flex overflowX="auto" flexWrap="wrap" lineHeight={2.2}>
        {buttonList?.map((item) => (
          <Box key={item} display="flex" alignItems="center" mr="var(--gap-4)">
            <Flex
              as="button"
              h="20px"
              w="20px"
              borderWidth={selectedButton === item ? "0" : "1.5px"}
              borderRadius="var(--rounded)"
              borderColor="var(--gray-400)"
              bg={selectedButton === item ? "var(--color-mint)" : "white"}
              onClick={() => handleCheckBoxChange(item)}
              justifyContent="center"
              alignItems="center"
            >
              {selectedButton === item && <i className="fa-solid fa-check" style={{ color: "white" }} />}
            </Flex>
            <Text ml="var(--gap-2)">{item}</Text>
          </Box>
        ))}
      </Flex>
    </Layout>
  );
}

const Layout = styled.div`
  padding: 0 var(--gap-4);
`;

export default CheckBoxNav;
