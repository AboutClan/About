import { Box, Button, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { STUDY_CREW_PLACE_MAPPING } from "../../../../../constants/service/study/place";
import { useUserInfo } from "../../../../../hooks/custom/UserHooks";
import { useGroupQuery } from "../../../../../hooks/groupStudy/queries";
import StudyExpectedMap from "../../../../../pageTemplates/study/StudyExpectedMap";
import { LocationProps } from "../../../../../types/common";
import { StudyCrew } from "../../../../../types/models/studyTypes/study-entity.types";
import PageIntro from "../../../../atoms/PageIntro";
import RangeSlider from "../../../../molecules/RangeSlider";
import { MainCard, SubCard } from "./parts/StudyCrewCards";

interface SecondPageSectionProps {
  rangeNum: number;
  changeRangeNum: (n: number) => void;
  voteLocation: LocationProps;
  participants: string[];
  pickLocation: (l: LocationProps) => void;
  defaultLocation: LocationProps;
}

function SecondPageSection({
  rangeNum,
  changeRangeNum,
  voteLocation,
  participants,
  pickLocation,
  defaultLocation,
}: SecondPageSectionProps) {
  const userInfo = useUserInfo();
  const [crew, setCrew] = useState<StudyCrew>(null);

  const [isMatchType, setIsMatchType] = useState(true);

  useEffect(() => {
    const belong = userInfo?.belong as StudyCrew;
    if (belong) {
      setIsMatchType(false);
      setCrew(belong);
    }
  }, [userInfo]);

  useEffect(() => {
    if (defaultLocation) {
      pickLocation(defaultLocation);
      return;
    }

    if (userInfo?.locationDetail) {
      pickLocation(userInfo.locationDetail);
    }
  }, [isMatchType, defaultLocation, userInfo?.locationDetail]);

  const { data } = useGroupQuery("pending", "크루", 0);

  return (
    <>
      <PageIntro
        main={{
          first: "스터디 매칭 범위를 설정해 주세요.",
        }}
        sub="설정한 범위 내 3명 이상의 멤버가 모이는 경우 진행됩니다."
      />
      <Flex mb={8}>
        <Button
          flex={1}
          size="lg"
          bg={isMatchType ? "mint" : "white"}
          color={isMatchType ? "white" : "gray.800"}
          mr={2}
          borderRadius="8px"
          border={isMatchType ? "none" : "1px solid var(--gray-300)"}
          onClick={() => setIsMatchType(true)}
          _hover={{ bg: "var(--color-mint)" }}
          _active={{ bg: "var(--color-mint)" }}
          _focus={{ boxShadow: "none" }}
        >
          스터디 매칭
        </Button>
        <Button
          flex={1}
          bg={isMatchType ? "white" : "mint"}
          color={!isMatchType ? "white" : "gray.800"}
          size="lg"
          borderRadius="8px"
          border={!isMatchType ? "none" : "1px solid var(--gray-300)"}
          onClick={() => setIsMatchType(false)}
          _hover={{ bg: "var(--color-mint)" }}
          _active={{ bg: "var(--color-mint)" }}
          _focus={{ boxShadow: "none" }}
        >
          스터디 크루
        </Button>
      </Flex>{" "}
      {isMatchType ? (
        <>
          <Box fontSize="18px" mb={5} fontWeight={600}>
            스터디 매칭 범위
          </Box>
          <RangeSlider
            numberArr={[0, 1, 2, 3]}
            defaultNums={[0, rangeNum]}
            isNumber={false}
            setNums={(num: number[]) => {
              if (num[1] === 0) return;
              changeRangeNum(num[1]);
            }}
          />
          {voteLocation && <StudyExpectedMap centerLocation={voteLocation} rangeNum={rangeNum} />}
        </>
      ) : (
        <>
          {data
            ?.slice()
            .sort((a, b) => {
              const extractBracket = (title: string) => {
                const match = title.match(/^\[[^\]]*\]/);
                return match ? match[0] : "";
              };

              if (extractBracket(a.title) === crew) return -1;
              if (extractBracket(b.title) === crew) return 1;

              return b.participants.length - a.participants.length;
            })
            ?.map((d) => {
              const extractBracket = (title: string) => {
                const match = title.match(/^\[[^\]]*\]/);
                return match ? match[0] : "";
              };
              const title2 = extractBracket(d.title) as StudyCrew;

              const beforeCnt = participants.filter((belong) => belong === title2).length;
              const standardText = STUDY_CREW_PLACE_MAPPING?.[title2]
                ?.map((c) => c.standard)
                .join("/");
              return (
                <>
                  <MainCard
                    isSelected={crew === title2}
                    handleClick={(c) => setCrew(crew === c ? null : c)}
                    title={title2}
                    image={d.squareImage}
                    memberCnt={{
                      current: beforeCnt,
                      max: d.participants.length,
                    }}
                    subTitle={standardText}
                  />
                  {crew === title2 ? (
                    STUDY_CREW_PLACE_MAPPING?.[crew]?.map((c, idx2) => {
                      return (
                        <SubCard
                          key={idx2}
                          location={c}
                          isSelected={c.name === voteLocation?.name}
                          handleClick={(l: LocationProps) => {
                            pickLocation(voteLocation?.name === l.name ? null : l);
                          }}
                        />
                      );
                    })
                  ) : (
                    <></>
                  )}
                </>
              );
            })}
        </>
      )}
      <Box h={20} />
    </>
  );
}

export default SecondPageSection;
