import { Badge } from "@chakra-ui/react";
import styled from "styled-components";

import {
  LOCATION_CONVERT,
  LOCATION_NOT_OPEN,
  LOCATION_RECRUITING,
} from "../../../constants/location";
import { Location } from "../../../types/services/locationTypes";

function LocationTitle({ location }: { location: Location }) {
  return (
    <Layout>
      {LOCATION_NOT_OPEN.includes(location) ? (
        <Badge variant="outline">준비중</Badge>
      ) : LOCATION_RECRUITING.includes(location) ? (
        <Badge colorScheme="yellow" variant="outline">
          모집중
        </Badge>
      ) : (
        <Badge colorScheme="teal" variant="outline">
          오픈
        </Badge>
      )}
      <Title>{LOCATION_CONVERT[location]}</Title>
    </Layout>
  );
}

const Layout = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
`;

const Title = styled.span`
  font-size: 16px;
  font-weight: 600;
`;

export default LocationTitle;
