import { Flex } from "@chakra-ui/react";

import { useWindowWidth } from "../../hooks/custom/CustomHooks";
import SectionHeader from "../atoms/SectionHeader";

interface SlideSectionColProps {
  title: string;
  subTitle: string;
  children: React.ReactNode;
}

function SlideSectionCol({ title, subTitle, children }: SlideSectionColProps) {
  const windowWidth = useWindowWidth(); // 현재 화면 너비 가져오기
  const width = windowWidth - 60;

  return (
    <Flex flex={`0 0 ${width}px`} direction="column" mt={5}>
      <SectionHeader title={title} subTitle={subTitle} />
      {children}
    </Flex>
  );
}

export default SlideSectionCol;
