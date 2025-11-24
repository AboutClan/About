import { Box, Button, Flex } from "@chakra-ui/react";
import { useState } from "react";

import { Input } from "../../../components/atoms/Input";
import Header from "../../../components/layouts/Header";
import ButtonGroups from "../../../components/molecules/groups/ButtonGroups";
import { useSendNotificationAllMutation } from "../../../hooks/FcmManger/mutations";

// const NOTICE_ALERT = [
//   {
//     title: "✨ About 개강총회 참여 신청",
//     description:
//       "2학기 시작을 알리는 개강총회! ✨ 이번 학기, 특별한 시작을 원한다면? 새로운 친구들과 함께 즐겁게 출발해요! (상세 내용은 앱 상단 알림 확인)",
//   },
//   {
//     title: "🤩 연휴 기간! 내 취향을 저격할 모임은?",
//     description: "취향이 통하는 멤버들과 함께 다양한 추억을 만들어요!",
//   },
//   {
//     title: "🔥 스터디 기능 업데이트 완료!",
//     description: "참여가 훨씬 쉬워진 카공 스터디✨ 이미 많은 멤버들이 신청 중이에요! 🚀",
//   },
//   {
//     title: "🔥NEW ABOUT 스터디🔥 ",
//     description: "스터디 신청하고, 동네 친구랑 같이 카공하자! 공부 집중 + 상품까지 다 받아가세요~!",
//   },
//   {
//     title: "스토어 이벤트 오픈 🎉 ",
//     description:
//       "전 상품 할인 + 올리브영 기프티콘 입고! 스터디 참여해서 포인트 모으고 지금 바로 응모하세요! 🎁",
//   },
// ];

// const STUDY_ALERT = [
//   {
//     title: "이번주 카공 같이 할 사람? ✨",
//     description: "근처에 있는 멤버들이 스터디 기다리고 있어요! 지금 신청하고 같이 카공해요!",
//   },
//   {
//     title: "공부 인증",
//     description: "오늘 공부 준비, 다 되셨나요?... 공부 인증하고 기프티콘 받아가세요!",
//   },
//   {
//     title: "✏️ 새 학기, 공부 습관 시작하기 딱 좋은 때!",
//     description: "스터디 신청하고 포인트 받아가세요!",
//   },
//   {
//     title: "🔥 새 학기 스터디 🔥",
//     description: "새로운 학기의 시작! 더 완벽한 시작을 하고 싶다면, 스터디에 참여해 보세요🔥",
//   },
//   {
//     title: "🔥 오늘의 스터디 🔥",
//     description: "3초만에 공부 인증하고 포인트 획득하자! 카공 스터디 할 사람도 모집중 ☺️",
//   },
//   {
//     title: "주말에도 갓생 보내자 🔥",
//     description: "이번 주말 공부 인증도, 다음주 스터디 참여 신청도! 미리 신청하고 갓생 만들어요 🌟",
//   },
//   {
//     title: "☕ 다음주 카공 멤버 모집중 ! ☕",
//     description: "스터디 참여 신청하고 같이 카공해요! 포인트까지 벌어가는 건 덤~!",
//   },
//   {
//     title: "공부도 하고, 포인트도 GET! 💰",
//     description: "스터디 신청만 해도 포인트가 와르르 🎁 다음 주 함께 공부할 멤버를 찾고 있어요 🚀",
//   },
//   {
//     title: "곧 시험 기간인데... 같이 공부하자! 🫢",
//     description: "다음 주 카공 같이 할 사람을 모집하고 있어요! 저녁까지 집중해서 공부할 사람!",
//   },
// ];

function Notice() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tab, setTab] = useState(null);

  const { mutate } = useSendNotificationAllMutation("study");
  console.log(mutate);
  const onSubmit = () => {
    mutate({
      title: "☕ 다음주 카공 멤버 모집중 ! ☕",
      description:
        "스터디 신청 오류가 해결됐어요😊 다음주 스터디 신청하고 같이 카공해요! 신청만 해도 포인트 획득~!",
    });
  };

  return (
    <>
      <Header title="공지 작성" />
      <Box p={5}>
        <ButtonGroups
          buttonOptionsArr={[{ text: "스터디", func: () => setTab("스터디") }]}
          currentValue={tab}
        />
      </Box>
      <Flex flexDir="column" gap={2} mt={10} mx={5}>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" />
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="본문" />
        <Button onClick={onSubmit}>부여</Button>
      </Flex>
    </>
  );
}

export default Notice;
