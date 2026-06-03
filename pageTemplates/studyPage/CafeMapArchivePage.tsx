import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import Header from "../../components/layouts/Header";
import { useStudyPlacesQuery } from "../../hooks/study/queries";
import { useOverlayRouter } from "../../hooks/useOverlayRouter";
import { StudyPlaceProps } from "../../types/models/studyTypes/study-entity.types";
import { getSafeAreaBottom } from "../../utils/validationUtils";
import { RightReviewDrawer } from "../study/StudyReview";
import { CafeListDrawer } from "./CafeListDrawer";
import { ARCHIVE_OPTIONS } from "./studyPageMap/TopNav";
import { StudyReviewDrawer } from "./StudyReviewDrawer";

export default function CafeMapArchivePage() {
  const router = useRouter();
  const { updateQuery } = useOverlayRouter();
  const modalParam = router.query.modal;

  const [selectedNickname, setSelectedNickname] = useState<string | null>(null);
  const [reviewPlace, setReviewPlace] = useState<StudyPlaceProps | null>(null);

  const { data: placeData } = useStudyPlacesQuery("all");

  const selectedOption = ARCHIVE_OPTIONS.find((o) => o.nickname === selectedNickname);
  const filteredPlaces = placeData?.filter((p) => p.pick === selectedNickname) ?? [];

  return (
    <>
      {/* 페이지 본문 — pos="fixed" + zIndex가 stacking context를 만들므로
          drawer들은 반드시 이 Flex 밖(형제 노드)에 렌더링해야
          CafeBottomNav(z:600) 위에 올라올 수 있다 */}
      <Flex
        flexDir="column"
        pos="fixed"
        top={0}
        left={0}
        right={0}
        bottom={getSafeAreaBottom(52)}
        zIndex={500}
        bg="white"
        maxW="var(--max-width)"
        mx="auto"
      >
        <Header title="아카이브" isBack={false} isSlide={false} />

        <Box flex={1} overflowY="auto" borderTop="var(--border-main)">
          <Flex flexDir="column">
            {ARCHIVE_OPTIONS.map((option) => {
              const count = placeData?.filter((p) => p.pick === option.nickname).length ?? 0;
              return (
                <Flex
                  key={option.nickname}
                  as="button"
                  px={4}
                  py={4}
                  align="center"
                  justify="space-between"
                  borderBottom="var(--border-main)"
                  textAlign="left"
                  w="full"
                  _hover={{ bg: "gray.50" }}
                  _active={{ opacity: 0.7 }}
                  onClick={() => setSelectedNickname(option.nickname)}
                >
                  <Box>
                    <Box fontWeight={700} fontSize="15px" color="gray.900">
                      {option.title}
                    </Box>
                    <Box fontSize="12px" color="gray.500" mt="4px">
                      {option.subtitle}
                    </Box>
                    <Box fontSize="11px" color="var(--color-mint)" fontWeight={600} mt="6px">
                      카페 {count}곳
                    </Box>
                  </Box>
                  <ShortArrowIcon dir="right" color="gray" />
                </Flex>
              );
            })}
          </Flex>
        </Box>
      </Flex>

      {/* drawer들은 fixed 컨테이너 밖 → 루트 stacking context에서 z-index 적용 */}
      {selectedNickname && (
        <CafeListDrawer
          type="about"
          onClose={() => setSelectedNickname(null)}
          pickReviewPlace={(place) => {
            setReviewPlace(place);
            updateQuery({ modal: "reviewPlace" });
          }}
          placeData={filteredPlaces}
          pickNickname={selectedNickname}
          pickTitle={selectedOption?.title}
          pickSubtitle={selectedOption?.subtitle}
          pickInstagram={selectedOption?.instagram}
        />
      )}

      {reviewPlace && (
        <StudyReviewDrawer
          placeInfo={reviewPlace}
          onClose={() => {
            router.back();
            setReviewPlace(null);
          }}
          zIndex={3000}
          handleClick={() => updateQuery({ modal: "addReview" })}
        />
      )}
      {modalParam === "addReview" && reviewPlace && (
        <RightReviewDrawer placeId={reviewPlace._id} onClose={() => router.back()} zIndex={4000} />
      )}
    </>
  );
}
