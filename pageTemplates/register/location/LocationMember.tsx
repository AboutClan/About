import { faCaretUp, faUsers } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

import { LOCATION_MEMBER_CNT } from "../../../constants/location";
import { Location } from "../../../types/services/locationTypes";

function LocationMember({ location }: { location: Location }) {
  return (
    <Layout>
      <MemberCnt>
        <FontAwesomeIcon icon={faUsers} size="xs" />
        <span>{LOCATION_MEMBER_CNT[location].member}</span>
      </MemberCnt>
      <NewMember>
        <FontAwesomeIcon icon={faCaretUp} />
        <span>{LOCATION_MEMBER_CNT[location].new}</span>
      </NewMember>
    </Layout>
  );
}

const Layout = styled.div`
  color: var(--gray-2);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 80%;
`;

const MemberCnt = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 15px;
  > span:last-child {
    margin-left: 4px;
  }
`;
const NewMember = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 13px;
  color: green;
  > span:last-child {
    margin-left: 4px;
  }
`;

export default LocationMember;
