import { Box, Flex } from "@chakra-ui/react";
import { AnimatePresence, PanInfo } from "framer-motion";

import { motion } from "framer-motion";
import ButtonWrapper from "../../components/atoms/ButtonWrapper";
import SectionHeader from "../../components/atoms/SectionHeader";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import { GroupShapShotProps } from "../../hooks/groupStudy/queries";
import HomeGroupCol from "./HomeGroupCol";
interface HomeGroupSectionProps {
  groups: GroupShapShotProps;
}

function HomeGroupSection({ groups }: HomeGroupSectionProps) {
  console.log(2, groups);

  const onDragEnd = (panInfo: PanInfo) => {};

  return (
    <Box>
      <AnimatePresence initial={false}>
        <motion.div
          drag="x"
          dragConstraints={{ left: -1000, right: 0 }}
          dragElastic={0.3}
          onDragEnd={(_, panInfo) => onDragEnd(panInfo)}
          style={{
            display: "flex",
            width: "100%",
            gap: "12px",
          }}
        >
          <Flex flex="0 0 300px" direction="column" my={5}>
            <SectionHeader title="About 취미 소모임" subTitle="같은 취미로 이어지는 우리">
              <ButtonWrapper size="xs" url="/group">
                <ShortArrowIcon dir="right" size="sm" />
              </ButtonWrapper>
            </SectionHeader>
            <HomeGroupCol threeGroups={groups?.hobby} isSmall />
          </Flex>
          <Flex flex="0 0 300px" direction="column" my={5}>
            <SectionHeader title="About 지속 성장 스터디" subTitle="함께 공부하며 만들어가는 성장">
              <ButtonWrapper size="xs" url="/group">
                <ShortArrowIcon dir="right" size="sm" />
              </ButtonWrapper>
            </SectionHeader>
            <HomeGroupCol threeGroups={groups?.study} isSmall />
          </Flex>
          <Flex w="100%" direction="column" my={5}>
            <SectionHeader title="About 자기계발 소모임" subTitle="이번 주부터 갓생 시작">
              <ButtonWrapper size="xs" url="/group">
                <ShortArrowIcon dir="right" size="sm" />
              </ButtonWrapper>
            </SectionHeader>
            <HomeGroupCol threeGroups={groups?.development} />
          </Flex>
          <Flex direction="column" my={5}>
            <SectionHeader title="About 시험 준비 스터디" subTitle="시험 성공의 지름길">
              <ButtonWrapper size="xs" url="/group">
                <ShortArrowIcon dir="right" size="sm" />
              </ButtonWrapper>
            </SectionHeader>
            <HomeGroupCol threeGroups={groups?.exam} />
          </Flex>
          <Flex direction="column" my={5}>
            <SectionHeader title="About 신규 소모임" subTitle="지금 가장 주목할 소모임">
              <ButtonWrapper size="xs" url="/group">
                <ShortArrowIcon dir="right" size="sm" />
              </ButtonWrapper>
            </SectionHeader>
            <HomeGroupCol threeGroups={groups?.new.slice().reverse()} />
          </Flex>
          <Flex direction="column" my={5}>
            <SectionHeader title="About 오픈 예정 소모임" subTitle="새로운 만남을 준비 중">
              <ButtonWrapper size="xs" url="/group">
                <ShortArrowIcon dir="right" size="sm" />
              </ButtonWrapper>
            </SectionHeader>
            <HomeGroupCol threeGroups={groups?.waiting} />
          </Flex>
        </motion.div>{" "}
      </AnimatePresence>
    </Box>
  );
}

export default HomeGroupSection;
