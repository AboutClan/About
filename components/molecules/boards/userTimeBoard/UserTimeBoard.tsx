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
}

interface IUserTimeBlock {
  startToEndInterval: number;
  startInterval: number;
  name: string;
  start: string;
  end: string;
}

export default function UserTimeBoard({ members }: ITimeBoard) {
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

  return (
    <Box h={`${members.length * 36 + 32}px`} position="relative">
      <Flex h="100%" w="100%" position="absolute">
        {STUDY_VOTE_HOUR_ARR.map((hour, idx) => (
          <Flex key={idx} direction="column" align="center" flex={1}>
            <Box py="6px" h="28px" color="gray.500" fontSize="11px">
              {hour}
            </Box>
            <Box w="1px" h="100%" bg="gray.100" />
          </Flex>
        ))}
      </Flex>
      <Box position="absolute" mt="30px">
        <Box ref={containerRef}>
          {userBlocks.map((props, idx) => (
            <Box
              key={idx}
              w={`${props.startToEndInterval * blockWidth}px`}
              ml={`${(props.startInterval + 0.5) * blockWidth}px`}
              fontSize="9px"
              py={1}
              px="1px"
            >
              <Box
                borderRadius="4px"
                lineHeight="12px"
                px={1}
                color="white"
                py={0.5}
                bg={COLOR_400_ARR[idx]}
              >
                {props.name}
                <br />
                {props.start} - {props.startToEndInterval >= 3 && props.end}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
