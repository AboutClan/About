import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { COLOR_400_ARR } from "../../../../constants/colorConstants";
import { STUDY_VOTE_HOUR_ARR } from "../../../../constants/serviceConstants/studyConstants/studyTimeConstant";
import { TimeRangeProps } from "../../../../types/models/utilTypes";
import { transformToUserBlocks } from "./_lib/transformToUserBlocks";

export interface ITimeBoardParticipant {
  name: string;
  time: TimeRangeProps;
}

interface ITimeBoard {
  members: ITimeBoardParticipant[];
  isCardNews?: boolean;
}

interface IUserTimeBlock {
  startToEndInterval: number;
  startInterval: number;
  name: string;
  start: string;
  end: string;
}

export default function UserTimeBoard({ members, isCardNews }: ITimeBoard) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [blockWidth, setBlockWidth] = useState<number>(0);
  const [userBlocks, setUserBlocks] = useState<IUserTimeBlock[]>([]);

  const calculateBlockWidth = () => {
    const screenWidth = window.innerWidth; // 현재 화면 가로 길이 가져오기
    const width = (screenWidth - 40) / STUDY_VOTE_HOUR_ARR.length; // 40px을 빼고 7로 나누기
    setBlockWidth(parseFloat(width.toFixed(2))); // 소수점 두 자리 반올림
  };

  useEffect(() => {
    calculateBlockWidth(); // 초기 계산

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(calculateBlockWidth); // 리사이즈 시 재계산
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect(); // 컴포넌트 언마운트 시 정리
  }, []);

  useEffect(() => {
    const newUserBlocks = transformToUserBlocks(members);

    setUserBlocks(newUserBlocks);
  }, [members]);

  const rowH = isCardNews ? 56 : 36;
  const headerH = isCardNews ? 44 : 28;

  return (
    <Box h={`${members.length * rowH + headerH + 4}px`} position="relative">
      <Flex h="100%" w="100%" position="absolute">
        {STUDY_VOTE_HOUR_ARR.map((hour, idx) => (
          <Flex key={idx} direction="column" align="center" flex={1}>
            <Box
              py={isCardNews ? "10px" : "6px"}
              h={`${headerH}px`}
              color="gray.500"
              fontSize={isCardNews ? "16px" : "11px"}
            >
              {hour}
            </Box>
            <Box w="1px" h="100%" bg="gray.100" />
          </Flex>
        ))}
      </Flex>
      <Box position="absolute" mt={`${headerH - 2}px`} w="full">
        <Box ref={containerRef}>
          {userBlocks.map((props, idx) => (
            <Box
              key={idx}
              w={`${props.startToEndInterval * blockWidth}px`}
              ml={`${(props.startInterval + 0.5) * blockWidth}px`}
              fontSize={isCardNews ? "14px" : "9px"}
              py={isCardNews ? 2 : 1}
              px={isCardNews ? "3px" : "1px"}
            >
              <Box
                borderRadius={isCardNews ? "6px" : "4px"}
                lineHeight={isCardNews ? "20px" : "12px"}
                px={isCardNews ? 2 : 1}
                color="white"
                py={0.5}
                bg={COLOR_400_ARR[idx]}
              >
                {props.name.slice(0, 1) + "*" + props.name.slice(2)}
                <br />
                {props.start} - {props.startToEndInterval >= 2 && props.end}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
