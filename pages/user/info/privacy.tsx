import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Container, Heading, List, ListItem, Text } from "@chakra-ui/react";

import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ExternalLink from "../../../components/molecules/ExternalLink";

function Privacy() {
  return (
    <>
      <Header title="개인정보 취급방침" />
      <Slide>
        <Container mt={20}>
          <Text marginBottom="10px">
            Vote Helper 스터디 참여 투표 자동화 서비스(이하 Vote Helper)는 이용자의 동의를 기반으로
            개인정보를 수집·이용 및 제공하고 있으며, 이용자의 권리(개인정보 자기결정권)를 적극적으로
            보장하며, 대한민국의 개인정보보호 규정 및 가이드라인을 준수하고 있습니다.
          </Text>
          <Text marginBottom="10px">
            본 개인정보처리방침은 Vote Helper 서비스 사용자에게 적용됩니다.
          </Text>
          <Text marginBottom="10px">
            Vote Helper의 개인정보처리방침을 개정하는 경우 웹사이트 공지사항(또는 광교 카공스터디
            카카오톡오픈대화방 이하 오카방)을 통하여 공지할 것입니다.
          </Text>
          <Text marginBottom="10px">본 방침은 2022년 6월 11일부터 시행됩니다.</Text>

          <Heading as="h3" size="lg" marginTop="15px">
            1. 처리하는 개인정보 항목
          </Heading>
          <Heading as="h4" size="sm" mt="var(--gap-3)">
            회원정보
          </Heading>
          <List as="ol" marginLeft="1em" styleType="number">
            <ListItem>
              <Text>카카오톡 프로필 이름</Text>
              <Text fontSize="sm">사용목적: 서비스내 사용자의 구분</Text>
            </ListItem>
            <ListItem>
              <Text>카카오톡 프로필 사진</Text>
              <Text fontSize="sm">사용목적: 서비스내 사용자의 구분</Text>
            </ListItem>
          </List>
          <Text marginTop="10px">
            또한 서비스 이용과정에서 아래와 같은 정보들이 자동으로 생성되어 수집될 수 있습니다.
          </Text>
          <List as="ol" marginLeft="1em" styleType="number">
            <ListItem fontSize="sm">서비스 이용 기록</ListItem>
            <ListItem fontSize="sm">접속 로그</ListItem>
            <ListItem fontSize="sm">쿠키</ListItem>
            <ListItem fontSize="sm">접속 IP 정보</ListItem>
          </List>

          <Heading as="h3" size="lg" marginTop="15px">
            2. 개인정보 수집 방법
          </Heading>
          <Text>
            Vote Helper는 사용자의 개인정보를 (주)카카오로부터 사용자의 동의에 따라 제공받고
            있습니다.
          </Text>

          <Heading as="h3" size="lg" marginTop="15px">
            3. 개인정보 처리목적
          </Heading>
          <Text>
            Vote Helper는 사용자의 개인정보를 다음과 같은 목적으로만 사용하며, 목적이 변경될
            경우에는 웹사이트 공지사항(또는 오카방)을 통해 사전에 고지할 것입니다.
          </Text>

          <Heading as="h4" size="sm" marginTop="10px">
            홈페이지 회원가입 및 관리
          </Heading>
          <Text>
            회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스
            부정이용 방지, 각종 고지·통지, 분쟁 조정을 위한 기록 보존 등을 목적으로 개인정보를
            처리합니다.
          </Text>
          <Heading as="h4" size="sm" marginTop="10px">
            민원사무 처리
          </Heading>
          <Text>
            민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보 등을
            목적으로 개인정보를 처리합니다.
          </Text>
          <Heading as="h4" size="sm" marginTop="10px">
            재화 또는 서비스 제공
          </Heading>
          <Text>서비스 제공, 콘텐츠 제공 등을 목적으로 개인정보를 처리합니다.</Text>
          <Heading as="h4" size="sm" marginTop="10px">
            마케팅에의 활용
          </Heading>
          <Text>
            신규 서비스(제품) 개발 및 맞춤 서비스 제공, 인구통계학적 특성에 따른 서비스 제공,
            서비스의 유효성 확인, 접속빈도 파악 또는 회원의 서비스 이용에 대한 통계 등을 목적으로
            개인정보를 처리합니다.
          </Text>

          <Heading as="h3" size="lg" marginTop="15px">
            4. 개인정보의 처리 및 보유기간
          </Heading>
          <Text>
            Vote Helper는 사용자의 개인정보를 목적 달성을 위한 기간 동안에만 제한적으로 처리하며,
            목적이 달성되면 사용자의 개인정보는 관계 법령에 의한 경우가 아니고서는 지체 없이
            파기됩니다.
          </Text>

          <Heading as="h3" size="lg" marginTop="15px">
            5. 개인정보 처리의 위탁
          </Heading>
          <Text>Vote Helper는 개인정보 처리업무를 위탁하고 있지 않습니다. </Text>

          <Heading as="h3" size="lg" marginTop="15px">
            6. 개인정보의 제3자 제공
          </Heading>
          <Text>
            Vote Helper는 원칙적으로 법령에 따른 동의 없이는 사용자의 개인정보를 제3자에게 제공하지
            않으며, 다음의 경우는 예외로 하고 있습니다.
          </Text>
          <List as="ol" styleType="number" marginLeft="1em">
            <ListItem>사전에 이용자로부터 법령에 따른 동의를 받은 경우</ListItem>
            <ListItem>다른 법령의 규정에 의한 경우</ListItem>
          </List>

          <Heading as="h3" size="lg" marginTop="15px">
            7. 개인정보의 보호대책
          </Heading>
          <Text>
            Vote Helper는 사용자의 개인정보를 소중하게 여기고, 개인정보를 처리함에 있어서 다음
            조치를 하고 있습니다.
          </Text>
          <Heading as="h4" size="sm" marginTop="10px">
            카카오에서 제공하는{" "}
            <ExternalLink href="https://datatracker.ietf.org/doc/html/rfc6749">
              OAuth2.0
              <ExternalLinkIcon mx="2px" />
            </ExternalLink>{" "}
            서비스를 사용하고 있습니다.
          </Heading>
          <Text>
            Vote Helper는 사용자 인증을 카카오 OAuth2.0을 통해 처리하고 있으며, 따라서 카카오 서비스
            연결 동의 페이지에서 동의하신 개인정보(이름, 프로필 사진) 이외의 개인정보를 일절
            제공받지 않습니다.
          </Text>
          <Text>
            또한, 카카오 OAuth2.0 인증 과정에서 Vote Helper는 어떠한 개입도 할 수 없습니다.
          </Text>
          <Heading as="h4" size="sm" marginTop="10px">
            개인정보를 취급하는 사람을 최소화하고 있습니다.
          </Heading>
          <Text>
            Vote Helper는 사용자의 개인정보를 처리하는 직원을 최소화 하며, 개인정보보호 의무와
            보안에 대해 교육하고 있습니다.
          </Text>

          <Heading as="h3" size="lg" marginTop="15px">
            8. 개인정보 자동 수집 장치의 설치/운영 및 거부에 관한 사항
          </Heading>
          <Text>
            Vote Helper는 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는
            ‘쿠키(cookie)’를 사용합니다.
          </Text>
          <Text>
            쿠키는 웹사이트를 운영하는데 이용되는 서버(https)가 이용자의 컴퓨터 브라우저에게 보내는
            소량의 정보이며 이용자들의 PC 컴퓨터내의 하드디스크에 저장되기도 합니다.
          </Text>
          <Heading as="h4" size="sm" marginTop="10px">
            쿠키의 사용 목적
          </Heading>
          <Text>
            이용자에 의한 본 서비스의 방문 및 이용형태, 보안접속 여부, 등을 파악하여 이용자에게
            최적화된 정보 제공을 위해 사용됩니다.
          </Text>
          <Heading as="h4" size="sm" marginTop="10px">
            쿠키의 설치/운영 및 거부
          </Heading>
          <Text>
            웹브라우저 상단의 도구&gt;인터넷 옵션&gt;개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을
            거부 할 수 있습니다. 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수
            있으며 <strong>자동로그인 기능을 지원 받을 수 없습니다</strong>
          </Text>

          <Heading as="h3" size="lg" marginTop="15px">
            9. 개인정보 보호책임자
          </Heading>
          <Text>
            VoteHelper를 사용하는 과정에서 개인정보보호 관련 문의, 불만, 조언이나 기타 사항은
            개인정보 보호책임자로 연락해 주시기 바랍니다. Vote Helper는 신속하고 충분한 답변을
            드리도록 최선을 다하겠습니다.
          </Text>
          <Heading as="h4" size="sm" marginTop="10px">
            개인정보 보호책임자
          </Heading>
          <List styleType="circle" marginLeft="1em">
            <ListItem>
              <Text>성명 : 이승주</Text>
              <Text>
                이메일주소 : <a href="mailto:j44s11@naver.com">j44s11@naver.com</a>
              </Text>
            </ListItem>
          </List>

          <Heading as="h4" size="sm" marginTop="15px">
            기타 개인정보 침해에 대한 신고나 상담이 필요한 경우에 아래 기관에 문의 가능합니다.
          </Heading>
          <List styleType="circle" marginLeft="1em">
            <ListItem>
              <Text>개인정보침해신고센터</Text>
              <Text>
                (
                <ExternalLink href="https://privacy.kisa.or.kr">
                  privacy.kisa.or.kr
                  <ExternalLinkIcon mx="2px" />
                </ExternalLink>{" "}
                / 국번없이 118)
              </Text>
            </ListItem>
            <ListItem>
              <Text>대검찰청 사이버수사과</Text>
              <Text>
                (
                <ExternalLink href="https://www.spo.go.kr">
                  www.spo.go.kr
                  <ExternalLinkIcon mx="2px" />
                </ExternalLink>{" "}
                / 국번없이 1301)
              </Text>
            </ListItem>
            <ListItem>
              <Text>경찰청 사이버안전국</Text>
              <Text>
                (
                <ExternalLink href="https://police.go.kr">
                  police.go.kr
                  <ExternalLinkIcon mx="2px" />
                </ExternalLink>{" "}
                / 국번없이 182)
              </Text>
            </ListItem>
          </List>
        </Container>
      </Slide>
    </>
  );
}

export default Privacy;
