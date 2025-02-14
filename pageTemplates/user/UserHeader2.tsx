import { Box, Flex } from "@chakra-ui/react";
import styled from "styled-components";
import ButtonWrapper from "../../components/atoms/ButtonWrapper";
import Slide from "../../components/layouts/PageSlide";
import { AboutLogo } from "../../components/services/AboutLogo";

export default function UserHeader() {
  return (
    <Slide isFixed={true}>
      <Layout>
        <AboutLogo />
        <Flex align="center">
          <Box mr={1}>
            <ButtonWrapper size="sm" url="/user/setting">
              <Box w="20px" h="20px">
                <SETTING_ICON />
              </Box>
            </ButtonWrapper>
          </Box>
        </Flex>
      </Layout>
    </Slide>
  );
}

const Layout = styled.header`
  height: var(--header-h);
  font-size: 20px;
  background-color: white;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--gray-100);
  max-width: var(--max-width);
  margin: 0 auto;
`;

export const SETTING_ICON = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      opacity="0.4"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.99991 13.0555C9.59867 13.0555 9.20135 12.9765 8.83066 12.8229C8.45995 12.6694 8.12313 12.4443 7.83941 12.1606C7.55568 11.8769 7.33062 11.54 7.17707 11.1693C7.02353 10.7986 6.9445 10.4013 6.9445 10.0001C6.9445 9.59885 7.02353 9.20153 7.17707 8.83083C7.33062 8.46013 7.55568 8.12331 7.83941 7.83959C8.12313 7.55586 8.45995 7.3308 8.83066 7.17725C9.20135 7.02371 9.59867 6.94467 9.99991 6.94467C10.8103 6.94467 11.5874 7.26658 12.1604 7.83959C12.7334 8.41259 13.0553 9.18974 13.0553 10.0001C13.0553 10.8104 12.7334 11.5876 12.1604 12.1606C11.5874 12.7336 10.8103 13.0555 9.99991 13.0555ZM17.5274 11.6263C17.1083 11.1923 16.8743 10.6123 16.8749 10.0088V9.99134C16.8743 9.38793 17.1083 8.80791 17.5274 8.37384L18.3099 7.56551C18.6316 7.23218 18.6932 6.72551 18.4624 6.32468L17.4141 4.50967C17.3016 4.3143 17.1284 4.16092 16.9209 4.0728C16.7134 3.98468 16.4828 3.96661 16.2641 4.02134L15.1682 4.29467C14.5798 4.44201 13.957 4.35317 13.4332 4.04717L13.4182 4.03884C12.9024 3.73903 12.5227 3.25097 12.3591 2.67717L12.0457 1.58634C11.984 1.36941 11.8532 1.17852 11.6732 1.04259C11.4932 0.906653 11.2738 0.833079 11.0482 0.833008H8.95158C8.48908 0.833008 8.08075 1.14051 7.95408 1.58634L7.61658 2.76051C7.46839 3.28528 7.12006 3.73087 6.64658 4.00134C6.59767 4.02869 6.54933 4.05703 6.50158 4.08634C6.0265 4.36926 5.45873 4.45255 4.92241 4.31801L3.73491 4.02134C3.51629 3.96668 3.28581 3.98469 3.07833 4.07264C2.87085 4.1606 2.69765 4.31371 2.58491 4.50884L1.53741 6.32468C1.42474 6.52004 1.37869 6.74675 1.4062 6.97059C1.43371 7.19443 1.53329 7.40324 1.68991 7.56551L2.47241 8.37384C2.89158 8.80801 3.12575 9.38801 3.12575 9.99051V10.0088C3.12575 10.6122 2.89158 11.1922 2.47241 11.6263L2.05325 12.0597C1.79185 12.3299 1.62558 12.678 1.57957 13.0512C1.53356 13.4243 1.61032 13.8023 1.79825 14.128L2.58575 15.4905C2.81741 15.8922 3.28575 16.0913 3.73575 15.9788L4.92325 15.6822C5.45956 15.5476 6.02734 15.6309 6.50241 15.9138C6.54991 15.943 6.59825 15.9713 6.64741 15.9988C7.12158 16.2672 7.46741 16.7147 7.61741 17.2397L7.95408 18.4138C8.08075 18.8597 8.48908 19.1663 8.95158 19.1663H11.0482C11.5107 19.1663 11.9191 18.8597 12.0457 18.4138L12.3824 17.2397C12.5324 16.7147 12.8782 16.2672 13.3524 15.9988C13.4016 15.9713 13.4499 15.943 13.4974 15.9138C13.9725 15.6309 14.5403 15.5476 15.0766 15.6822L16.2641 15.9788C16.4827 16.0335 16.7132 16.0155 16.9207 15.9275C17.1281 15.8396 17.3013 15.6865 17.4141 15.4913L18.4624 13.6755C18.5751 13.4801 18.6211 13.2534 18.5936 13.0296C18.5661 12.8058 18.4665 12.5969 18.3099 12.4347L17.5266 11.6263H17.5274Z"
      fill="#A0AEC0"
    />
  </svg>
);
