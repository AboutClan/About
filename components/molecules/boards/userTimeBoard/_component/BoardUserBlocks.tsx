import { Box } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { COLOR_400_ARR } from "../../../../../constants/colorConstants";
import { STUDY_VOTE_HOUR_ARR } from "../../../../../constants/serviceConstants/studyConstants/studyTimeConstant";
import { ITimeBoardParticipant } from "../UserTimeBoard";
import { transformToUserBlocks } from "../_lib/transformToUserBlocks";

export interface IUserTimeBlock {
  name: string;
  start: string;
  end: string;
  startInterval: number;
  startToEndInterval: number;
}

interface IBoardUserBlocks {
  members: ITimeBoardParticipant[];
}

export default function BoardUserBlocks({ members }: IBoardUserBlocks) {
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

  console.log("Block Width:", blockWidth);

  return (
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
  );
}
