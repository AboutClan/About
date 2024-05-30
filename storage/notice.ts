interface INoticeArr {
  id: string;
  title: string;
  category: NoticeCategory;
  content: string;
  date: string;
}

export type NoticeCategory = "main" | "sub" | "event" | "update";

export const NOTICE_ARR: INoticeArr[] = [
  {
    id: "1",
    title: "동아리 리모델링 !!",
    category: "main",
    content:
      "안녕하세요! 준비하고 있던 리모델링 초기버전이 1차적으로 완성됐습니다. 아직 많이 부족하지만 계속해서 발전해 나갈 수 있도록 할 거고, 4~5월 중에는 다른 지역까지의 확장을 시도하고 있습니다. 또한 최근에 스터디 체계 관리를 거의 못했는데, 4월부터는 스터디 규칙에 따라 자동화되어 서비스가 운영될거예요. 기존에 열심히 안 나오시던 분들은 열심히 나올 수 있는 기회가 됐으면 좋겠습니다. 다들 이렇게 만나뵐 수 있게 되어 정말 반갑고 잘 부탁드립니다!",
    date: "2023-03-25",
  },
  {
    id: "2",
    title: "이벤트 관련",
    category: "sub",
    content:
      "건의하기 이벤트는 항시 지속되는 이벤트이고, 동아리 홍보글 작성 이벤트는 4월 5일까지만 신청을 받을게요! 신청일 기준이고, 신청을 희망하시는 분은 갠톡주세요!  ",
    date: "2023-03-28",
  },
  {
    id: "3",
    title: "4월 2일 변경 내용",
    category: "sub",
    content:
      "'수원시청역-커피빈' 장소 추가, 달력에 스터디 참여 마크 표시 '임시' 삭제, 스터디 규칙 업데이트, 스터디 상세페이지 및 유저 프로필 모달 수정",
    date: "2023-04-02",
  },
  {
    id: "4",
    title: "스터디 관리 시작합니다 !",
    category: "main",
    content:
      "스터디 규칙에 따른 관리를 4월 6일부터 시작합니다. 메인 페이지 우측 상단의 규칙을 확인하시고 경고를 받는 일이 없도록 주의해주세요! 또한 열심히 참여하라고 점수 시스템을 만들었어요 ㅎㅎ 점점 재밌는 컨텐츠를 많이 만들 수 있도록 해볼게요! 경고와 점수 모두 자동적으로 채점되기 때문에 혹시나 잘못 채점되는 경우가 있다면 저에게 말씀해주세요~! 그럼 다들 파이팅입니다 😊",
    date: "2023-04-05",
  },
  {
    id: "5",
    title: "동아리 확장 및 홍보",
    category: "main",
    content:
      "다음주부터 본격적으로 스터디 지역 확장 및 홍보를 시작합니다. 혼자서는 불가능해요 ㅠ 동아리원 분들 모두의 도움이 필요합니다! 다들 많이 도와주시면 감사하겠습니다 😊",
    date: "2023-04-15",
  },
  {
    id: "6",
    title: "양천구/당산 지역 확장",
    category: "sub",
    content: "4월 18일부로 양천구/당산 지역으로 스터디 확장했습니다!",
    date: "2023-04-18",
  },
  {
    id: "7",
    title: "다음 지역 확장 예정",
    category: "sub",
    content:
      "다음 확장 지역은 5월 중에 안양으로 계획하고 있습니다. 자세한 내용은 이후에 다시 언급할 수 있도록 하겠습니다.",
    date: "2023-04-20",
  },
  {
    id: "8",
    title: "신규 컨텐츠",
    category: "main",
    content:
      "참여 기록 페이지, 랭킹 페이지, 스토어 페이지 추가 + 유저 아바타 프로필 선택 기능 오픈",
    date: "2023-04-27",
  },
  {
    id: "9",
    title: "수원 장소 추가",
    category: "sub",
    content: "망포역 - 할리스, 송죽동 - 커피빈 장소 추가. 5월 중 서수원 지역도 추가 예정",
    date: "2023-05-02",
  },
  {
    id: "10",
    title: "이벤트! 치킨!!",
    category: "event",
    content:
      "에브리타임 홍보 게시판에 동아리 홍보글을 올려주신 분들에게 10 point 뿐만 아니라, 추첨을 통해 두 분께 황금 올리브 치킨 세트 기프티콘을 드려요! 관련 내용은 마이페이지 → 홍보 리워드를 통해 신청해주시면 됩니다! 기존에 올려주셨던 분들은 바로 리워드 신청 눌러주시면 돼요! 그리고 여러번 지원 가능합니다! 도배가 되지 않도록 검색해보시고 3일 정도의 텀은 가져주세요!",
    date: "2023-05-02",
  },
  {
    id: "11",
    title: "컨텐츠 오픈",
    category: "main",
    content:
      "친구, 모임, 광장 관련 컨텐츠들이 생겼어요. 아직 완성된 기능들이 아니지만, 미리 체험해볼 수 있도록 올려두었습니다. 완전한 서비스까지는 시간이 조금 걸릴 수 있어요 ㅎㅎ... 이에 따라 전체적인 인터페이스도 변경중입니다. 건의사항이나 오류사항이 있다면 알려주세요!",
    date: "2023-06-01",
  },

  {
    id: "12",
    title: "시험기간 두근두근 랜덤 선물 이벤트",
    category: "event",
    content:
      "이번에도 단톡방에서 일주일간 시험기간 두근두근 랜덤 선물 이벤트 진행합니다! 다들 시험기간 파이팅~! (곧 종강이에요 두근두근) 한번 받으신 분들은 다음꺼엔 양보해주시면 감사합니당 :)",
    date: "2023-06-01",
  },
  {
    id: "13",
    title: "가입 나이제한 변경",
    category: "main",
    content:
      "나이가 만으로 바뀜과 함께 동아리 가입 나이제한을 19세 ~ 26세로 변경합니다. 여러가지를 고려했을 때 동아리의 활동 인원 포커싱을 20대 초중반으로 보는게 맞을 거 같아서 최대 나이 제한을 조금 많이 줄였어요...! 이는 최초 가입 기준이고 가입 인원의 활동과는 전혀 무관합니다.",
    date: "2023-06-23",
  },
  {
    id: "14",
    title: "여름 첫 공지사항",
    category: "main",
    content:
      "다들 행복한 방학 생활을 시작하셨나요? 아니라면 유감입니다. 공지사항이 있습니다. 첫번째는 만나이로 변경한다는 점과 나이 제한을 19세 ~ 26세로 변경한다는 점입니다. 자세한 내용은 아래 공지사항을 확인해주세요! 두번째는 보증금에 관해서 인데, 아직 보증금과 관련된 벌금과 시스템이 완전하지 않아서 제대로 시작할때쯤 보증금 롤백을 할 예정입니다. 세번째로는 컨텐츠입니다. 음... 컨텐츠에 관해서는 계속해서 업데이트가 되기 때문에 큰 걸 제외하고는 굳이 따로 공지하지 않을게요! 공지할 내용이 있으면 단톡방에서 말씀드리겠습니다~!",
    date: "2023-06-23",
  },
  {
    id: "15",
    title: "메인 업데이트 공지",
    category: "main",
    content:
      "멤버 게시판 오픈! 같이 활동하는 동아리원 정보를 한 눈에 볼 수 있어요! 모임 게시판 오픈! 번개를 열거나 모임에 참여할 수 있어요! 세부적인 업데이트나 디자인 조정은 설명 생략!",
    date: "2023-07-08",
  },
  {
    id: "16",
    title: "안양 지역 스터디 오픈",
    category: "sub",
    content: "7월 9일부터 안양 지역 스터디가 오픈돼요! 다들 파이팅입니다~!",
    date: "2023-07-08",
  },
  {
    id: "17",
    title: "휴식 관련",
    category: "sub",
    content:
      "마이페이지에서 휴식 신청을 할 수 있습니다. 일반 휴식은 누구나 할 수 있으며, 분기마다 최대 1달까지만 가능합니다. 특별 휴식은 기간에 상관없이 휴식이 가능하고, 이는 관리자/운영진의 판단하에 허가됩니다. 휴식중인 인원은 벌금이나 활동 조건에 전혀 영향을 받지 않습니다.",
    date: "2023-07-08",
  },
  {
    id: "18",
    title: "동아리 멤버 관련 필독(반드시 읽을 것)",
    category: "main",
    content:
      "동아리 초반이라 미뤄뒀는데 활동 인원 관리를 시작하려고 합니다. 가입 이후 모든 인원은 수습멤버를 거치고, 스터디에 2회 참여해야 동아리원으로 등록됩니다. 수습 멤버의 상태로 2달 동안 스터디에 1회도 참여하지 않은 경우에는 외부인으로 변경됩니다.(탈퇴) 이는 어디까지나 활동 의사가 아예 없는 인원을 배제하기 위함이기 때문에 부담을 느끼실 필요는 없습니다. 상황이 여의치 않아 참여가 힘들다면 휴식신청을 해주시면 되고, 휴식 멤버는 활동에 지장을 받지 않습니다.",
    date: "2023-07-08",
  },
  {
    id: "19",
    title: "스터디 FREE 오픈",
    category: "sub",
    content:
      "투표했는데 스터디가 열리지 않은 경우, 스터디 상세 페이지에서 Free 오픈 신청을 통해 해당 스터디를 오픈할 수 있습니다. 혼자 참여할 수도 있고, 다른 인원이 당일 참여를 통해 올 수도 있으니 활용해주시면 좋을 거 같습니다!",
    date: "2023-07-08",
  },
  {
    id: "20",
    title: "업데이트 공지",
    category: "update",
    content:
      "최근 업데이트 된 내용들 요약입니다. 전체적인 디자인 및 UI 개선, 오류 수정, 스터디 친구 초대(양쪽 추가 점수), 스터디 Free 오픈, 스터디 기록 분석, 랭킹 페이지, 포인트/점수/보증금 로그, 멤버 게시판, 멤버 등급 분류, 모임 게시판, 리뷰 게시판, 프로필 수정, 회원가입 페이지, 유저 가이드, 기타 개선 사항 수정 등. 현재 오류 사항이 없어야 하는데, 웹 사이트 이용하면서 동작하지 않거나 오류 사항을 발견하면 말씀해주세요! 소소하게 상품을 지급하고 있습니다.",
    date: "2023-07-08",
  },
  {
    id: "21",
    title: "프로필 아바타 캐릭터 추가 및 색상 변경 안내",
    category: "update",
    content:
      "프로필 캐릭터 6종 추가. 색상 팔레트 변경. 자세한 내용은 마이페이지의 프로필 아바타에서 확인해주세요! 아바타는 특정 점수를 달성할 때마다 해금됩니다.",
    date: "2023-07-17",
  },
  {
    id: "22",
    title: "수원역 탐탐 공통 스터디 장소로 변경",
    category: "sub",
    content:
      "수원역 탐탐은 안양에서도 가까워서 당분간 수원/안양 양쪽에서 투표할 수 있도록 배치했습니다.",
    date: "2023-07-21",
  },
  {
    id: "23",
    title: "피드백 및 건의사항 이벤트",
    category: "event",
    content:
      "현재 웹사이트에 오류나 동작하지 않는 기능, 핸드폰 기종에 상관없이 인터페이스나 디자인이 깨지는 등의 어떠한 문제도 없어야 하거든요! 이러한 부분을 발견하거나, 혹은 일반적인 건의사항, 그냥 어색한 부분도 좋습니다! 웹 사이트를 통해 건의해주시면 모든 인원에게 1000원~5000원 상당의 상품을 드립니다! ",
    date: "2023-07-21",
  },
  {
    id: "24",
    title: "수원/양천구 스터디 장소 추가",
    category: "main",
    content:
      "수원 - 상현역 / 광교역 장소 추가, 광교중앙역 장소 삭제, 양천구/영등포 - 영등포구청역 추가, 화곡 DT점 추가, 오목교역 스터디 장소 변경",
    date: "2023-07-21",
  },
  {
    id: "25",
    title: "멤버게시판 동아리원 정보 추가",
    category: "update",
    content:
      '멤버 게시판의 "더보기"란에서 더 자세한 멤버들의 정보를 확인할 수 있게 되었습니다. 또한 휴식중인 멤버들의 기간과 내용을 확인할 수 있습니다.',
    date: "2023-08-07",
  },
  {
    id: "26",
    title: "유령회원 탈퇴 처리 안내",
    category: "sub",
    content:
      "2022년에 가입한 인원들 중 현재 활동을 하고 있지 않는 것으로 보이는 인원과 2023년에 가입했지만 현재 단톡방을 나간 인원들에 대해 탈퇴 처리를 진행했습니다. 약 300명 이상의 데이터를 지웠는데 혹시라도 활동 의사가 있으신 분은 재가입 요청해주시면 다시 승인할 수 있도록 하겠습니다. 또한 수습 회원으로 남아계신 분들은 휴식 기간을 제외하고 2달이 지난 시점에 탈퇴처리 되니 유의하시기 바랍니다.",
    date: "2023-08-08",
  },
  {
    id: "27",
    title: "랭킹페이지 업데이트",
    category: "update",
    content: "랭킹 페이지에 월간 랭킹을 업데이트 하였습니다.",
    date: "2023-08-09",
  },
  {
    id: "28",
    title: "매일매일 출석체크 !",
    category: "update",
    content:
      "메인 페이지 상단에 출석체크 아이콘이 추가됐어요! 하루에 1번 출석체크를 통해 포인트를 얻을 수 있고, 운이 좋으면 랜덤 선물도 받을 수 있답니다!",
    date: "2023-08-11",
  },
  {
    id: "29",
    title: "스토어 상품 입고",
    category: "sub",
    content: "포인트 스토어에 새 상품이 입고되었어요~! 이번에는 상품권 종류로만 들어왔습니다 😘",
    date: "2023-08-13",
  },
  {
    id: "30",
    title: "홍보 이벤트 페이지",
    category: "main",
    content:
      "홍보 방식이 변경되고 페이지가 따로 생겼어요! 동아리 홍보에 많이들 참여해주셨으면 하는 바람에 보상 또한 기존보다 상향됐습니다. 대신 3일의 쿨타임이 생겼으니 이 점 확인해주시고, 많은 참여 부탁드려요!",
    date: "2023-08-23",
  },
  {
    id: "31",
    title: "좋아요 기능 업데이트",
    category: "update",
    content:
      "다른 유저 프로필에서 좋아요를 보낼 수 있게 되었습니다. 다만 남용되는 것을 방지하기 위해서 조건을 두었는데, 최근에 같이 스터디에 참여하였거나, 오늘이 생일인 인원에게만 보낼 수 있도록 하였습니다. 이런 커뮤니케이션적인 기능은 이후에 계속 만들어 나갈 예정이에요! 다른 유저에게 받은 좋아요는 우측 상단의 알림에서 확인할 수 있습니다.",
    date: "2023-08-23",
  },
  {
    id: "32",
    title: "8월 홍보 이벤트 당첨 안내",
    category: "event",
    content:
      "당첨 인원은 2명으로 경쟁율 10 대 1 정도였어요! 당첨되신 분들 축하드리고 다들 9월에도 잘 부탁드립니다 :)",
    date: "2023-09-07",
  },
  {
    id: "33",
    title: "신규 가입시 오류 관련",
    category: "main",
    content:
      "가끔 신규로 가입하신 분들 중에 회원 정보에 오류가 있는 분들이 있어요! 스터디에 투표했을때 본인 아이콘이 회색 배경 고양이로 나온다거나, 접속시 튕긴다거나, 본인 프로필 정보가 이상하게 적혀있거나 이런 경우 모두 문제가 있는 것이니 반드시 관리자에게 말씀해주세요!",
    date: "2023-09-07",
  },
  {
    id: "34",
    title: "9월 조모임 안내",
    category: "main",
    content:
      "원래 정기모임은 주로 파티룸을 빌리거나 큰 룸을 잡거나 했었어요! 이번에는 개강도 했고, 새로 오픈한 지역도 있고, 친한 사람들끼리만 친해지는 거 같아서, 새로운 또래 친구들이랑 친해졌으면 하는 바람으로 조모임으로 진행합니다! 신청은 9월 10일까지 가능하고, 웹사이트 상단에 토끼 아이콘을 눌러서 신청 가능해요! 시간이나 활동 모두 조 내에서 자율적으로 계획하면 되니까 많이 참여해주세요!(웬만하면 9월 이내로) 반응이 괜찮으면 이것도 정기적으로 진행해볼게요! (안좋으면 이번이 마지막으로 폐쇄)",
    date: "2023-09-07",
  },
  {
    id: "35",
    title: "아바타 추가 안내",
    category: "update",
    content:
      "신규 회원을 위한 병아리를 포함해 총 4종의 아바타가 업데이트 되었습니다. 아바타 변경은 마이페이지에서 가능하고, 이로인해 기존에 사용하던 아바타가 다른 걸로 변경된 경우가 있을 수 있으니 그런 경우 다시 변경해주시면 돼요!",
    date: "2023-09-08",
  },
  {
    id: "36",
    title: "조모임 결과 발표",
    category: "main",
    content:
      "조 모임 결과가 나왔어요! 며칠만에 정말 많은 분들이 지원해주셨는데요...! 해당 내용은 신청했을때와 마찬가지로 웹사이트 상단의 토끼 아이콘에서 확인할 수 있습니다.",
    date: "2023-09-11",
  },
  {
    id: "37",
    title: "9/18 업데이트",
    category: "update",
    content:
      "전반적인 오류 수정, 디자인 수정, 서비스 최적화. 그리고 FREE 오픈 버튼 생성 및 기능 개선",
    date: "2023-09-18",
  },
  {
    id: "38",
    title: "신규 스터디 장소 추천",
    category: "main",
    content:
      "스터디가 열리지 않았거나, 거리가 멀어서 참여가 어렵거나, 시간이 애매하거나 하는 등의 경우를 위해 당일이라도 개인이 편한 곳에 오픈해서 공부할 수 있는 FREE 오픈 전용 스터디 장소가 추가됩니다. FREE 오픈 신청을 통해서만 열 수 있으며, 이를 위해 신규 장소 추천을 받습니다. 신규 장소는 지역별로 최대 8곳 까지만 받습니다.",
    date: "2023-09-18",
  },
  {
    id: "39",
    title: "양천/영등포 지역 확장",
    category: "sub",
    content:
      "여의도역과 신도림역이 스터디 지역으로 추가되었습니다. 더 괜찮은 카페 있으면 따로 추천해주세요!",
    date: "2023-09-21",
  },
  {
    id: "40",
    title: "유저 거리두기/신고하기 기능 업데이트",
    category: "update",
    content:
      "특정 유저와 거리를 두거나 신고를 할 수 있는 기능이 업데이트 되었습니다. 해당 유저의 프로필에 들어가셔서 우측 상단 버튼을 눌러주시면 됩니다. 동아리 현재 특성상 서류 탈락이나 면접 절차가 거의 없고, 인원도 계속 많아지고 있다보니 혹시 모를 사태를 대비하기 위해 만들었습니다. 익명성이 보장되니 너무 부담스러워 하지 말고 그럴 일이 있으면 신고해주세요!",
    date: "2023-09-21",
  },
  {
    id: "41",
    title: "좋아요 보내기",
    category: "update",
    content:
      "스터디 당일에도 양쪽 모두 출석체크를 완료했다면 좋아요를 보낼 수 있고, 포인트가 적립됩니다. FREE 오픈도 마찬가지입니다.",
    date: "2023-09-23",
  },
  {
    id: "42",
    title: "FREE 오픈 출석 인정",
    category: "main",
    content:
      "기존까지는 FREE 오픈은 스터디 참여 횟수에 포함시키지 않았으나, 이후부터는 FREE 오픈 또한 스터디 참여로 인정됩니다. 이에 따라 스터디 기록 페이지나 참여 그래프 등의 기록들이 업데이트 되었습니다.",
    date: "2023-09-23",
  },
  {
    id: "43",
    title: "동아리 캘린더 업데이트",
    category: "update",
    content: "동아리 캘린더 게시판이 업데이트 되었습니다.",
    date: "2023-09-27",
  },
  {
    id: "44",
    title: "홍보 리워드 2배 이벤트 !",
    category: "event",
    content:
      "당분간 동아리 홍보 리워드가 50 point에서 100point로 상향됩니다! 많음 참여 부탁드려요!",
    date: "2023-10-03",
  },
  {
    id: "45",
    title: "이벤트 캘린더 업데이트",
    category: "update",
    content: "이벤트 캘린더가 업데이트 되었습니다. 메인 페이지에서 확인이 가능합니다.",
    date: "2023-10-06",
  },
  {
    id: "46",
    title: "동아리 홍보글 변경 안내",
    category: "main",
    content: "동아리 홍보글이 변경되었습니다.",
    date: "2023-10-06",
  },
  {
    id: "47",
    title: "동아리 홍보 최초 등록 이벤트",
    category: "event",
    content:
      "아직 등록되지 않은 학교 목록에 홍보글을 작성해주시면 자동으로 300 point(3000원)가 지급됩니다. 치킨 기프티콘 응모는 덤!",
    date: "2023-10-8",
  },
  {
    id: "48",
    title: "이후 예정 일정",
    category: "sub",
    content:
      "10/10: 포인트 2배 이벤트, 10/15 ~ : 시험기간 랜덤 선물 이벤트, 10월 말  : 오프라인 번개 이벤트, 11월 초  : 정기모임(maybe 파티룸), 겨울방학: 소모임 운영 시작,(같은 분야 공부를 위한 스터디, 운동이나 취미, 관심사 등의 취미 소모임, 단순 친목 목적 개별 소모임 등)",
    date: "2023-10-9",
  },
  {
    id: "49",
    title: "이벤트 배지 획득 종료 예정 안내",
    category: "sub",
    content: "일일 출석을 통한 라벤더 배지와 딸기 스무디 획득은 10월까지만 진행됩니다.",
    date: "2023-10-10",
  },
  {
    id: "50",
    title: "시험기간 톡방 랜덤선물 이벤트",
    category: "event",
    content: "일주일 동안 오픈채팅방에서 랜덤 선물 이벤트를 진행합니다!",
    date: "2023-10-16",
  },
  {
    id: "51",
    title: "개인 자유 스터디 인증",
    category: "update",
    content:
      "개인 스터디 인증 컨텐츠가 새로 생겼습니다. 그룹 스터디에 참여하지 않았더라도 개인 카공, 개인 독서실 등 장소에 상관없이 참여 신청을 하고 출석체크때 사진을 인증하면 포인트를 획득할 수 있습니다. (완성된 컨텐츠는 아니고 베타서비스)",
    date: "2023-10-20",
  },
  {
    id: "52",
    title: "스토어 상품 입고 및 업데이트",
    category: "sub",
    content: "스토어를 본격적으로 규모를 키워보려고 합니다. 새 상품이 들어왔으니 보고 가세요~",
    date: "2023-10-20",
  },
  {
    id: "53",
    title: "모임 활성화 안내",
    category: "main",
    content:
      "11월 부터는 오프라인 모임을 좀 더 적극적으로 진행 할 예정입니다! 매주 번개 모임 투표를 받을거고, 격주에 한번은 20대 초반 모임, 두 달에 한번은 정기 모임이 진행됩니다.",
    date: "2023-10-31",
  },
  {
    id: "54",
    title: "정기 모임",
    category: "main",
    content:
      "정기 모임은 파티룸으로 확정되었습니다. 장소에 인원 제한이 있다보니 모든 인원 참여는 어려울 수도 있습니다. 인원이 초과되는 경우 선별 방법은 고민중에 있고, 곧 확정 인원 조사를 진행합니다.",
    date: "2023-11-01",
  },
  {
    id: "55",
    title: "알파벳 컬렉션",
    category: "update",
    content:
      "일일 출석체크와 스터디 출석체크를 통해 알파벳을 획득할 수 있습니다. 수집한 알파벳은 또 다른 상품으로 교환할 수 있고, 해당 컨텐츠는 마이페이지에서 확인할 수 있습니다.",
    date: "2023-11-01",
  },
  {
    id: "56",
    title: "스터디 투표 방식 변경",
    category: "update",
    content:
      "스터디 장소가 추가되고 투표 방식이 변경되었습니다. 스터디 장소가 늘어났지만 스터디가 열리기 위해 필요한 인원이 모여야 하기 때문에, 기본적으로는 1지망 장소를 선택하면 2지망 장소도 자동 선택되는 구조입니다. 또한 선택한 장소에 비례해서 포인트를 획득할 수 있습니다. 투표 지도에서 우측 상단의 아이콘을 통해 이러한 2지망 추천 장소 선택을 조정할 수 있고, 좌측 하단에서는 마이페이지에서 등록할 수 있는 스터디 프리셋을 바로 불러와 적용할 수 있습니다.",
    date: "2023-11-14",
  },
  {
    id: "57",
    title: "이후 동아리 운영 계획",
    category: "main",
    content:
      "동아리를 어떻게 운영해야 하나 고민이 많습니다. 스터디 동아리인데 스터디 참여율이 높지 않으신 분들이 대부분이에요. 조사 결과가 '다른 인원이 참여를 안해서 나도 안했다.'가 80%가 넘는 비중인데 이해가 되는 부분이지만 어떻게 해결할지 항상 답이 없는 고민인 거 같아요. 이것 저것 많은 방법을 시도해 왔는데 이번 방학 시즌을 마지막으로 활동을 하지 않는 인원은 모두 정리를 할 거 같습니다. 아무튼 앞으로의 계획은 첫번째로 지난 번에 언급한 것처럼 매달 열활멤버를 4~8명 정도 뽑아서 5000원 정도의 지원금을 지급합니다. 조건도 일주일에 1회 스터디 참여로 부담 없을 거에요. 두번째로는 정기적으로 카페의 커뮤니티 룸이나 공부할 수 있는 공간을 대여해서 공부도 하고 얘기도 할 수 있는 기회를 마련하려고 합니다. 세번째로는 언제가 될지 모르겠는데 여러 스터디나 관심사 소모임을 진행하려고 해요. 토익 공부, 코딩 공부, 자기 계발 같은 스터디 뿐만 아니라 취미나 친목 위주의 소모임을 포함합니다. ",
    date: "2023-11-14",
  },
  {
    id: "58",
    title: "스터디 멤버 비공개",
    category: "main",
    content:
      "스터디가 OPEN된 경우를 제외하고는 모든 스터디 신청자 프로필이 비공개 되었습니다. FREE 오픈이나 CLOSED의 경우, 신청자끼리만 서로 프로필이 공개됩니다. 서로 친구 등록이 되어있는 경우에는 모든 경우세서 서로를 확인할 수 있습니다.",
    date: "2023-11-17",
  },
  {
    id: "59",
    title: "친구 기능 설명",
    category: "update",
    content:
      "상대의 프로필 페이지에서 친구 요청과 해제가 가능합니다. 해당 요청은 상대방이 활동 알림에서 수락 또는 거절을 할 수 있으며, 수락하는 경우 서로는 친구가 됩니다. 친구 등록이 되어있는 경우 스터디에서 프로필 공개, 스터디 추가 포인트, 좋아요 전송 등을 포함해 앞으로도 여러 기능을 개발할 예정입니다. 친구 목록은 내 프로필 카드나 마이페이지에서 확인이 가능합니다.",
    date: "2023-11-17",
  },
  {
    id: "60",
    title: "친구/좋아요 숫자 공개",
    category: "update",
    content:
      "프로필 페이지에 친구 숫자나 받은 좋아요 숫자가 표시됩니다. 다른 인원은 숫자만 확인이 가능하고 상세 내용은 확인이 불가능합니다. 좋아요는 스터디에 같이 참여한 경우나 생일인 인원, 친구인 인원에게 하루에 최대 1회 보낼 수 있습니다.",
    date: "2023-11-17",
  },
  {
    id: "61",
    title: "수원 지역 스터디 장소 변경",
    category: "sub",
    content:
      "망포역 커피빈 → 망포역 스타벅스, 행궁동 본지르르 → 평일 유지. 주말에는 행궁 81.2로 변경.",
    date: "2023-11-19",
  },
  {
    id: "62",
    title: "스터디 장소 추가 관련",
    category: "main",
    content:
      "스터디 장소는 언제든 추천을 받고 있습니다. 괜찮은 장소가 있다면 마이페이지에서 신청해 주세요! 다만 활동 지역을 크게 벗어나는 곳은 채택이 어렵고, 기존에 스터디 장소가 존재하는 구역이면 두 카페를 비교해서 하나만 채택합니다.",
    date: "2023-11-19",
  },
  {
    id: "63",
    title: "알파벳 교환 기능 업데이트",
    category: "update",
    content:
      "알파벳 교환이 가능해졌습니다! 마이페이지에서 확인할 수 있고, 다만 친구끼리만 교환이 가능합니다.",
    date: "2023-11-29",
  },
  {
    id: "64",
    title: "11월 말 공지사항",
    category: "main",
    content:
      "웹사이트는 지속적으로 업데이트 되고 있습니다. 1) 홍보 이벤트 당첨자 선별을 종강때로 연장(현재 당첨률 33%) 2) 시험기간 중 이벤트 진행 3) 정기 스터디를 진행해보려고 하는데, 많은 참여 바람 4) 방학중에는 소모임을 작게나마 시작해보려고 함(영어 공부, 프로젝트, 게임 등) 5) 방학중에는 정말 스터디 활동을 최소한의 강제성을 둘 것임(추방) 6) 다들 활동 조금만 더 열심히 해주시면 감사할 거 같아요. 동아리 건의사항 있으면 모두 잘 반영할게요^ㅡ^ 12월도 파이팅 ~ !",
    date: "2023-11-29",
  },
  {
    id: "65",
    title: "점수 부분 초기화 공지",
    category: "main",
    content:
      "점수 획득이 출석체크(스터디, 개인스터디)로만 얻을 수 있게 변경되면서 기존 점수에 대한 부분 초기화가 진행되었습니다. 점수는 기존의 1/10으로 전환되었습니다. 추가로 배지의 획득 순서가 바뀌고, 신규 배지 '유스베리'가 생겼습니다.",
    date: "2023-12-01",
  },
  {
    id: "66",
    title: "보증금 일부 초기화 공지",
    category: "main",
    content:
      "보증금이 2000원 미만이었던 인원들의 보증금을 2000원으로 리셋시켰습니다. 이제는 정말 보증금 0원이 되면 동아리 활동이 불가능해지고, 탈퇴처리됩니다.",
    date: "2023-12-02",
  },
  {
    id: "67",
    title: "시험기간 이벤트",
    category: "event",
    content:
      "이번주 동안 시험기간 이벤트를 진행했습니다. 당첨되신 분들은 모두 축하하고, 아쉽게 당첨되지 못한 분들도 더 파이팅해서 남은 시험기간 잘 치루시길 바라요!",
    date: "2023-12-09",
  },
  {
    id: "68",
    title: "방학 중 소모임(스터디) 오픈 예정",
    category: "main",
    content:
      "이번 겨울 방학 시즌에는 스터디/소모임을 진행합니다! 스터디를 운영해주시는 분께는 5만원 정도 상당의 사례금을 드리고, 열심히 참여하는 멤버분들한테도 소소한 상품이 있을 예정입니다. 아직 어떤 소모임들을 열지는 확정되지 않아서 어떤 분야에 다들 관심이 있으신지 사전 희망 조사를 진행하겠습니다! 추가로 진행하고 싶은 스터디가 있다면 항목 추가도 가능합니다. 인접 지역을 포함해서 인원이 충분히 모이고, 스터디를 운영해주실 분이 있는 경우에 개설됩니다. 단톡방에서 신청을 받고 있으니 관심있는 분야에 투표해주세요~!",
    date: "2023-12-10",
  },
  {
    id: "69",
    title: "홍보 이벤트 당첨자 발표일",
    category: "event",
    content:
      "이번 홍보 이벤트 당첨자는 22~24일 사이에 3명을 뽑아서 치킨 기프티콘을 드리겠습니다! 현재 당첨률이 무려 43%더라고요...! 당첨되지 않더라도 100 ~ 300 포인트의 리워드가 있으니 많은 참여 부탁드려요!",
    date: "2023-12-12",
  },
  {
    id: "70",
    title: "웹사이트 로딩 속도 관련",
    category: "sub",
    content:
      "최근에 웹사이트 로딩과 버퍼링이 비정상적으로 많이 느려져 있었습니다,,, 이제 어느 정도 해결해서 속도가 많이 개선되었습니다.",
    date: "2023-12-13",
  },
  {
    id: "71",
    title: "수원/강남 펭귄 핫팩",
    category: "event",
    content:
      "갑자기 날씨가 많이 추워졌네요 ㅠ 12월간 스터디든 모임이든 저랑 만나면 펭귄 핫팩을 하나씩 드립니다 ㅎ-ㅎ",
    date: "2023-12-16",
  },
  {
    id: "72",
    title: "양천 화곡역 투썸플레이스 추가",
    category: "update",
    content: "장소가 추가되었습니다.",
    date: "2023-12-30",
  },
  {
    id: "73",
    title: "그룹 스터디 시작",
    category: "main",
    content:
      "그룹스터디(소모임) 편성 및 개설이 모두 완료되었습니다. 이후에도 언제든 관심있는 소모임에 참여할 수 있으니 환영합니다! 다들 이번 겨울 동안 원하는 바를 모두 이루길 바라요!",
    date: "2023-12-30",
  },
  {
    id: "74",
    title: "동아리 체계 변경",
    category: "main",
    content:
      "동아리 운영 방식과 체계를 소그룹 중심으로 변경합니다. 운영진을 포함해 10여명으로 구성되고, 이는 동아리 전체 인원이 많다보니 적응하고 다른 인원과 교류할 기회를 마련하기 위함입니다! 또한 출석관리나 공지사항도 소그룹 위주로 전달하게 될 거 같고, 앞으로는 미참여 인원에 대해서 규칙을 철저하게 하겠습니다!",
    date: "2023-01-12",
  },
  {
    id: "75",
    title: "월간 공지(스터디 장소 추가)",
    category: "main",
    content:
      "수원 - 경기대 워터쿨러, 양천 - 목동점/발산역 스타벅스, 동대문 - 화랑대역 마르티. 스터디 장소 추천을 받아서 추가했습니다. 추가적으로 월간 출석체크는 단톡방에서 공지하도록 하겠습니다. 미참여 인원은 벌금이 부여되고, 특별한 사유로 인한 휴식을 제외하고 2달 연속 미참여는 추방됩니다. + 리모델링을 또 한번 준비중이라 최근에 운영 관련 공지는 많이 안하고 있습니다. 개강하면 또 몇가지 바뀔 수 있어요!",
    date: "2023-02-05",
  },
  {
    id: "76",
    title: "카카오 브라우저 접속 방식 변경",
    category: "main",
    content:
      "카카오톡에서 url로 접속시 인앱 브라우저에서 외부 브라우저로 이동하도록 변경했는데, 혹시 불편한점이 있으면 건의해주세요!",
    date: "2023-02-08",
  },
  {
    id: "77",
    title: "소그룹 관련 공지",
    category: "sub",
    content:
      "방학동안 소그룹 스터디 시작했던 것들은 처음이라 시행착오도 많았고, 솔직히 제대로 진행되지 않은채 애매하게 끝난 모임이 더 많은데요...ㅠㅠ 아쉬움이 남지만 다음에는 더 제대로 진행될 수 있도록 해볼게요! 아직 잘 진행되고 있는 스터디들은 그대로 남겨뒀고, 나머지는 '완료된 모임'으로 분류를 변경했습니다. 소그룹 스터디와 조금 헷갈렸던 지역별 소그룹 모임도 현재 2달차에 접어들고 있어 한달 정도 더 지속될 예정인데요. 소그룹 스터디와 같이 합칠 예정이라 조만간 소그룹 페이지에서 본인 그룹을 확인할 수 있게 될 거예요. 또한 선택적 참여로 바꿀지도 고민중이긴 합니다.",
    date: "2023-02-29",
  },
  {
    id: "78",
    title: "중요 업데이트 공지",
    category: "update",
    content:
      "동아리 사이트 리모델링이 거의 끝났습니다! 여러 컨텐츠가 활성화되었고, 디자인 뿐만 아니라 기능도 많이 개선되었습니다. 접속시 재로그인이 필요할거고 혹시 이용중에 오류나 불편사항이 있다면 제보해주시면 감사하겠습니다! 중요하게 알아야 되는 점만 몇가지 언급하면 스터디 투표할 때 룰렛을 통한 시간 선택이 자연스러워 졌고(슬라이드 및 시간 터치도 가능), 개인스터디 인증 사진 올린 건 전체로 공개됩니다. 이벤트 페이지가 새로 생겼고, 랭킹 페이지, 마이페이지가 변경되었습니다. 그 외에는 별도로 언급은 안할게요! 출석체크 및 이벤트 스토어 당첨자 분들은 상품 모두 지급해드렸는데 혹시 못 받은게 있다면 말씀해주세요! (츄파츕스 당첨은... 애매해서 따로 보내지는 않았는데 원하시면 보내드림 ㅎ...) 또한 오랜만에 스토어에 상품이 새로 입고되었습니다!",
    date: "2023-02-29",
  },
  {
    id: "79",
    title: "중요 할 말",
    category: "main",
    content:
      "동아리가 만들어진지도 어느덧 1년이 넘어가는데요. (스터디로는 2~3년...?) 동아리의 궁극적인 목적은 카공을 통한 개인 공부뿐만 아니라, 근처에 사는 다른 분들을 만나 인연도 만들고, 여러 활동들을 통해 추억도 남기는 것에 있습니다. 대학생 신분에서 공부도 중요하고, 한번뿐인 대학 생활도 중요한테 둘 다 같이 이룰 수 있지 않을까 하는 생각으로 만들었던 거 같아요. 아무쪼록 이제 곧 개강인데 다들 더 파이팅 하시고! 동아리 활동도 자주 참여할 수 있었으면 좋겠습니다! (동아리원 분들께 참여율로 벌금 주고, 경고 주고 하는거 정말 안하고 싶어요...) ",
    date: "2023-02-29",
  },
  {
    id: "80",
    title: "인천 지역 오픈",
    category: "sub",
    content: "인천 지역이 이번주중에 오픈합니다.",
    date: "2023-03-20",
  },
  {
    id: "81",
    title: "스터디 알림 시간 변경",
    category: "main",
    content:
      "스터디 결과 발표 시간을 예전처럼 오후 11시로, 투표 알림 시간도 오후 2시, 6시로 변경합니다. ",
    date: "2023-03-20",
  },
  {
    id: "82",
    title: "수원/인천 스터디 장소 추가 및 변경",
    category: "sub",
    content: "수원 - 광교 디어커피 추가 / 인천 - 신규 스터디 지역 5곳 추가",
    date: "2023-03-21",
  },
  {
    id: "83",
    title: "스터디 관련 개선사항",
    category: "main",
    content:
      "기존에 스터디 투표 UI가 불편한점이 많고, 처음하는 분들은 난감해하는 경우도 많아서 여러가지로 개선되었습니다. 또한 추천 2지망 장소의 거리가 조금 멀다고 느껴져서 추천 장소 알고리즘을 더 가까운 장소가 매칭되도록 개선하였습니다. 기타 사항으로는 동아리 가이드와 스터디 장소가 추가되었습니다.",
    date: "2023-03-28",
  },
  {
    id: "84",
    title: "동아리 전체 OT",
    category: "main",
    content:
      "4월 5일과 4월 6일에 동아리 전체 OT를 진행합니다! 관련사항은 각 지역 공지방에서 확인할 수 있습니다.",
    date: "2023-03-29",
  },
  {
    id: "85",
    title: "4월 월간 공지",
    category: "main",
    content:
      "이틀에 걸쳐 동아리 전체 OT를 성공적으로 모두 마쳤어요! 이틀 모두 너무 재밌었습니다 ㅎㅎ!! 이제 곧 시험 기간이라 4월 중에는 공식적인 술자리는 없고, 정기 스터디가 2회 정도 진행 될 예정입니다! 또한 홍보 이벤트, 스토어 당첨, 출석 등 스토어 깊티부터 크게는 2만원 상당의 치킨까지 당첨자가 발표됐어요! 그외 추가 공지는 단톡방에서 진행할게요!",
    date: "2023-04-08",
  },
  {
    id: "86",
    title: "스터디 장소 추가 공지",
    category: "update",
    content:
      "수원: 경희대 칸나, 양천: 당산역 에이바우트, 동대문: 경희대 에이바우트, 회기역 READSTREET 이렇게 4 장소가 추가되었습니다. 몇가지 비활성화된 장소도 있으니 참고해주세요! 스터디 장소 추천은 언제든 마이페이지에서 할 수 있습니다. ",
    date: "2023-04-15",
  },
  {
    id: "87",
    title: "시험기간 이벤트",
    category: "event",
    content:
      "시험기간 동안 두가지 컨텐츠와 이벤트를 진행합니다. 첫번째는 핸드폰을 멀리하고 공부 시간을 측정해주는 열품타를 이용하고, 두번째는 매주 2회 정도 디스코드에서 캠스터디를 진행합니다. 각 컨텐츠 모두 상품이 있고 자세한 내용은 톡방에서 공지할게요!",
    date: "2023-04-15",
  },
  {
    id: "88",
    title: "시험기간 추가 이벤트",
    category: "event",
    content: "시험기간 동안 힘내라고 각 지역 톡방에서 기프티콘을 뿌려요! 선착순 당첨입니다 ㅎㅎ",
    date: "2023-04-22",
  },
  {
    id: "89",
    title: "NEW 소그룹",
    category: "main",
    content:
      "지역별 친목 소그룹은 동일 지역의 구성원들끼리 주기적으로 만나 친목을 도모할 수 있는 모임입니다. 기존에 진행했던 1회차 소그룹은 오늘부로 모두 활동이 끝났고, 개선해야 할 점을 보완해서 새롭게 진행합니다. 앞으로는 필수로 참여 할 필요가 없고, 정말 활동을 할 인원들만 받아서 운영진을 주축으로 진행됩니다. 상세 내용은 단톡방에 공지하겠습니다.",
    date: "2023-04-29",
  },
  {
    id: "90",
    title: "조모임 진행",
    category: "main",
    content:
      "조모임은 신청자들의 지역, 나이, 성별, 희망 사항 등을 고려해서 조를 매칭하고, 6~8인의 조별로 모임을 진행하게 되는 컨텐츠입니다. 작년 9월에 처음 시작했는데 반응이 좋았어요! 누가 나올지 모른다는 부담없이 재밌는 모임 가져봐요! 상세 내용은 단톡방에서 공지하겠습니다.",
    date: "2023-04-29",
  },
  {
    id: "91",
    title: "스터디 장소 추가 및 변경",
    category: "main",
    content:
      "수원역 탐탐에서 엔제리너스로 변경. 송도 컨벤션DT 스타벅스점 추가. 동대문 노원역 투썸 추가. 동대문 수유역 엔제리너스 추가. 기타 기존에 추가되었지만 페이지 접속이 안됐던 오류 수정.",
    date: "2023-05-05",
  },
  {
    id: "92",
    title: "대규모 업데이트 공지",
    category: "main",
    content:
      "동아리 어플이 출시되었습니다! 웹사이트에서 '홈 화면에 추가' 버튼을 찾아 누르시면 앱으로 설치가 되는데요! 1차 출시일은 6월 2일이라 아직 추가 될 부분들이 있어서 이후 서비스 가이드 영상과 함께 공지할 수 있도록 하겠습니다.",
    date: "2023-05-31",
  },
];
