import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { useKakaoSearchQuery } from "../../../hooks/external/queries";
import { KakaoLocationProps } from "../../../types/externals/kakaoLocationSearch";
import { DispatchType } from "../../../types/hooks/reactTypes";
import { InputGroup } from "../../atoms/Input";

interface ISearchLocation {
  info: KakaoLocationProps;
  setInfo: DispatchType<KakaoLocationProps>;
  isSmall?: boolean;
  hasInitialValue?: boolean;
  isActive?: boolean;
}

function LocationSearch({
  info,
  setInfo,
  isSmall = false,
  hasInitialValue,
  isActive = true,
}: ISearchLocation) {
  const [value, setValue] = useState(info?.place_name || "");
  const [results, setResults] = useState<KakaoLocationProps[]>([]);

  const { data } = useKakaoSearchQuery(value, {
    enabled: isActive && info?.place_name !== value && (value !== "" || !hasInitialValue),
  });

  useEffect(() => {
    if (info) setValue(info?.place_name);
  }, [info]);

  useEffect(() => {
    if (data) setResults(data);
  }, [data]);

  const onClickItem = (searchInfo: KakaoLocationProps) => {
    const placeName = searchInfo.place_name;
    setValue(placeName);
    setInfo(searchInfo);
    setResults([]);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue(value);
  };

  return (
    <Layout>
      <Wrapper>
        <InputGroup
          placeholder="스터디 장소를 검색해 보세요"
          onChange={onChange}
          value={value}
          icon={<i className="fa-solid fa-location-dot" />}
          isDisabled={!isActive}
        />
      </Wrapper>

      <SearchContent isContent={results.length !== 0} isSmall={isSmall}>
        {results.length > 0 && (
          <>
            {results.map((result, idx) => {
              return (
                <Item key={idx} onClick={() => onClickItem(result)}>
                  <Box fontSize="13px">{result.place_name}</Box>
                  <Box color="var(--gray-500)" fontSize="11px">
                    {result.road_address_name}
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
