import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { NaverLocationProps, useNaverLocalQuery } from "../../../hooks/external/queries";
import { LocationProps } from "../../../types/common";
import { DispatchBoolean, DispatchType } from "../../../types/hooks/reactTypes";
import { InputGroup } from "../../atoms/Input";

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

  const [value, setValue] = useState(defaultName || "");
  const [results, setResults] = useState<NaverLocationProps[]>([]);

  const { data } = useNaverLocalQuery(value, {
    enabled: isActive && (value !== "" || !hasInitialValue),
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
    setIsFocus?.(true);
    onSelect?.({ ...searchInfo, latitude, longitude });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue(value);
  };

  return (
    <Layout>
      <Wrapper>
        <InputGroup
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

      <SearchContent isContent={results.length !== 0} isSmall={isSmall} onMouseDown={(e) => e.preventDefault()}>
        {results.length > 0 && (
          <>
            {results.map((result, idx) => (
              <Item key={idx} onClick={() => onClickItem(result)}>
                <Box fontSize="13px">{result.title}</Box>

                <Box color="var(--gray-500)" fontSize="11px">
                  {result.address}
                </Box>
              </Item>
            ))}
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
  position: relative;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

const SearchContent = styled.div<{ isContent: boolean; isSmall: boolean }>`
  display: ${(props) => (props.isContent ? "block" : "none")};
  position: absolute;
  top: calc(100% + var(--gap-2));
  left: 0;
  right: 0;
  height: ${(props) => props.isContent && (props.isSmall ? "120px" : "240px")};
  padding: 12px 16px;
  overflow: auto;
  border: ${(props) => (props.isContent ? "1px solid var(--gray-200)" : null)};
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  z-index: 150;
`;

const Item = styled.div`
  padding: var(--gap-1) 0;
  margin-bottom: 8px;
  cursor: pointer;
`;

export default LocationSearch;
