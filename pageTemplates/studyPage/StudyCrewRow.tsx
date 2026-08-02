import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { HOME_ACTIVITY_ITEMS } from "../../constants/contents/groupInfo";
import { useToast } from "../../hooks/custom/CustomToast";

const STUDY_CREW_KEYWORD = "카공 스터디 크루";

interface StudyCrewItem {
  text: string;
  url?: string;
}

function StudyCrewRow() {
  const router = useRouter();
  const toast = useToast();

  const crewItems: StudyCrewItem[] = useMemo(() => {
    const crews = HOME_ACTIVITY_ITEMS.filter((item) => item.title.includes(STUDY_CREW_KEYWORD)).map(
      (item) => {
        const bracketMatch = item.title.match(/^\[(.+?)\]/);
        return {
          text: bracketMatch ? bracketMatch[1] : item.title,
          url: `/group/${item.groupStudyId}`,
        };
      },
    );

    return [...crews, { text: "집중 스터디 크루" }];
  }, []);

  if (!crewItems.length) return null;

  return (
    <Box px={5}>
      <Box fontSize="13px" fontWeight="600" color="gray.800" mb={3}>
        지역별 스터디 크루
      </Box>
      <Flex
        gap={2}
        overflowX="auto"
        sx={{
          "::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {crewItems.map((item, idx) => (
          <Flex
            key={idx}
            as="button"
            type="button"
            flexShrink={0}
            align="center"
            px={3}
            h="32px"
            borderRadius="full"
            border="1px solid"
            borderColor="gray.300"
            bg="gray.50"
            fontSize="12px"
            fontWeight="semibold"
            color="gray.800"
            onClick={() => {
              if (!item.url) {
                toast("info", "준비중인 스터디크루예요. 곧 만나요!");
                return;
              }
              router.push(item.url);
            }}
          >
            {item.text}
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}

export default StudyCrewRow;
