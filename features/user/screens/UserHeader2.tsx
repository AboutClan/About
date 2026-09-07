import styled from "styled-components";

import ButtonWrapper from "@/components/atoms/ButtonWrapper";
import { SettingIcon } from "@/components/Icons/CustomIcons";
import Slide from "@/components/layouts/PageSlide";
import { AboutLogo } from "@/components/services/AboutLogo";

export default function UserHeader() {
  return (
    <Slide isFixed={true}>
      <Layout>
        <AboutLogo />
        <ButtonWrapper url="/user/setting">
          <SettingIcon />
        </ButtonWrapper>
      </Layout>
    </Slide>
  );
}

const Layout = styled.header`
  height: var(--header-h);
  font-size: 20px;
  background-color: white;
  padding-left: 20px;
  padding-right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: var(--max-width);
  margin: 0 auto;
`;

