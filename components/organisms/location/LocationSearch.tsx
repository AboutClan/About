import { Box, Portal } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { InputGroup } from "@/components/atoms/Input";
import { NaverLocationProps, useNaverLocalQuery } from "@/hooks/external/queries";
import { LocationProps } from "@/types/common";
import { DispatchBoolean, DispatchType } from "@/types/hooks/reactTypes";

interface ISearchLocation {
  info: LocationProps;
  setInfo: DispatchType<LocationProps>;
  isSmall?: boolean;
  hasInitialValue?: boolean;
  isActive?: boolean;
  placeHolder?: string;
  setIsFocus?: DispatchBoolean;
  size?: "sm" | "md";
  rightElement?: React.ReactNode;
  onSelect?: (result: NaverLocationProps) => void;
}

export const mapxyToLatLng = (mapx: string | number, mapy: string | number) => {
  const lng = Number(mapx) / 1e7;
  const lat = Number(mapy) / 1e7;
  return { latitude: Number(lat.toFixed(6)), longitude: Number(lng.toFixed(6)) };
};

function LocationSearch({
  info,
  setInfo,
  isSmall = false,
  hasInitialValue,
  isActive = true,
  placeHolder,
  setIsFocus,
  size = "md",
  rightElement,
  onSelect,
}: ISearchLocation) {
  const defaultName = info?.name;

  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultName || "");
  const [results, setResults] = useState<NaverLocationProps[]>([]);
  const layoutRef = useRef<HTMLDivElement>(null);
  const [dropdownRect, setDropdownRect] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const isOpen = results.length !== 0;

  useEffect(() => {
    if (!isOpen) return;

    const updateRect = () => {
      const el = layoutRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setDropdownRect({ top: rect.bottom, left: rect.left, width: rect.width });
    };

    // capture 단계 scroll 은 페이지의 모든 스크롤러에서 발화한다(카페 리스트 시트 포함).
    // 매 발화마다 getBoundingClientRect + setState 를 하면 강제 레이아웃이 반복되므로
    // 프레임당 한 번으로 묶는다.
    let rafId: number | null = null;
    const scheduleUpdate = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateRect();
      });
    };

    updateRect();
    window.addEventListener("scroll", scheduleUpdate, true);
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", scheduleUpdate, true);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [isOpen]);

  // 입력할 때마다 요청이 나가면 "강남역 카페" 한 번에 8개 요청 + 캐시 엔트리 8개가 쌓인다.
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), 250);
    return () => clearTimeout(timer);
  }, [value]);

  const { data } = useNaverLocalQuery(debouncedValue, {
    enabled: isActive && (debouncedValue !== "" || !hasInitialValue),
  });

  useEffect(() => {
    if (info) setValue(defaultName);
  }, [info]);

  useEffect(() => {
    if (!data) return;
    if (value === defaultName) {
      setResults([]);
    } else setResults(data);
  }, [data]);

  const onClickItem = (searchInfo: NaverLocationProps) => {
    const placeName = searchInfo.title;
    setValue(placeName);
    const { latitude, longitude } = mapxyToLatLng(searchInfo.mapx, searchInfo.mapy);
    setInfo({
      name: placeName,
      address: searchInfo.address,
      latitude,
      longitude,
      category: searchInfo?.category,
    });
    setResults([]);
    setIsFocus?.(false);
    inputRef.current?.blur();
    onSelect?.({ ...searchInfo, latitude, longitude });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue(value);
  };

  return (
    <Layout ref={layoutRef}>
      <Wrapper>
        <InputGroup
          ref={inputRef}
          placeholder={placeHolder || "장소를 검색해 보세요"}
          onChange={onChange}
          value={value}
          isDisabled={!isActive}
          onFocus={() => setIsFocus && setIsFocus(true)}
          onBlur={() => setIsFocus && setIsFocus(false)}
          h={size === "sm" ? "40px" : "52px"}
          rightElement={rightElement}
          borderRadius="8px"
        />
      </Wrapper>

      {isOpen && dropdownRect && (
        <Portal>
          <SearchContent
            isSmall={isSmall}
            onMouseDown={(e) => e.preventDefault()}
            style={{
              position: "fixed",
              top: dropdownRect.top + 8,
              left: dropdownRect.left,
              width: dropdownRect.width,
            }}
          >
            {results.map((result, idx) => (
              <Item key={idx} onClick={() => onClickItem(result)}>
                <Box fontSize="13px">{result.title}</Box>

                <Box color="var(--gray-500)" fontSize="11px">
                  {result.address}
                </Box>
              </Item>
            ))}
          </SearchContent>
        </Portal>
      )}
    </Layout>
  );
}

const Layout = styled.div`
  width: inherit;
  background-color: inherit;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

const SearchContent = styled.div<{ isSmall: boolean }>`
  height: ${(props) => (props.isSmall ? "120px" : "240px")};
  padding: 12px 16px;
  overflow: auto;
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  z-index: 4000;
`;

const Item = styled.div`
  padding: var(--gap-1) 0;
  margin-bottom: 8px;
  cursor: pointer;
`;

export default LocationSearch;
