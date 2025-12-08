import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Container, Heading, List, ListItem, Text } from "@chakra-ui/react";

import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ExternalLink from "../../../components/molecules/ExternalLink";

function Privacy() {
  return (
    <>
      <Header title="개인정보 처리방침" />
      <Slide>
        <Container mt={20}>
          <Text mb="10px">
            About 연합 동아리 및 커뮤니티 서비스(이하 &quot;About&quot;)는 이용자의 동의를 기반으로
            개인정보를 수집·이용·제공하며, 이용자의 개인정보 자기결정권을 존중합니다. About는
            대한민국의 개인정보보호 법령 및 관련 가이드라인을 준수합니다.
          </Text>
          <Text mb="10px">
            본 개인정보 처리방침은 About 웹/앱 서비스를 이용하는 회원에게 적용됩니다.
          </Text>
          <Text mb="10px">
            About의 개인정보 처리방침을 개정하는 경우, 서비스 내 공지사항 또는 공식 카카오 채널 등을
            통하여 사전에 공지합니다.
          </Text>
          <Text mb="10px">본 방침은 2025년 12월 1일부터 시행됩니다.</Text>

          <Heading as="h3" size="lg" mt="15px">
            1. 처리하는 개인정보 항목
          </Heading>

          <Heading as="h4" size="sm" mt="var(--gap-3)">
            1) 회원 가입 및 관리에 필요한 정보
          </Heading>
          <List as="ol" ml="1em" styleType="number">
            <ListItem>
              <Text>이름, 닉네임</Text>
              <Text fontSize="sm">사용 목적: 회원 식별, 모임 내 호칭 및 소통</Text>
            </ListItem>
            <ListItem>
              <Text>연령대, 재학(졸업) 학교 또는 소속, 거주 지역</Text>
              <Text fontSize="sm">사용 목적: 20대 대상 커뮤니티 운영, 모임 매칭 참고</Text>
            </ListItem>
            <ListItem>
              <Text>이메일 주소, 휴대전화 번호</Text>
              <Text fontSize="sm">사용 목적: 본인 확인, 중요한 안내 및 문의 응대</Text>
            </ListItem>
            <ListItem>
              <Text>소셜 로그인 계정 정보(예: 카카오, 구글 등에서 제공하는 고유 ID)</Text>
              <Text fontSize="sm">사용 목적: 로그인 및 계정 연동</Text>
            </ListItem>
            <ListItem>
              <Text>프로필 사진(선택)</Text>
              <Text fontSize="sm">사용 목적: 서비스 내 사용자 구분 및 프로필 표시</Text>
            </ListItem>
          </List>

          <Heading as="h4" size="sm" mt="10px">
            2) 서비스 이용 과정에서 생성·수집되는 정보
          </Heading>
          <List as="ol" ml="1em" styleType="number">
            <ListItem>
              <Text>모임 참여 이력(스터디, 번개, 소모임, 행사 등)</Text>
              <Text fontSize="sm">
                사용 목적: 출석 관리, 보증금·포인트 정산, 패널티 부과, 서비스 운영 통계
              </Text>
            </ListItem>
            <ListItem>
              <Text>후기/리뷰, 신고·거리두기 기록</Text>
              <Text fontSize="sm">
                사용 목적: 소셜링 온도 산정, 안전한 커뮤니티 운영, 분쟁 발생 시 사실 확인
              </Text>
            </ListItem>
            <ListItem>
              <Text>포인트·참여권(티켓) 적립 및 사용 내역</Text>
              <Text fontSize="sm">사용 목적: 리워드 제공, 이용 내역 확인, 이상 거래 탐지</Text>
            </ListItem>
            <ListItem>
              <Text>결제 및 정산 관련 정보(필요 시)</Text>
              <Text fontSize="sm">사용 목적: 유료 서비스 이용료 결제, 환불 및 정산 처리</Text>
            </ListItem>
          </List>

          <Text mt="10px">
            또한 서비스 이용 과정에서 아래와 같은 정보가 자동으로 생성·수집될 수 있습니다.
          </Text>
          <List as="ol" ml="1em" styleType="number">
            <ListItem fontSize="sm">서비스 이용 기록(방문 일시, 이용 메뉴 등)</ListItem>
            <ListItem fontSize="sm">접속 로그, 접속 IP 정보</ListItem>
            <ListItem fontSize="sm">쿠키(Cookie)</ListItem>
            <ListItem fontSize="sm">단말기 정보(기기 모델, OS 정보 등)</ListItem>
          </List>

          <Heading as="h3" size="lg" mt="15px">
            2. 개인정보 수집 방법
          </Heading>
          <Text mb="5px">About는 다음과 같은 방법으로 개인정보를 수집합니다.</Text>
          <List as="ol" ml="1em" styleType="number">
            <ListItem>회원 가입 및 서비스 이용 과정에서 이용자가 직접 입력하는 정보</ListItem>
            <ListItem>
              카카오, 구글 등 외부 플랫폼을 통한 소셜 로그인의 경우, 해당 서비스에서 이용자의 동의를
              거쳐 제공하는 정보
            </ListItem>
            <ListItem>
              서비스 이용 과정에서 자동으로 생성·수집되는 정보(접속 로그, 쿠키 등)
            </ListItem>
          </List>

          <Heading as="h3" size="lg" mt="15px">
            3. 개인정보 처리 목적
          </Heading>
          <Text mb="5px">
            About는 수집한 개인정보를 다음의 목적 이내에서만 이용하며, 목적이 변경될 경우에는 사전에
            별도 동의를 받거나 공지합니다.
          </Text>

          <Heading as="h4" size="sm" mt="10px">
            1) 회원 가입 및 관리
          </Heading>
          <Text>
            회원 가입 의사 확인, 본인 확인, 회원자격 유지·관리, 부정 이용 방지, 각종 고지·통지,
            문의·민원 처리, 분쟁 해결 및 기록 보존 등을 위하여 개인정보를 처리합니다.
          </Text>

          <Heading as="h4" size="sm" mt="10px">
            2) 서비스 제공 및 운영
          </Heading>
          <Text>
            스터디·번개·소모임 등 모임 개설 및 참여 기능 제공, 출석 및 보증금·포인트 정산, 소셜링
            온도 산정, 친구 초대 및 리워드 제공, 동아리 행사 운영 등 서비스 제공 전반을 위해
            개인정보를 처리합니다.
          </Text>

          <Heading as="h4" size="sm" mt="10px">
            3) 민원·문의 처리
          </Heading>
          <Text>
            이용자의 문의·불만·신고 사항을 확인하고, 사실 확인 및 처리 결과를 회신하기 위해
            개인정보를 처리합니다.
          </Text>

          <Heading as="h4" size="sm" mt="10px">
            4) 서비스 개선 및 마케팅·통계 활용
          </Heading>
          <Text>
            신규 서비스 개발, 서비스 품질 개선, 이용 통계 분석, 맞춤형 서비스 및 혜택 제공,
            이벤트·공지 안내(동의한 경우)에 활용하기 위해 개인정보를 처리합니다.
          </Text>

          <Heading as="h3" size="lg" mt="15px">
            4. 개인정보의 처리 및 보유 기간
          </Heading>
          <Text>
            About는 개인정보를 수집 시 동의받은 보유 기간 또는 관련 법령에서 정한 기간 동안에만
            보유·이용하며, 그 후에는 지체 없이 파기합니다.
          </Text>
          <List as="ol" ml="1em" styleType="number" mt="5px">
            <ListItem>
              <Text>회원 정보: 회원 탈퇴 시까지 보유합니다.</Text>
            </ListItem>
            <ListItem>
              <Text>단, 다음의 경우에는 해당 기간 종료 시까지 보관 후 파기합니다.</Text>
              <List as="ul" ml="1em" styleType="circle">
                <ListItem>
                  관련 법령에 따른 보존(예: 전자상거래 등에서의 소비자 보호에 관한 법률 등)
                </ListItem>
                <ListItem>분쟁 해결, 민원 처리 등을 위해 필요한 경우</ListItem>
              </List>
            </ListItem>
          </List>

          <Heading as="h3" size="lg" mt="15px">
            5. 개인정보 처리의 위탁
          </Heading>
          <Text>
            About는 개인정보 처리 업무를 원칙적으로 외부에 위탁하지 않습니다. 다만, 서비스 향상 등을
            위해 부득이하게 위탁이 필요한 경우에는 관련 법령에 따라 수탁사, 위탁 업무 내용 및 기간을
            사전에 공지하고, 위탁 계약 등을 통해 개인정보 보호 의무를 규정합니다.
          </Text>

          <Heading as="h3" size="lg" mt="15px">
            6. 개인정보의 제3자 제공
          </Heading>
          <Text mb="5px">
            About는 원칙적으로 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만,
            다음의 경우에는 예외로 할 수 있습니다.
          </Text>
          <List as="ol" styleType="number" ml="1em">
            <ListItem>이용자가 사전에 제3자 제공에 명시적으로 동의한 경우</ListItem>
            <ListItem>법령에 근거가 있거나, 법원의 판결·명령 등 법적 절차에 따른 경우</ListItem>
          </List>

          <Heading as="h3" size="lg" mt="15px">
            7. 개인정보 보호를 위한 안전성 확보 조치
          </Heading>
          <Text mb="5px">
            About는 이용자의 개인정보를 안전하게 처리하기 위해 다음과 같은 보호 조치를 하고
            있습니다.
          </Text>

          <Heading as="h4" size="sm" mt="10px">
            1) 인증·로그인 보안
          </Heading>
          <Text>
            About는 카카오, 구글 등에서 제공하는{" "}
            <ExternalLink href="https://datatracker.ietf.org/doc/html/rfc6749">
              OAuth2.0
              <ExternalLinkIcon mx="2px" />
            </ExternalLink>{" "}
            기반 로그인 방식을 사용하며, 이를 통해 비밀번호를 직접 수집하지 않습니다. 동의한 범위
            내에서만 최소한의 회원 정보를 제공받습니다.
          </Text>

          <Heading as="h4" size="sm" mt="10px">
            2) 접근 권한 및 인원 최소화
          </Heading>
          <Text>
            개인정보에 접근할 수 있는 인원을 최소화하고, 개인정보 취급자에 대한 정기적인 교육과 보안
            의무를 부여하고 있습니다.
          </Text>

          <Heading as="h4" size="sm" mt="10px">
            3) 기술적·물리적 보호 조치
          </Heading>
          <Text>
            개인정보가 저장된 시스템에 대한 접근 통제, 암호화, 보안 프로그램 설치 및 주기적인 점검
            등 기술적·물리적 보호 조치를 통해 개인정보 유출 방지를 위해 노력합니다.
          </Text>

          <Heading as="h3" size="lg" mt="15px">
            8. 개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항
          </Heading>
          <Text>
            About는 맞춤형 서비스 제공을 위해 이용자의 정보를 수시로 저장·불러오는
            &apos;쿠키(cookie)&apos;를 사용할 수 있습니다.
          </Text>
          <Text mt="5px">
            쿠키는 웹사이트를 운영하는 서버가 이용자의 브라우저에 보내는 소량의 정보로서, 이용자의
            단말기(PC, 모바일 등)에 저장될 수 있습니다.
          </Text>

          <Heading as="h4" size="sm" mt="10px">
            1) 쿠키의 사용 목적
          </Heading>
          <Text>
            이용자의 서비스 방문 및 이용 형태, 접속 기록 등을 분석하여 더 편리하고 최적화된 서비스를
            제공하기 위한 통계·분석 목적으로 활용합니다.
          </Text>

          <Heading as="h4" size="sm" mt="10px">
            2) 쿠키 설정 거부 방법
          </Heading>
          <Text>
            이용자는 웹 브라우저 상단의 도구 &gt; 인터넷 옵션 &gt; 개인정보 메뉴에서 쿠키 허용
            여부를 설정하거나 저장을 거부할 수 있습니다. 쿠키 저장을 거부할 경우 일부 맞춤형 서비스
            이용이 제한되거나 <strong>자동 로그인 기능을 사용할 수 없습니다.</strong>
          </Text>

          <Heading as="h3" size="lg" mt="15px">
            9. 개인정보 보호책임자 및 문의처
          </Heading>
          <Text mb="5px">
            서비스 이용 중 개인정보 보호와 관련한 문의, 불만, 조언 및 기타 건의사항이 있을 경우,
            아래 개인정보 보호책임자에게 언제든지 연락해 주시기 바랍니다. About는 신속하고 성실하게
            답변드리겠습니다.
          </Text>
          <Heading as="h4" size="sm" mt="10px">
            개인정보 보호책임자
          </Heading>
          <List styleType="circle" ml="1em">
            <ListItem>
              <Text>성명: 이승주</Text>
              <Text>
                이메일: <a href="mailto:team.about.20s@gmail.com">team.about.20s@gmail.com</a>
              </Text>
            </ListItem>
          </List>

          <Heading as="h4" size="sm" mt="15px">
            기타 개인정보 침해에 대한 신고나 상담이 필요한 경우 아래 기관에 문의하실 수 있습니다.
          </Heading>
          <List styleType="circle" ml="1em">
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
