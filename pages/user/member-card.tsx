import { Flex } from "@chakra-ui/react";

import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import MemberCard from "../../pageTemplates/user/MemberCard";

export default function MemberCardPage() {
  return (
    <>
      <Header title="멤버 확인증" url="/user/setting" />
      <Slide>
        <Flex direction="column" align="center" pt={6} pb={10} mt={10}>
          <MemberCard />
        </Flex>
      </Slide>
    </>
  );
}
