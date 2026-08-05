import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

import { LocationProps } from "../../types/common";
import { DispatchType } from "../../types/hooks/reactTypes";
import { Input } from "../atoms/Input";
import LocationSearch from "./location/LocationSearch";

interface SearchLocationProps {
  placeInfo: LocationProps;
  setPlaceInfo: DispatchType<LocationProps>;
  isSmall?: boolean;
  placeHolder?: string;
  hasDetail?: boolean;
}

function SearchLocation({
  placeInfo,
  setPlaceInfo,
  isSmall,
  placeHolder,
  hasDetail = true,
}: SearchLocationProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const scrollToInput = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  useEffect(() => {
    return () => clearTimeout(retryTimeoutRef.current);
  }, []);

  return (
    <Box ref={containerRef}>
      <LocationSearch
        info={placeInfo}
        setInfo={setPlaceInfo}
        isSmall={isSmall}
        placeHolder={placeHolder}
        setIsFocus={(isFocus) => {
          if (!isFocus) return;

          clearTimeout(retryTimeoutRef.current);
          scrollToInput();

          // 모바일 키보드가 올라오며 뷰포트가 줄어든 뒤 다시 스크롤해 리스트가 가려지지 않도록 함
          const visualViewport = window.visualViewport;
          if (visualViewport) {
            const handleViewportResize = () => {
              scrollToInput();
              visualViewport.removeEventListener("resize", handleViewportResize);
            };
            visualViewport.addEventListener("resize", handleViewportResize);
          }
          retryTimeoutRef.current = setTimeout(scrollToInput, 300);
        }}
      />
      {hasDetail && placeInfo?.address && (
        <Box mt="20px">
          <Input
            color="var(--gray-500)"
            placeholder="상세 주소"
            value={placeInfo.address}
            onChange={(e) => setPlaceInfo((old) => ({ ...old, address: e.target.value }))}
            isLine
            size="sm"
            fontSize="11px"
            _placeholder={{ color: "var(--gray-500)" }}
          />
        </Box>
      )}
    </Box>
  );
}

export default SearchLocation;
