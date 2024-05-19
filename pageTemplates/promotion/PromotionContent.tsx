import { Button } from "@chakra-ui/react";
import { faChevronDown } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";

import { CopyBtn } from "../../components/atoms/Icons/CopyIcon";
import { PROMOTION_TEXT } from "../../constants/contentsText/Private";

function PromotionContent() {
  const [isText, setIsText] = useState(true);

  return (
    <Layout>
      <Guide>
        <span>아래 글을 복사하여 홍보글을 게시해주세요!</span>
        <FontAwesomeIcon icon={faChevronDown} />
      </Guide>
      <Container>
        <Wrapper>
          <Nav>
            <Button
              colorScheme={isText ? "mintTheme" : "gray"}
              onClick={() => setIsText(true)}
              _focus={{ outline: "none" }}
            >
              본문 내용
            </Button>
            <Button
              colorScheme={!isText ? "mintTheme" : "gray"}
              onClick={() => setIsText(false)}
              _focus={{ outline: "none" }}
              w="88px"
            >
              이미지
            </Button>
          </Nav>
          {isText && <CopyBtn size="md" text={PROMOTION_TEXT} />}
        </Wrapper>
        <Content>
          {isText ? (
            <>
              <Title>카공 및 그룹 스터디 동아리 ABOUT</Title>
              <Pre>{PROMOTION_TEXT}</Pre>
            </>
          ) : (
            <ImageWrapper>
              <Image
                src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/%EB%A1%9C%EA%B3%A0.webp"
                alt="promotionImage"
                width={220}
                height={220}
              />
              <div>
                <span>사진을 꾹 눌러서 저장 !</span>
                <span>(이미지는 선택이에요! 굳이 안올리셔도 됩니다.)</span>
              </div>
            </ImageWrapper>
          )}
        </Content>
      </Container>
    </Layout>
  );
}

const Guide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--gap-5);
  > span:first-child {
    font-weight: 600;
    margin-bottom: var(--gap-2);
  }
`;

const Container = styled.div`
  padding-top: var(--gap-5);
  background-color: var(--gray-200);
  padding: var(--gap-5) var(--gap-4);
`;

const Layout = styled.div`
  margin-top: var(--gap-5);
`;

const Wrapper = styled.div`
  display: flex;
  align-items: flex-end;
  margin-left: auto;
  > button {
    margin-left: auto;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  > div:last-child {
    margin-top: var(--gap-3);
    font-size: 12px;
    font-weight: 600;
    color: var(--gray-900);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const Nav = styled.nav`
  border: 1px solid var(--gray-400);
  border-radius: var(--rounded-lg);
`;

const Content = styled.div`
  margin-top: var(--gap-4);
  display: flex;
  flex-direction: column;
`;

const Pre = styled.pre`
  white-space: pre-wrap;
  font-size: 12px;
  font-family: apple;
`;

const Title = styled.div`
  font-weight: 700;

  margin-bottom: var(--gap-3);
`;

export default PromotionContent;
