import { Badge } from "@chakra-ui/react";
import styled from "styled-components";
import { BADGE_COLOR, BADGE_INFO } from "../../../constants/settingValue/badge";

function BadgeInfoModalFirstInfo() {
  return (
    <Layout>
      {BADGE_INFO.map(({ badge, minScore }, idx) => {
        return (
          <Item key={idx}>
            <div>
              <Badge fontSize={12} colorScheme={BADGE_COLOR[badge]}>
                {badge}
              </Badge>
            </div>
            <Info>
              {minScore}점 ~ {badge === "에스프레소" ? "" : minScore + 20}
              {badge !== "에스프레소" && "점"}
            </Info>
          </Item>
        );
      })}
    </Layout>
  );
}

const Layout = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const Item = styled.div`
  padding: 12px 16px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  height: 100%;
  align-items: center;
  border-bottom: var(--border);

  > div {
    flex: 1;
    text-align: center;
  }
`;

const Info = styled.div`
  font-size: 12px;
`;

export default BadgeInfoModalFirstInfo;
