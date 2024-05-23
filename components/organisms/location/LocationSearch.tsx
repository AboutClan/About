import { Button } from "@chakra-ui/react";
import axios from "axios";
import { KeyboardEvent, useState } from "react";
import styled from "styled-components";

import { DispatchType } from "../../../types/hooks/reactTypes";
import { IGatherLocation } from "../../../types/models/gatherTypes/gatherTypes";

interface ISearchLocation {
  location?: string;
  setLocation?: DispatchType<IGatherLocation>;
}

const API_URL = "https://dapi.kakao.com/v2/local/search/keyword.json";
const API_KEY = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;

function LocationSearch({ location, setLocation }: ISearchLocation) {
  const [value, setValue] = useState(location || "");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios
        .get(API_URL, {
          headers: { Authorization: `KakaoAK ${API_KEY}` },
          params: { query: value },
        })
        .then((res) => {
          console.log(res);
          return res;
        });

      setResults(response.data.documents);
    } catch (error) {
      console.error("주소 검색에 실패했습니다.", error);
    }
  };

  const onClickItem = (info: { place_name: string; address_name: string }) => {
    const placeName = info.place_name;
    setValue(placeName);
    setLocation({ main: placeName, sub: info.address_name });
    setResults([]);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue(value);
    setLocation((old) => ({ ...old, main: value }));
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const SearchColor = value === "" ? "blackAlpha" : "mintTheme";

  return (
    <Layout>
      <div>
        <Wrapper>
          <i className="fa-solid fa-location-dot" />
          <Input
            onKeyDown={handleKeyPress}
            type="search"
            placeholder="장소를 입력해 주세요."
            value={value}
            onChange={onChange}
          />
        </Wrapper>
        <SearchWrapper>
          <Button h="28px" size="sm" onClick={handleSearch} colorScheme={SearchColor}>
            검색
          </Button>
        </SearchWrapper>
      </div>
      <SearchContent isContent={results.length !== 0}>
        {results.length > 0 && (
          <>
            {results.map((result) => (
              <Item key={result.id} onClick={() => onClickItem(result)}>
                <span>{result.place_name}</span>
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
  > div:first-child {
    display: flex;
  }
`;
const Input = styled.input`
  height: 100%;
  width: 100%;
  margin-left: var(--gap-1);
  background-color: inherit;
  padding: var(--gap-2) 0;
  padding-left: var(--gap-1);
  ::placeholder {
    font-size: 13px;
  }
  :focus {
    outline: none;
  }
`;

const Wrapper = styled.div`
  height: 100%;
  border-bottom: var(--border);
  padding-left: var(--gap-1);
  display: flex;
  align-items: center;
  width: 85%;
  margin-right: var(--gap-2);
`;

const SearchContent = styled.div<{ isContent: boolean }>`
  margin-top: var(--gap-3);
  height: ${(props) => props.isContent && "220px"};
  padding-left: var(--gap-3);
  overflow: auto;
  border: ${(props) => (props.isContent ? "1px solid var(--gray-400)" : null)};
  border-radius: var(--rounded-lg);
  padding: var(--gap-1);
`;

const Item = styled.div`
  padding: var(--gap-1) 0;
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export default LocationSearch;
