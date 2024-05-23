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
}

function LocationSearch({ info, setInfo }: ISearchLocation) {
  const [value, setValue] = useState(info?.place_name || "");
  const [results, setResults] = useState<KakaoLocationProps[]>([]);

  const { data } = useKakaoSearchQuery(value, { enabled: !location || info?.place_name !== value });

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
          placeholder="장소를 입력해 주세요."
          onChange={onChange}
          value={value}
          icon={<i className="fa-solid fa-location-dot" />}
        />
      </Wrapper>

      <SearchContent isContent={results.length !== 0}>
        {results.length > 0 && (
          <>
            {results.map((result, idx) => {
              console.log(result);
              return (
                <Item key={idx} onClick={() => onClickItem(result)}>
                  <Box>{result.place_name}</Box>
                  <Box color="var(--gray-600)" fontSize="12px">
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
  border-bottom: var(--border);
  display: flex;
  align-items: center;
`;

const SearchContent = styled.div<{ isContent: boolean }>`
  display: ${(props) => (props.isContent ? "block" : "none")};
  margin-top: var(--gap-3);
  height: ${(props) => props.isContent && "240px"};
  padding: 12px 16px;
  overflow: auto;
  border: ${(props) => (props.isContent ? "1px solid var(--gray-400)" : null)};
  border-radius: var(--rounded-lg);
  background-color: white;
`;

const Item = styled.div`
  padding: var(--gap-1) 0;
  margin-bottom: 4px;
`;

export default LocationSearch;
