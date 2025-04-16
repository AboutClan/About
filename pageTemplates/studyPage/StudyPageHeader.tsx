import { Box } from "@chakra-ui/react";
import { useState } from "react";

import {
  InfoModalButton,
  PointGuideModalButton,
} from "../../components/atoms/buttons/ModalButtons";
import Header from "../../components/layouts/Header";
import { useTypeToast } from "../../hooks/custom/CustomToast";

function StudyPageHeader() {
  const typeToast = useTypeToast();
  const [modalType, setModalType] = useState(null);
  console.log(modalType);
  return (
    <Header title="스터디" isBack={false}>
      <Box
        mr={3}
        onClick={(e) => {
          typeToast("inspection");
          e.preventDefault();
        }}
      >
        <PointGuideModalButton handleClick={() => setModalType(null)} />
      </Box>
      <Box
        onClick={(e) => {
          typeToast("inspection");
          e.preventDefault();
        }}
      >
        <InfoModalButton handleClick={() => setModalType(null)} />
      </Box>
    </Header>
  );
}

export default StudyPageHeader;
