import { Box } from "@chakra-ui/react";
import { KakaoLocationProps } from "../../types/externals/kakaoLocationSearch";
import { DispatchType } from "../../types/hooks/reactTypes";
import { Input } from "../atoms/Input";
import LocationSearch from "./location/LocationSearch";

interface SearchLocationProps {
  placeInfo: KakaoLocationProps;
  setPlaceInfo: DispatchType<KakaoLocationProps>;
}

function SearchLocation({ placeInfo, setPlaceInfo }: SearchLocationProps) {
  return (
    <>
      <LocationSearch info={placeInfo} setInfo={setPlaceInfo} />
      <Box mt="20px">
        <Input
          placeholder="상세 주소"
          value={placeInfo.road_address_name}
          onChange={(e) => setPlaceInfo((old) => ({ ...old, road_address_name: e.target.value }))}
          size="sm"
        />
      </Box>
    </>
  );
}

export default SearchLocation;
