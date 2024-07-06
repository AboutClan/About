import styled from "styled-components";

import { LOCATION_CONVERT, LOCATION_MEMBER_CNT } from "../../../constants/location";
import { Location } from "../../../types/services/locationTypes";

function LocationMember({ location }: { location: Location }) {
  return (
    <Layout>
      <Title>{LOCATION_CONVERT[location]}</Title>
      <NewMember>
        <i className="fa-solid fa-caret-up" />
        <span>{LOCATION_MEMBER_CNT[location].new}</span>
      </NewMember>
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
const Title = styled.span`
  font-size: 15px;
  font-weight: 600;
`;

const NewMember = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 13px;
  color: var(--color-mint);
  > span:last-child {
    margin-left: 4px;
  }
`;

export default LocationMember;
