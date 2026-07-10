import { Badge, Box, Button, Grid, Heading, Stack, Text } from "@chakra-ui/react";
import { useMemo } from "react";

import { ActivityCard } from "../../../components/overlay/HomeActivityDrawer";
import { HOME_ACTIVITY_ITEMS } from "../../../constants/contents/groupInfo";
import { useOpenHomeActivityDrawer } from "../../../hooks/custom/useHomeActivityDrawer";

const TOP_ACTIVITY_ITEM_CNT = 9;

function RegisterGroup() {
  const openHomeActivityDrawer = useOpenHomeActivityDrawer();

  const topActivityItems = useMemo(
    () =>
      [...HOME_ACTIVITY_ITEMS]
        .sort((a, b) => (b.activeMemberCnt ?? 0) - (a.activeMemberCnt ?? 0))
        .filter((f) => f.id !== "17" && f.id !== "275")
        .slice(0, TOP_ACTIVITY_ITEM_CNT),
    [],
  );

  return (
    <Box mt={10}>
      <Stack spacing={2} mb={5} textAlign="center" alignItems="center">
        <Badge px={3} py={1} borderRadius="md" bg="mint" color="white">
          03
        </Badge>

        <Heading fontSize="2xl">소모임 소개</Heading>
        <Text color="gray.500">50여 개의 소모임 중 내 취향대로 선택해 활동해요!</Text>
      </Stack>

      <Grid mx={5} templateColumns="repeat(3, 1fr)" gap={2}>
        {topActivityItems.map((item) => (
          <ActivityCard key={item.id} item={item} isNavigationDisabled />
        ))}
      </Grid>
      <Button
        mt={5}
        onClick={() => openHomeActivityDrawer("activity")}
        w="100%"
        h="40px"
        bgColor="white"
        border="0.5px solid #E8E8E8"
      >
        소모임 전체 보기
      </Button>
    </Box>
  );
}

export default RegisterGroup;
