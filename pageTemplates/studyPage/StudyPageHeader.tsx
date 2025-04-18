import { Box } from "@chakra-ui/react";

import Header from "../../components/layouts/Header";
import InfoModalButton from "../../components/modalButtons/InfoModalButton";
import PointGuideModalButton from "../../components/modalButtons/PointGuideModalButton";

function StudyPageHeader() {
  return (
    <Header title="스터디" isBack={false}>
      <Box mr={3}>
        <PointGuideModalButton type="study" />
      </Box>
      <Box>
        <InfoModalButton type="study" />
      </Box>
    </Header>
  );
}

export default StudyPageHeader;
