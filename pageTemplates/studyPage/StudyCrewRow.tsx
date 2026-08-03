import { Box, Collapse, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
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
  const [isCrewOpen, setIsCrewOpen] = useState(false);

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

  return (
    <Box mx={5} p={3} bg="gray.50" borderRadius="10px">
      <Flex gap={2}>
        <Flex
          as="button"
          type="button"
          flex={1}
          align="center"
          justify="center"
          gap={1}
          h="38px"
          borderRadius="8px"
          border="1px solid"
          borderColor={isCrewOpen ? "gray.800" : "gray.300"}
          bg="white"
          fontSize="12.5px"
          fontWeight="600"
          color="gray.800"
          onClick={() => setIsCrewOpen((old) => !old)}
        >
          지역별 스터디 크루
          <ShortArrowIcon dir={isCrewOpen ? "top" : "bottom"} color="gray" />
        </Flex>
        <Flex
          as="button"
          type="button"
          flex={1}
          align="center"
          justify="center"
          h="38px"
          borderRadius="8px"
          border="1px solid"
          borderColor="gray.300"
          bg="white"
          fontSize="12.5px"
          fontWeight="600"
          color="gray.800"
          onClick={() => router.push("/cafe-map")}
        >
          카공지도 바로가기
        </Flex>
      </Flex>

      {!!crewItems.length && (
        <Collapse in={isCrewOpen} animateOpacity unmountOnExit>
          <Flex
            mt={2}
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
                h="30px"
                borderRadius="full"
                border="1px solid"
                borderColor="gray.300"
                bg="white"
                fontSize="12px"
                fontWeight="semibold"
                color="gray.700"
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
        </Collapse>
      )}
    </Box>
  );
}

export default StudyCrewRow;
