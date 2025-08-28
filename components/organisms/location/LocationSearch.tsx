import { Box } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { NaverLocationProps, useNaverLocalQuery } from "../../../hooks/external/queries";
import { DispatchType } from "../../../types/hooks/reactTypes";
import { InputGroup } from "../../atoms/Input";

interface ISearchLocation {
  info: NaverLocationProps;
  setInfo: DispatchType<NaverLocationProps>;
  isSmall?: boolean;
  hasInitialValue?: boolean;
  isActive?: boolean;
  placeHolder?: string;
}

export const mapxyToLatLng = (mapx: string | number, mapy: string | number) => {
  const lng = Number(mapx) / 1e7; // x → 경도
  const lat = Number(mapy) / 1e7; // y → 위도
  return { latitude: Number(lat.toFixed(6)), longitude: Number(lng.toFixed(6)) };
};

function LocationSearch({
  info,
  setInfo,
  isSmall = false,
  hasInitialValue,
  isActive = true,
  placeHolder,
}: ISearchLocation) {
  const [value, setValue] = useState(info.name || "");
  const [results, setResults] = useState<NaverLocationProps[]>([]);
  const layoutRef = useRef<HTMLDivElement>(null);
  const kbRef = useRef(0);

  const { data } = useNaverLocalQuery(value, {
    enabled: isActive && (value !== "" || !hasInitialValue),
  });

  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (info) setValue(info?.name);
  }, [info]);

  useEffect(() => {
    if (!data) return;
    if (value === info?.name) {
      setResults([]);
    } else setResults(data);
  }, [data]);

  const onClickItem = (searchInfo: NaverLocationProps) => {
    const placeName = searchInfo.title;
    setValue(placeName);
    const { latitude, longitude } = mapxyToLatLng(searchInfo.mapx, searchInfo.mapy);
    setInfo({ ...searchInfo, name: placeName, latitude, longitude });
    setResults([]);
  };

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      const kb = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop));
      layoutRef.current?.style.setProperty("--kb", `${kb}px`);

      // ✅ 증가분(Δ)만큼 아래로 스크롤
      const delta = Math.max(0, kb - kbRef.current);
      if (delta > 0 && isFocused && layoutRef.current) {
        layoutRef.current.scrollTop += delta;
      }
      kbRef.current = kb;
    };

    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    update(); // 초기 1회

    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [isFocused]);

  const onFocus = () => setIsFocused(true);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

  return (
    <Layout ref={layoutRef}>
      <Wrapper>
        <InputGroup
          as="textarea"
          onFocus={onFocus}
          placeholder={placeHolder || "장소를 검색해 보세요"}
          onChange={onChange}
          value={value}
          isDisabled={!isActive}
        />
      </Wrapper>

      <SearchContent isContent={results.length !== 0} isSmall={isSmall}>
        {results.length > 0 && (
          <>
            {results.map((result, idx) => {
              return (
                <Item key={idx} onClick={() => onClickItem(result)}>
                  <Box fontSize="13px">{result.title}</Box>
                  <Box color="var(--gray-500)" fontSize="11px">
                    {result.address}
                  </Box>
                </Item>
              );
            })}
          </>
        )}
      </SearchContent>
    </Layout>
  );
}
const Layout = styled.div`
  width: inherit;
  background-color: inherit;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  overflow: auto;
  /* ✅ 키보드 높이만큼 바닥 여백 확보 */
  padding-bottom: calc(var(--kb, 0px) + env(safe-area-inset-bottom));
  scroll-padding-bottom: calc(var(--kb, 0px) + env(safe-area-inset-bottom));
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
`;

const SearchContent = styled.div<{ isContent: boolean; isSmall: boolean }>`
  display: ${(props) => (props.isContent ? "block" : "none")};
  margin-top: var(--gap-3);
  height: ${(props) => props.isContent && (props.isSmall ? "120px" : "240px")};
  padding: 12px 16px;
  overflow: auto;
  border: ${(props) => (props.isContent ? "1px solid var(--gray-200)" : null)};
  border-radius: 12px;
  background-color: white;
`;

const Item = styled.div`
  padding: var(--gap-1) 0;
  margin-bottom: 8px;
`;

export default LocationSearch;
