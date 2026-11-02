import { Box, Button, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";

import { GatherThumbnailCard } from "@/features/gather/components/GatherThumbnailCard";
import { useGatherChildrenQuery } from "@/features/gather/hooks/queries";
import { setGatherDataToCardCol } from "@/features/home/screens/HomeGatherCol";

interface RegularGatherConfirmedListProps {
  gatherId: number;
}

const PAST_SHOW_DEFAULT = 3;

/** 상시 행사 상세: 이 행사에서 확정돼 따로 만든 모임 목록. 다가오는 모임은 모두, 지난 모임은 접어서 보여 준다. */
function RegularGatherConfirmedList({ gatherId }: RegularGatherConfirmedListProps) {
  const [isPastOpen, setIsPastOpen] = useState(false);
  const { data: children } = useGatherChildrenQuery(gatherId, { enabled: !!gatherId });

  const today = dayjs().startOf("day");
  const upcoming = (children ?? [])
    .filter((gather) => !dayjs(gather.date).isBefore(today))
    .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
  const past = (children ?? []).filter((gather) => dayjs(gather.date).isBefore(today));
  const shownPast = isPastOpen ? past : past.slice(0, PAST_SHOW_DEFAULT);

  return (
    <Box px={5} mt={6}>
      <Text mb={3} fontSize="16px" fontWeight="semibold">
        확정된 모임
      </Text>
      {!children?.length ? (
        <Text fontSize="13px" color="gray.500">
          아직 확정된 모임이 없어요. 결과가 발표되면 여기에 모임이 생겨요.
        </Text>
      ) : (
        <>
          {setGatherDataToCardCol([...upcoming, ...shownPast], false).map((cardProps) => (
            <GatherThumbnailCard key={cardProps.id} {...cardProps} />
          ))}
          {past.length > PAST_SHOW_DEFAULT && (
            <Button
              size="sm"
              variant="ghost"
              w="full"
              color="gray.500"
              onClick={() => setIsPastOpen((prev) => !prev)}
            >
              {isPastOpen
                ? "지난 모임 접기"
                : `지난 모임 ${past.length - PAST_SHOW_DEFAULT}개 더 보기`}
            </Button>
          )}
        </>
      )}
    </Box>
  );
}

export default RegularGatherConfirmedList;
