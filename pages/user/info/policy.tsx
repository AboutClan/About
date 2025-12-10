import { Container, Heading, List, ListItem, Text } from "@chakra-ui/react";

import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";

function Policy() {
  return (
    <>
      <Header title="About 이용약관" />
      <Slide>
        <Container maxW="container.md" py={4}>
          {/* 제1장 총칙 */}
          <Heading as="h2" fontSize="2xl" mt={4}>
            제1장 총칙
          </Heading>

          <Heading as="h3" fontSize="lg" mt={3}>
            제1조(목적)
          </Heading>
          <Text>
            본 약관은 About 연합 동아리 및 커뮤니티 서비스(
            <a href={process.env.NEXT_PUBLIC_NEXTAUTH_URL}>
              {process.env.NEXT_PUBLIC_NEXTAUTH_URL}
            </a>
            , 이하 &quot;About&quot;)가 제공하는 스터디, 번개(소셜링), 소모임 및 관련 제반 서비스의
            이용과 관련하여, About와 회원 간의 권리·의무 및 책임사항, 기타 필요한 사항을 정함을
            목적으로 합니다.
          </Text>

          <Heading as="h3" fontSize="lg" mt={3}>
            제2조(정의)
          </Heading>
          <Text>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</Text>
          <List styleType="number" ml="1em">
            <ListItem>
              &quot;서비스&quot;란 About가 운영하는 웹·앱을 통하여 제공하는 스터디, 번개(소셜링),
              소모임, 동아리 행사 및 기타 부가 기능을 말합니다.
            </ListItem>
            <ListItem>
              &quot;회원&quot;이란 본 약관에 동의하고 About와 이용계약을 체결하여 서비스를 이용하는
              자를 말합니다.
            </ListItem>
            <ListItem>
              &quot;스터디&quot;란 카공 등 공부를 목적으로, 지역·시간을 기준으로 자동 매칭 또는
              모집을 통해 진행되는 모임을 말합니다.
            </ListItem>
            <ListItem>
              &quot;번개(소셜링)&quot;이란 맛집, 카페, 액티비티 등 다양한 주제로, 비교적 1회성에
              가깝게 진행되는 모임을 말합니다.
            </ListItem>
            <ListItem>
              &quot;소모임&quot;이란 같은 관심사를 가진 멤버들이 일정 기간 지속적으로 활동하는 정기
              모임을 말합니다.
            </ListItem>
            <ListItem>
              &quot;호스트&quot; 또는 &quot;모임장&quot;이란 스터디, 번개, 소모임 등 모임을
              개설하거나 운영을 담당하는 회원을 말합니다.
            </ListItem>
            <ListItem>
              &quot;포인트&quot;란 출석, 스터디·모임 참여, 친구 초대 등 활동에 따라 적립되며,
              About가 정한 기준에 따라 보증금, 스토어 상품 구매 등 서비스 내에서 사용할 수 있는
              가상의 재산적 가치 단위를 말합니다.
            </ListItem>
            <ListItem>
              &quot;참여권(티켓)&quot;이란 번개 또는 소모임에 참여하기 위해 필요한 이용권으로,
              월별로 부여·초기화되며, About 정책에 따라 추가 지급 또는 구매가 가능할 수 있습니다.
            </ListItem>
            <ListItem>
              &quot;보증금&quot;이란 노쇼 방지 및 원활한 모임 운영을 위하여 참여 시 선차감되는
              포인트 또는 금전을 말하며, 출석 여부 및 취소 시점에 따라 전부 또는 일부가 환급되지
              않을 수 있습니다.
            </ListItem>
            <ListItem>
              &quot;소셜링 온도&quot;란 번개(소셜링) 참여 후 멤버들이 남기는 익명 리뷰를 바탕으로
              산정되는 후기 지표로, 모임 승인률·혜택 등에 영향을 줄 수 있습니다.
            </ListItem>
          </List>

          {/* 제2장 회원 */}
          <Heading as="h2" fontSize="2xl" mt={6}>
            제2장 회원
          </Heading>

          <Heading as="h3" fontSize="lg" mt={3}>
            제3조(회원가입 및 계정 관리)
          </Heading>
          <List styleType="number" ml="1em">
            <ListItem>
              회원가입은 서비스 내 가입 화면에서 본 약관 및 개인정보처리방침에 동의하고, About가
              정한 정보를 입력하여 이용 신청을 한 후 About가 이를 승낙함으로써 완료됩니다.
            </ListItem>
            <ListItem>
              About는 다음 각 호에 해당하는 경우 이용 신청을 승낙하지 않거나 사후에 이용을
              제한·해지할 수 있습니다.
              <List styleType="circle" ml="1em" mt={1}>
                <ListItem>타인의 정보를 도용하거나 허위 정보를 기재한 경우</ListItem>
                <ListItem>
                  부정한 목적(종교·이성·정치적 목적 등)으로 서비스를 이용하려는 것으로 판단되는 경우
                </ListItem>
                <ListItem>
                  과거 서비스 이용 제한 또는 강제 탈퇴 이력이 있는 경우로서 재가입이 부적절하다고
                  판단되는 경우
                </ListItem>
              </List>
            </ListItem>
            <ListItem>
              회원은 자신의 계정 및 로그인 정보를 선량한 관리자의 주의로 관리해야 하며, 타인에게
              양도·대여하거나 공유할 수 없습니다.
            </ListItem>
          </List>

          <Heading as="h3" fontSize="lg" mt={3}>
            제4조(회원에 대한 통지)
          </Heading>
          <List styleType="number" ml="1em">
            <ListItem>
              About가 회원에게 개별 통지를 하는 경우, 서비스 내 알림, 공지, 회원이 제공한 이메일,
              문자, 카카오톡 채널, 앱 푸시 등 합리적인 수단을 이용할 수 있습니다.
            </ListItem>
            <ListItem>
              다수 회원에게 공통으로 적용되는 사항에 대해서는 서비스 내 공지사항 게시로 개별 통지에
              갈음할 수 있습니다.
            </ListItem>
          </List>

          <Heading as="h3" fontSize="lg" mt={3}>
            제5조(회원 탈퇴 및 자격 상실)
          </Heading>
          <List styleType="number" ml="1em">
            <ListItem>
              회원은 언제든지 서비스 내 [마이페이지 &gt; 설정 &gt; 회원탈퇴] 메뉴를 통하여 탈퇴를
              신청할 수 있으며, 관련 법령에서 정한 범위를 제외하고 회원의 정보와 활동 이력은 일정
              기간 후 삭제 또는 비식별 처리됩니다.
            </ListItem>
            <ListItem>
              회원이 다음 각 호에 해당하는 경우 About는 서비스 이용을 제한하거나 회원 자격을
              상실시킬 수 있습니다.
              <List styleType="circle" ml="1em" mt={1}>
                <ListItem>
                  반복적인 노쇼, 무단 불참, 심각한 비매너 등으로 다른 회원에게 지속적인 피해를 주는
                  경우
                </ListItem>
                <ListItem>
                  일방적 연락, 스토킹, 성희롱, 종교·이성·정치 권유 등으로 신고·거리두기가 다수
                  누적되는 경우
                </ListItem>
                <ListItem>
                  서비스 운영을 고의로 방해하거나, 시스템을 악용·불법으로 사용하는 경우
                </ListItem>
              </List>
            </ListItem>
          </List>

          {/* 제3장 서비스 이용 */}
          <Heading as="h2" fontSize="2xl" mt={6}>
            제3장 서비스 이용
          </Heading>

          <Heading as="h3" fontSize="lg" mt={3}>
            제6조(서비스의 내용)
          </Heading>
          <Text>About가 제공하는 주요 서비스는 다음과 같습니다.</Text>
          <List styleType="number" ml="1em">
            <ListItem>스터디 매칭 및 출석·인증 기능</ListItem>
            <ListItem>번개(소셜링) 개설 및 참여 기능</ListItem>
            <ListItem>소모임 개설, 승인, 운영 및 멤버 관리 기능</ListItem>
            <ListItem>동아리 행사 및 각종 이벤트 안내·신청 기능</ListItem>
            <ListItem>포인트·참여권·보증금 관리 및 활동 리워드 기능</ListItem>
            <ListItem>카공 지도, 후기/리뷰, 신고·거리두기 등 부가 기능</ListItem>
            <ListItem>
              그 밖에 About가 추가로 개발하거나 제휴를 통해 제공하는 일체의 서비스
            </ListItem>
          </List>

          <Heading as="h3" fontSize="lg" mt={3}>
            제7조(서비스의 변경 및 중단)
          </Heading>
          <List styleType="number" ml="1em">
            <ListItem>
              About는 서비스의 품질 향상 및 운영상 필요에 따라 서비스의 전부 또는 일부를 변경할 수
              있으며, 중요한 변경 사항은 사전에 서비스 내 공지사항 등을 통하여 안내합니다.
            </ListItem>
            <ListItem>
              About는 다음 각 호의 사유가 있는 경우 서비스의 전부 또는 일부를 일시적으로 중단할 수
              있습니다.
              <List styleType="circle" ml="1em" mt={1}>
                <ListItem>
                  서비스 설비의 보수, 점검, 교체, 고장, 통신 장애 등 부득이한 사유가 있는 경우
                </ListItem>
                <ListItem>천재지변, 정전, 화재, 전쟁 등 불가항력적 사유</ListItem>
              </List>
            </ListItem>
          </List>

          <Heading as="h3" fontSize="lg" mt={3}>
            제8조(오프라인 모임 및 책임)
          </Heading>
          <List styleType="number" ml="1em">
            <ListItem>
              About를 통해 이루어지는 스터디, 번개, 소모임, 행사 등 오프라인 활동은 기본적으로
              호스트와 참여자 간 자율적인 약속에 따라 진행됩니다.
            </ListItem>
            <ListItem>
              오프라인 활동 과정에서 발생하는 개인 간 분쟁, 상해, 도난, 기타 손해에 대해서는
              원칙적으로 당사자 간에 책임이 있으며, About는 고의 또는 중대한 과실이 없는 한 이에
              대한 법적 책임을 부담하지 않습니다.
            </ListItem>
            <ListItem>
              다만, About는 신고·거리두기 제도 등을 통해 안전한 모임 문화를 유지하기 위해 노력하며,
              필요 시 회원 자격 제한 등의 조치를 취할 수 있습니다.
            </ListItem>
          </List>

          {/* 제4장 권리와 의무 */}
          <Heading as="h2" fontSize="2xl" mt={6}>
            제4장 권리와 의무
          </Heading>

          <Heading as="h3" fontSize="lg" mt={3}>
            제9조(About의 의무)
          </Heading>
          <List styleType="number" ml="1em">
            <ListItem>
              About는 관련 법령과 본 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며,
              안정적인 서비스 제공을 위해 최선을 다합니다.
            </ListItem>
            <ListItem>
              About는 서비스 운영과 관련하여 알게 된 회원의 개인정보를 개인정보처리방침에서 정한
              목적 및 범위 내에서만 이용하며, 안전한 보호를 위해 노력합니다.
            </ListItem>
          </List>

          <Heading as="h3" fontSize="lg" mt={3}>
            제10조(회원의 의무)
          </Heading>
          <List styleType="number" ml="1em">
            <ListItem>
              회원은 서비스 이용 시 다음 각 호의 행위를 하여서는 안 됩니다.
              <List styleType="number" ml="1em" mt={1}>
                <ListItem>다른 회원 또는 제3자를 비방·모욕하거나 명예를 훼손하는 행위</ListItem>
                <ListItem>
                  일방적인 연락, 스토킹, 이성·종교·정치 권유 등 타인에게 불편함을 주는 행위
                </ListItem>
                <ListItem>
                  폭언, 성희롱, 차별적 발언, 과도한 음주 권유 등 모임 분위기를 심각하게 해치는 행위
                </ListItem>
                <ListItem>
                  서비스 내 정보를 무단으로 수집·복제·배포하거나 영리 목적으로 이용하는 행위
                </ListItem>
                <ListItem>서비스의 정상적인 운영을 방해하거나 시스템·버그를 악용하는 행위</ListItem>
              </List>
            </ListItem>
            <ListItem>
              회원이 본 조를 위반한 경우, About는 경고, 이용 제한, 강제 탈퇴, 재가입 제한 등 필요한
              조치를 취할 수 있습니다.
            </ListItem>
          </List>

          <Heading as="h3" fontSize="lg" mt={3}>
            제11조(게시물의 저작권 및 관리)
          </Heading>
          <List styleType="number" ml="1em">
            <ListItem>
              서비스 및 이에 관련된 소프트웨어, 디자인, 로고 등 일체의 권리는 About 또는 정당한
              권리자에게 귀속됩니다.
            </ListItem>
            <ListItem>
              회원이 서비스 내에 게시한 게시물(사진, 글, 후기 등)의 저작권은 원칙적으로 해당
              게시자에게 귀속됩니다. 다만, About는 서비스 운영·홍보 및 품질 개선을 위하여 필요한
              범위 내에서 게시물을 이용·편집·저장·노출할 수 있습니다.
            </ListItem>
            <ListItem>
              회원의 게시물이 관련 법령 또는 본 약관에 위반되거나 타인의 권리를 침해한다고 판단되는
              경우, About는 사전 통지 없이 해당 게시물을 숨김·수정·삭제할 수 있습니다.
            </ListItem>
          </List>

          {/* 제5장 포인트·보증금·참여권 */}
          <Heading as="h2" fontSize="2xl" mt={6}>
            제5장 포인트·보증금·참여권
          </Heading>

          <Heading as="h3" fontSize="lg" mt={3}>
            제12조(포인트)
          </Heading>
          <List styleType="number" ml="1em">
            <ListItem>
              포인트는 출석 체크, 스터디·모임 참여, 친구 초대, 이벤트 참여 등 About가 정한 기준에
              따라 적립되며, 적립·사용·소멸 기준은 서비스 내 안내 및 공지에 따릅니다.
            </ListItem>
            <ListItem>
              포인트는 원칙적으로 서비스 내에서만 사용 가능하며, 현금으로 환급되지 않습니다. 단,
              About가 별도로 정한 정책에 따라 출금 또는 정산이 허용되는 경우 그 기준을 따릅니다.
            </ListItem>
            <ListItem>
              회원이 부정한 방법(허위 출석, 허위 인증, 어뷰징 등)으로 포인트를 적립한 경우, About는
              해당 포인트를 회수하고 서비스 이용을 제한할 수 있습니다.
            </ListItem>
          </List>

          <Heading as="h3" fontSize="lg" mt={3}>
            제13조(참여권(티켓))
          </Heading>
          <List styleType="number" ml="1em">
            <ListItem>
              참여권은 번개 또는 소모임 참여를 위해 필요한 이용권으로, 매월 1일 기준으로
              초기화·지급됩니다. 기본 제공 수량 및 추가 지급 기준은 서비스 내 정책에 따릅니다.
            </ListItem>
            <ListItem>
              참여권은 타인에게 양도할 수 없으며, 유효기간이 지난 참여권은 소멸합니다.
            </ListItem>
          </List>

          <Heading as="h3" fontSize="lg" mt={3}>
            제14조(보증금 및 불참 처리)
          </Heading>
          <List styleType="number" ml="1em">
            <ListItem>
              일부 번개·소모임는 노쇼 방지 및 운영 안정성을 위해 보증금(포인트 또는 금전)을 선차감할
              수 있으며, 구체적인 금액·환급 조건은 모임 상세 페이지 및 서비스 내 정책에 따릅니다.
            </ListItem>
            <ListItem>
              모임 하루 전 취소, 당일 취소 또는 노쇼(무단 불참)의 경우 보증금 전부 또는 일부가
              환급되지 않을 수 있으며, 소셜링 온도 및 활동 기록에 불이익이 발생할 수 있습니다.
            </ListItem>
            <ListItem>
              정상적인 취소 및 출석 절차를 따르는 경우, 정책에서 정한 기준에 따라 보증금은
              환급되거나 포인트로 전환됩니다.
            </ListItem>
          </List>

          {/* 제6장 개인정보 보호 */}
          <Heading as="h2" fontSize="2xl" mt={6}>
            제6장 개인정보 보호
          </Heading>

          <Heading as="h3" fontSize="lg" mt={3}>
            제15조(개인정보 보호)
          </Heading>
          <Text>
            About는 회원의 개인정보를 보호하기 위하여 관련 법령 및 개인정보처리방침을 준수합니다.
            개인정보의 수집·이용·제공·보관 등 구체적인 사항은 About가 별도로 게시한
            &quot;개인정보처리방침&quot;의 내용을 따릅니다.
          </Text>

          {/* 제7장 약관의 개정 및 분쟁 */}
          <Heading as="h2" fontSize="2xl" mt={6}>
            제7장 약관의 개정 및 분쟁 해결
          </Heading>

          <Heading as="h3" fontSize="lg" mt={3}>
            제16조(약관의 개정)
          </Heading>
          <List styleType="number" ml="1em">
            <ListItem>
              About는 「약관의 규제에 관한 법률」, 「정보통신망 이용촉진 및 정보보호 등에 관한
              법률」 등 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.
            </ListItem>
            <ListItem>
              약관을 개정하는 경우, 개정 내용과 적용일자를 명시하여 적용일 7일 전까지 서비스 내
              공지사항 등을 통하여 회원에게 공지합니다. 다만 회원에게 불리한 변경의 경우에는 최소
              30일 전에 공지합니다.
            </ListItem>
            <ListItem>
              회원이 개정 약관에 동의하지 않는 경우, 약관 시행일 전까지 회원탈퇴를 통해 이용계약을
              해지할 수 있습니다. 약관 시행일 이후에도 서비스를 계속 이용하는 경우, 개정 약관에
              동의한 것으로 봅니다.
            </ListItem>
          </List>

          <Heading as="h3" fontSize="lg" mt={3}>
            제17조(면책조항)
          </Heading>
          <List styleType="number" ml="1em">
            <ListItem>
              About는 천재지변, 전쟁, 화재, 정전, 통신 장애 등 불가항력적인 사유로 인하여 서비스를
              제공할 수 없는 경우 그 책임을 지지 않습니다.
            </ListItem>
            <ListItem>
              About는 회원의 귀책사유로 인한 서비스 이용 장애 및 손해에 대해 책임을 지지 않습니다.
            </ListItem>
            <ListItem>
              About는 회원 상호 간 또는 회원과 제3자 간에 서비스를 매개로 발생한 분쟁에 개입하지
              않으며, 이로 인한 손해에 대하여 책임을 부담하지 않습니다.
            </ListItem>
          </List>

          <Heading as="h3" fontSize="lg" mt={3}>
            제18조(준거법 및 관할)
          </Heading>
          <Text>
            본 약관 및 서비스 이용과 관련하여 About와 회원 간에 발생한 분쟁에 대하여는 대한민국 법을
            준거법으로 하며, 분쟁으로 인한 소송은 민사소송법에서 정한 관할 법원에 제기합니다.
          </Text>

          {/* 결제 및 환불 조항 추가 */}
          <Heading as="h3" fontSize="lg" mt={3}>
            제19조(결제 및 환불)
          </Heading>
          <List styleType="number" ml="1em">
            <ListItem>
              회비 등 About에서 제공하는 유료 서비스는 결제 후 즉시 전용 기능 및 커뮤니티 열람
              권한이 제공되므로 서비스 제공이 개시된 것으로 간주되며, 서비스 제공 개시 후에는 환불이
              불가합니다.
            </ListItem>
            <ListItem>
              단, 결제일로부터 7일 이내이며 어떠한 유료 기능도 이용하지 않은 경우에는 환불이
              가능합니다. 구체적인 환불 절차 및 방법은 서비스 내 안내에 따릅니다.
            </ListItem>
          </List>

          <Text fontSize="sm" color="gray.500" mt={6}>
            본 약관은 2025년 12월 1일부터 시행합니다.
          </Text>
        </Container>
      </Slide>
    </>
  );
}

export default Policy;
