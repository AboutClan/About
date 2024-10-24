import { Box } from "@chakra-ui/react";
import styled from "styled-components";

import OutlineBadge from "../../../components/atoms/badges/OutlineBadge";
import { LOCATION_MEMBER_CNT, LOCATION_RECRUITING } from "../../../constants/location";
import { ActiveLocation, InactiveLocation } from "../../../types/services/locationTypes";

function LocationTitle({ location }: { location: ActiveLocation | InactiveLocation }) {
  return (
    <Layout>
      {LOCATION_RECRUITING.includes(location as InactiveLocation) ? (
        <OutlineBadge text="모집중" size="sm" colorScheme="orange" />
      ) : (
        <OutlineBadge text="진행중" size="sm" colorScheme="mint" />
      )}
      <MemberCnt>
        <Box>
          {!LOCATION_RECRUITING.includes(location as InactiveLocation) ? (
            <i className="fa-regular fa-user fa-xs" />
          ) : (
            <i className="fa-regular fa-user-clock fa-xs" />
          )}
        </Box>
        <span>{LOCATION_MEMBER_CNT[location].member}</span>
      </MemberCnt>
    </Layout>
  );
}

const Layout = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const MemberCnt = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 15px;
  color: var(--gray-600);
  > span:last-child {
    margin-left: 4px;
  }
`;

export default LocationTitle;
