import { Box } from "@chakra-ui/react";

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
  return (
    <>
      <LocationSearch
        info={placeInfo}
        setInfo={setPlaceInfo}
        isSmall={isSmall}
        placeHolder={placeHolder}
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
    </>
  );
}

export default SearchLocation;
