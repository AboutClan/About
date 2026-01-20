import { Box, Flex, Text, useCheckbox } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import {
  GatherThumbnailCard,
  GatherThumbnailCardProps,
} from "../../components/molecules/cards/GatherThumbnailCard";
import { GatherFilterType, useGatherQuery } from "../../hooks/gather/queries";
import { IGather } from "../../types/models/gatherTypes/gatherTypes";
import { setGatherDataToCardCol } from "../home/HomeGatherCol";
import GatherSkeletonMain from "./GatherSkeletonMain";

type SortedType = "최신 개설 순" | "일정 빠른 순" | "기본순";

export default function GatherMain() {
  const [gathers, setGathers] = useState<IGather[]>([]);
  const [cursor, setCursor] = useState(0);
  const loader = useRef<HTMLDivElement | null>(null);
  const firstLoad = useRef(true);

  const [sortBy, setSortBy] = useState<SortedType>("기본순");

  const [checkType, setCheckType] = useState<GatherFilterType>(null);

  const sortKey = sortBy === "기본순" ? "basic" : sortBy === "최신 개설 순" ? "createdAt" : "date";

  const { data: gathers2 } = useGatherQuery(-1);
  console.log(gathers2);

  const gatherData: IGather[] = [
    gathers2?.[5],
    gathers2?.[1],
    gathers2?.[7],
    gathers2?.[12],
    gathers2?.[14],
  ];

  const { data: gatherData3, isLoading } = useGatherQuery(cursor, checkType, sortKey);

  // 필터 / 정렬 변경 시 리스트 & 커서 초기화
  useEffect(() => {
    setGathers([]);
    setCursor(0);
  }, [checkType, sortBy]);

  // 페이지네이션 데이터 합치기
  useEffect(() => {
    if (!gatherData || !gatherData?.length) return;

    firstLoad.current = false;

    setGathers((prev) => {
      if (cursor === 0) return gatherData;
      return [...prev, ...gatherData];
    });
  }, [gathers2, cursor]);

  // gathers → 카드 데이터로 변환 (파생 데이터이므로 useMemo)
  const cardDataArr: GatherThumbnailCardProps[] = useMemo(
    () => setGatherDataToCardCol(gathers, true),
    [gathers],
  );

  // 무한 스크롤 옵저버
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !firstLoad.current && !isLoading) {
          setCursor((prev) => prev + 1);
        }
      },
      { threshold: 1.0 },
    );

    if (loader.current) observer.observe(loader.current);

    return () => {
      if (loader.current) observer.unobserve(loader.current);
      observer.disconnect();
    };
  }, [isLoading]);

  return (
    <Box mb="50px">
      {/* <Flex py={1} mb={2} justify="space-between" align="center">
        <Flex>
          <Box mr={4}>
            <CheckBox
              text="모집중만 보기"
              isChecked={checkType === "모집중"}
              onChange={(check: boolean) => {
                if (check) {
                  setCheckType("모집중");
                } else setCheckType(null);
              }}
            />
          </Box>
          <Box mr={4}>
            <CheckBox
              text="마감 임박"
              isChecked={checkType === "마감 임박"}
              onChange={(check: boolean) => {
                if (check) {
                  setCheckType("마감 임박");
                } else setCheckType(null);
              }}
            />
          </Box>
          <CheckBox
            text="인기 모임"
            isChecked={checkType === "인기 모임"}
            onChange={(check: boolean) => {
              if (check) {
                setCheckType("인기 모임");
              } else setCheckType(null);
            }}
          />
        </Flex>

        <Select
          size="sm"
          isThick
          defaultValue={sortBy}
          options={["기본순", "최신 개설 순", "일정 빠른 순"] as SortedType[]}
          setValue={setSortBy}
        />
      </Flex> */}

      <Box position="relative">
        <Box minH="1000px">
          {cardDataArr?.length ? (
            <>
              {cardDataArr.map((cardData, idx) => (
                <Box mb="12px" key={idx}>
                  <GatherThumbnailCard {...cardData} />
                </Box>
              ))}
            </>
          ) : (
            <>
              {[1, 2, 3, 4, 5].map((_, idx) => (
                <Box mb="12px" key={idx}>
                  <GatherSkeletonMain />
                </Box>
              ))}
            </>
          )}
        </Box>

        <div ref={loader} />

        {isLoading && cardDataArr?.length ? (
          <Box position="relative" mt={5}>
            <MainLoadingAbsolute size="sm" />
          </Box>
        ) : undefined}
      </Box>
    </Box>
  );
}

type Props = {
  text: string;
  isChecked: boolean;
  onChange: (checked: boolean) => void;
};

export function CheckBox({ text, isChecked, onChange }: Props) {
  const { getInputProps, getCheckboxProps, getRootProps, state } = useCheckbox({
    isChecked,
    onChange: (e) => onChange(e.target.checked),
  });

  return (
    <Box as="label" {...getRootProps()} cursor="pointer" userSelect="none">
      <input {...getInputProps()} />
      <Flex
        {...getCheckboxProps()}
        align="center"
        gap="8px"
        _hover={{ bg: "gray.50" }}
        _active={{ transform: "translateY(0.5px)" }}
      >
        <Flex
          w="16px"
          h="16px"
          borderRadius="3px"
          align="center"
          justify="center"
          border="1px solid"
          borderColor={state.isChecked ? "var(--color-mint)" : "gray.300"}
          bg={state.isChecked ? "var(--color-mint)" : "transparent"}
        >
          {state.isChecked && <CheckIcon />}
        </Flex>
        <Text fontSize="11px" color="gray.800">
          {text}
        </Text>
      </Flex>
    </Box>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="white"
    >
      <path d="m382-373.22 328.83-328.82Q726.78-718 748.43-718q21.66 0 37.61 15.96Q802-686.09 802-664.22t-15.96 37.83L419.61-259.52q-15.96 15.96-37.61 15.96t-37.61-15.96L173.52-430.39q-15.96-15.96-15.74-37.83.22-21.87 16.18-37.82Q189.91-522 211.78-522t37.83 15.96L382-373.22Z" />
    </svg>
  );
}
