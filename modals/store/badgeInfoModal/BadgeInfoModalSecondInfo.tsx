import { Badge } from "@chakra-ui/react";
import styled from "styled-components";

function BadgeInfoModalSecondInfo() {
  return (
    <Layout>
      <Item>
        <div>
          <Badge
            borderRadius="10px"
            fontSize="9px"
            variant="subtle"
            h="20px"
            px={2}
            py={1}
            fontWeight="semibold"
            colorScheme="badgePink"
          >
            딸기스무디
          </Badge>
        </div>
        <Info>23년도 이벤트 한정</Info>
      </Item>
      <Item>
        <div>
          <Badge
            borderRadius="10px"
            fontSize="9px"
            variant="subtle"
            h="20px"
            px={2}
            py={1}
            fontWeight="semibold"
            colorScheme="facebook"
          >
            라벤더
          </Badge>
        </div>
        <Info>23년도 이벤트 한정</Info>
      </Item>
      <Item>
        <div>
          <Badge
            borderRadius="10px"
            fontSize="9px"
            variant="subtle"
            h="20px"
            px={2}
            py={1}
            fontWeight="semibold"
            colorScheme="badgeMint"
          >
            민트초코
          </Badge>
        </div>
        <Info>알파벳 수집 보상</Info>
      </Item>
      <Item>
        <div>
          <Badge
            borderRadius="10px"
            fontSize="9px"
            variant="subtle"
            h="20px"
            px={2}
            py={1}
            fontWeight="semibold"
            colorScheme="yellow"
          >
            바닐라
          </Badge>
        </div>
        <Info>운영진 한정</Info>
      </Item>
      <Item>
        <div>
          <Badge
            borderRadius="10px"
            fontSize="9px"
            variant="subtle"
            h="20px"
            px={2}
            py={1}
            fontWeight="semibold"
            colorScheme="badgeBrown"
          >
            코코아
          </Badge>
        </div>
        <Info>출석체크 랜덤 보상</Info>
      </Item>
      <Item>
        <div>
          <Badge
            borderRadius="10px"
            fontSize="9px"
            variant="subtle"
            h="20px"
            px={2}
            py={1}
            fontWeight="semibold"
            colorScheme="badgeMojito"
          >
            모히또
          </Badge>
        </div>
        <Info>소모임장 or 서포터즈</Info>
      </Item>
      <Item>
        <div>
          <Badge
            borderRadius="10px"
            fontSize="9px"
            variant="subtle"
            h="20px"
            px={2}
            py={1}
            fontWeight="semibold"
            colorScheme="badgeOcean"
          >
            슈팅스타
          </Badge>
        </div>
        <Info>여름 한정 배지</Info>
      </Item>
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

export default BadgeInfoModalSecondInfo;
