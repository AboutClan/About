import { LocationFilterType } from "../types/services/locationTypes";

export interface IReviewData {
  id: number;
  dateCreated: string;
  images: string[];
  text?: string;
  title?: string;
  place?: LocationFilterType;
  writer?: string;
}

export const REVIEW_DATA: IReviewData[] = [
  {
    id: 1,
    dateCreated: "5월 26일",
    images: [
      "https://user-images.githubusercontent.com/84257439/242179172-dc4938a6-7902-4ea5-b3a9-1c44f15f1d77.jpg",
      "https://user-images.githubusercontent.com/84257439/242162595-d3b92717-2e92-4039-b17c-d0d53cdefdf6.png",
      "https://user-images.githubusercontent.com/84257439/242162735-723518e7-6c1c-4ce9-9ebb-0d99dd593953.jpg",
      "https://user-images.githubusercontent.com/84257439/242358117-ec452433-361b-4708-8575-e8b1a1ff742d.jpg",
      "https://user-images.githubusercontent.com/84257439/242466281-39e2eef3-c450-443b-bfc2-980470e0dc00.jpg",
      "https://user-images.githubusercontent.com/84257439/242162770-c68c8380-39f3-4483-ad61-e28fe29338a4.jpg",
    ],
    text: `5월 26일, 수원시청역 인근 파티룸을 대관해서 정기모임을 진행했어요!🥰 50명이 넘는 인원이 신청을 해주셨지만 아쉽게도 30여명만 받아서 진행했답니다 ㅠ  20대 초반부터 중후반까지 나이대가 다양하게 있다보니, 또래끼리 빨리 친해지길 바라는 마음으로 사전에 조를 짜서 진행했어요! 나이, 성별, 요청사항 등 여러가지를 고려해서 말이에요. 초면인 사람들이 많다보니 다들 금방 친해지고 괜찮은 진행방식 이었던 거 같아요 ㅎㅎ (다음에도 이렇게 해 봐야지) 조가 여러개 있다보니, 조마다 분위기가 다 달랐던 거 같아요. 보드게임 하는 팀도 있고, 노래방, 홀덤, 진대, 그냥 술 드시는 팀 등...! 1차팀에서 2차팀으로 이동하기 전에 단체 사진을 한번 찍었어요. 사진 나오기 싫은 사람들은 알아서 잘 숨으라고 했더니 다들 정말 잘 숨어서 보이지도 않네요. 보드게임이랑 노래방도 특히 핫 했던 거 같아. 그리고 노래 잘 부르시는 분들이 정말 많았어요. (깜짝 놀랐음) 사람들 좀 집에 가고 나면 한병 있던 엑세레이티드 술을 까려고 했는데, 새벽 2시 넘어서야 10여명이 되더라고요! 야식으로 족발에 보쌈을 시켜서 같이 맛있게 먹고 밤 샌 뒤에 집에 귀가 ! 아무쪼록 정말 재미있던 모임이었습니다. 다들 다음에 또 봬요~!
    `,
    title: "수원 파티룸 정기모임",
    place: "수원",
  },
  {
    id: 2,
    dateCreated: "6월 9일",
    images: [
      "https://user-images.githubusercontent.com/84257439/245070814-13b64848-adc9-4cd8-ad87-b210838e413e.jpg",
      "https://user-images.githubusercontent.com/84257439/245070827-73c7765f-487f-4343-b4b5-f6bf2efc2507.jpg",
      "https://user-images.githubusercontent.com/84257439/245070832-f0dafd76-3dc7-4f76-b93e-e35aa34e0bdb.jpg",
    ],
    text: "6월 9일, 무제한 칵테일 바 번개. 시간 가는 줄 몰랐던 번개모임 이었습니다 ㅎㅎ",
    title: "칵테일 번개",
    place: "수원",
  },
  {
    id: 3,
    dateCreated: "6월 16일",
    images: [
      "https://user-images.githubusercontent.com/84257439/246738782-d0c6e638-5138-4b37-80d4-6456d290291a.jpg",
      "https://user-images.githubusercontent.com/84257439/246738794-b5c714a4-55ff-4990-9fed-29b7a3c096b2.jpg",
    ],
    text: "양천구 두번째 정기모임! 홍대에서 보드게임이랑 뒤풀이를 진행했습니다 ★ 원래 8명씩 두 테이블을 예약했었는데 테이블이 생각보다 넓어서 한 곳에서 같이 놀았어요! 다 같이 놀면 좋겠다는 생각에 조용한 룸술집으로 예약했는데 초면인 사람들도 많다보니 형성되는 어색어색한 분위기에 중간중간 웃음이 나왔지만... 술이 들어가다 보니까 또 재밌게 놀았어요 ㅎㅎ 절반 정도는 3차까지 가서 새벽까지 놀았다는데 무서운 사람들",
    title: "양천구 2차 정기모임",
    place: "양천",
  },
  {
    id: 14,
    dateCreated: "6월 30일",
    images: [
      "https://user-images.githubusercontent.com/84257439/250274299-c0788f54-9fbc-40db-ae7e-02e3220d4bef.jpg",
      "https://user-images.githubusercontent.com/84257439/250274300-a63e0be7-6503-4702-a465-2555dfae29b3.jpg",
      "https://user-images.githubusercontent.com/84257439/250274301-24fb04b5-b926-45b0-a076-cb4a865fee8e.jpg",
      "https://user-images.githubusercontent.com/84257439/250274303-4043b8e6-0195-4a77-bfaf-936fc9845cf4.jpg",
    ],
    text: "너무 열심히 놀아서 힘들었던 번개모임... 양천구는 항상 3차 이상까지 이어지는 경우가 많은 거 같아요. 일 끝나고 오시는 분들도 많다보니! 수원에 사는 저는 항상 2차가 끝나면 집에 가서 뭐 하고 노는지는 모르겠지만요 ㅎㅎ... 보드게임도 술자리도 모두 다른 의미로 쉽지 않았지만 즐거운 모임이었습니다!",
    title: "불타는 금요일",
    place: "양천",
  },
  {
    id: 17,
    dateCreated: "6월 30일",
    images: [
      "https://user-images.githubusercontent.com/84257439/250282485-f027b035-8ca4-4ed2-9a10-9e533aeb5bb9.jpg",
      "https://user-images.githubusercontent.com/84257439/250282148-1b21f61d-ffce-49ec-8ed7-b97e24435d07.jpg",
      "https://user-images.githubusercontent.com/84257439/250282159-1638d7c6-7773-46d3-9912-2989da434c89.jpg",
    ],
    text: "소소하게 집들이를 했는데 재밌게 놀았어요 ㅋㅋㅋ 삼겹살, 목살, 비빔면, 불닭 등 맛있게 먹었는데... 집에 있던 고기랑 친구가 집에서 가져온 고기로 먹어서 가성비 쵝오... 오늘 폭염주의보가 뜰 정도로 밖에가 엄청 덥더라구요. 집에서 한발짝도 안나가고 에어컨 틀고 보드게임하고 티비보고 뒹굴거림. 저는 제가 할리갈리를 못한다고 생각하고 있었는데 같이 온 다른 두분 더 못함 ㅋ 나 정도면 고수인듯. 도전자 받을게요.",
    title: "소소한 집들이 번개",
    place: "수원",
  },
  {
    id: 15,
    dateCreated: "7월 8일",
    images: [
      "https://user-images.githubusercontent.com/84257439/252233983-bf00efd0-4d81-479f-acb0-60c7faa2d942.jpg",
    ],
    text: "언제부턴가 수원 정기모임을 파티룸에서만 진행하고 있는 거 같아요! ㅋㅋㅋㅋ 항상 룸으로 나눠지는 곳만 가다가 이번에는 탁 트인 곳으로 갔는데, 장단점이 있었던 거 같아요! 가벼운 느낌으로 같이 노는 분위기인 대신에 오랫동안 얘기를 하지는 못해서 조금 아쉬웠달까... 그래도 술도 먹고, 포켓볼, 보드게임, 노래방 등 여러가지 하면서 재밌었습니다! ㅎㅎㅎ  ",
    title: "수원 파티룸 정기모임",
    place: "수원",
  },
  {
    id: 29,
    dateCreated: "7월 16일",
    images: [
      "https://user-images.githubusercontent.com/84257439/254543410-eb71f96e-e806-4f40-a05b-f872378f9f33.jpg",
      "https://user-images.githubusercontent.com/84257439/254543437-efae8f20-9bfc-445f-aa7b-cf89896dbc6c.jpg",
      "https://user-images.githubusercontent.com/84257439/254543446-b5533b6b-6bcc-4b5d-8422-1777325dc25c.jpg",
    ],
    text: "사진 찍는 걸 계속 깜박해서 ... 이상한 사진 밖에 남은 게 없더라구요... 리뷰에 쓸 사진이 없다. 점심으로 연어 초밥이랑, 대왕 유부초밥을 먹고, 거실에서 얘기도 하고, 보드게임도 하고, 정체를 알 수 없는 하이볼도 마시고(레시피 없이 내 맘대로 했다가 폭망...), 낮부터 밤까지 집에서 재밌게 놀았습니다 ㅎㅎ 달무티도 정말 재밌게 했어요 !",
    title: "수원 홈파티",
  },
  {
    id: 10000,
    dateCreated: "7월 18일",
    images: [
      "https://user-images.githubusercontent.com/84257439/254543546-dc941f45-03b0-4c4f-9920-973222b54561.jpg",
      "https://user-images.githubusercontent.com/84257439/254543534-3eb3d025-f4ac-4172-8250-c7b401223fc5.jpg",
      "https://user-images.githubusercontent.com/84257439/254543509-1a99ad49-5679-4515-9415-8fb09dbbdc95.jpg",
    ],
    text: "번개는 아니옶고... 스터디 끝나고 놀러갔는데 가끔은 이런 모임 후기 올리는 것도 좋을 거 같아서 ㅎㅎ 다들 점심때부터 저녁 전까지 열심히 공부를 하고 저녁으로 치킨을 먹으러 갔어요! 치킨에는 맥주가 빠질 수 없잖아요?! 치킨도 너무 맛있어서 술이 잘 들어가더라고. 맥주에 소주까지 마셨답니다! 끝나고는 노래방을 갔어요. 저희 동아리에는 가왕 서유진님이 있거든요! 노래방에서 몇 시간 있다가 저는 힘들어서 집에 갔는데 남은 인원은 또 술을 마시러 갔다고 해요. 대단한 사람들... 이러고 다음 날에 멤버 그대로 스터디에 일찍부터 또 나왔답니다 ^^...",
    title: "그냥 스터디 이후 놀러감",
    place: "수원",
  },
  {
    id: 30,
    dateCreated: "7월 22일",
    images: [
      "https://user-images.githubusercontent.com/84257439/258633961-6abb3f44-ad04-49d5-af78-8fc671ad74bd.jpg",
      "https://user-images.githubusercontent.com/84257439/258633963-d3295aac-30da-4442-ac67-bb304aa0d247.jpg",
    ],
    text: "",
    writer: "재욱",
    title: "양천 정기모임",
  },
  {
    id: 38,
    dateCreated: "7월 29일",
    images: [
      "https://user-images.githubusercontent.com/84257439/258634102-c952777d-af37-47cb-956c-473606bfecae.jpg",
      "https://user-images.githubusercontent.com/84257439/258634104-c374d425-5355-4cd8-8b7a-11329a843802.jpg",
    ],
    text: "",
    title: "수원역 번개",

    writer: "김석훈",
  },
  {
    id: 40,
    dateCreated: "8월 4일",
    images: [
      "https://user-images.githubusercontent.com/84257439/258634206-4642ab30-7af4-4c73-8f88-632f3db05423.jpg",
    ],
    text: "엽떡에서 새로 나온 마라떡볶이... 기대하고 갔는데 기대를 저버리지 않는 역시 존맛 ㅜ 가위바위보로 주먹밥 만들 사람 정했는데 두번 다 걸려서 주먹밥 말고 있었음. 아무튼 다음에는 오리지널로 먹어야지 진짜 추천함!",
  },
  {
    id: 52,
    dateCreated: "8월 5일",
    images: [
      "https://user-images.githubusercontent.com/84257439/258634458-563a4584-d6d6-4cb2-a851-4f5205748ccb.jpg",
      "https://user-images.githubusercontent.com/84257439/258634461-a0f853fb-2f13-4ff6-bfed-8d56b63e1f94.jpg",
      "https://user-images.githubusercontent.com/84257439/258634464-56e6eadc-bfa9-432f-b1fb-10805e3b8ec9.jpg",
      "https://user-images.githubusercontent.com/84257439/258634468-b1de4aa0-63c3-4587-8c08-05b83f72f57b.jpg",
    ],
    text: "토요일 오후 늦게 영화관람으로 시작된 번개~! 영화는 투표해서 다 같이 극장판 코난 보러 갔는데 오랜만에 보니까 재밌더라구요🤭 2차는 저녁 먹고 보드게임 카페 가서 즐겁게 놀았습니당🎲 역시 서로의 신뢰를 쌓는 게임으로는 <선물입니다> 만한 게 없죠!🫡 3차로 영통 최고 아웃풋 아쿠아라운지 가서 칵테일 마시면서 얘기하고 놀고 마무리로 코노까지 갔어요 !.! 🍸🎤 영통도 은근 재미난 동네랍니당 다들 많이 놀러오세요~~😉",
    title: "토요일 영화보고 보드게임",

    writer: "서유진",
  },
  {
    id: 50,
    dateCreated: "8월 9일",
    images: [
      "https://user-images.githubusercontent.com/84257439/260235052-4262a4d3-5e69-463a-89a0-2746e0722be6.jpg",
      "https://user-images.githubusercontent.com/84257439/260235051-796e3568-c11b-4044-b747-0f283d36bb55.jpg",
      "https://user-images.githubusercontent.com/84257439/260235050-98d2c259-c799-473a-84ea-025f168bc300.jpg",
      "https://user-images.githubusercontent.com/84257439/260235046-4fb986ad-22c8-49b4-9d27-843431e2ecc2.jpg",
    ],
    text: "홍대 진격의거인 전시회 같이가요 ^ ~ ^",

    writer: "서유진",
  },
  {
    id: 39,
    dateCreated: "8월 12일",
    images: [
      "https://user-images.githubusercontent.com/84257439/260235228-a8f51260-08f2-415c-849a-6dd77c1cc924.jpg",
      "https://user-images.githubusercontent.com/84257439/260235229-6408664c-8ebd-4483-9d38-a399be934e45.jpg",
    ],
    text: "사진을 1차밖에 못 찍었어요... 1차가 끝났을 때 저는 죽어있었거든요... 택시타고 도망갔답니다. 뭐 아무튼 새로운 분들도 많이 오고, OB(?)라고 해야하나 초기 멤버 분들도 오랜만에 많이 와서 재밌었던 모임이었습니다 :)",
    title: "여름방학 마지막 정기모임",
  },
  {
    id: 61,
    dateCreated: "8월 17일",
    images: [
      "https://user-images.githubusercontent.com/84257439/262350984-f4c2472f-4ed2-4a82-ab53-60d956863b94.jpg",
      "https://user-images.githubusercontent.com/84257439/262351015-b0ed304b-08f7-461d-97eb-20c02e366a18.jpg",
    ],
    text: "휴일이니까 놀아야지! 인원이 많다보니 더 재밌게 할 수 있는 보드게임들이 있거든요! 재밌게 놀고 뒤풀이하고 헤어졌습니당",
    title: "광복절 보드게임 번개",
  },
  {
    id: 60,
    dateCreated: "8월 20일",
    images: [
      "https://user-images.githubusercontent.com/84257439/262351038-804a7392-a91a-4901-905d-dd31364a56ca.jpg",
      "https://user-images.githubusercontent.com/84257439/262351111-240d33cb-0fdf-4f25-b4ee-34fa453aea63.jpg",
      "https://user-images.githubusercontent.com/84257439/262351036-9e163547-bf1c-49e6-ad98-5408f5e2f9d2.jpg",
    ],
    text: "이게 되나 싶었던 PC방 번개! 크아를 하기 위해 PC방에서 모였어요! 이게 뭐라고 웃으면서 몇시간 동안 재밌게 했네요. 크아가 끝나고는 덕몽어스를 했는데 혹시 아시나요?! 어몽어스랑 비슷한 마피아 게임인데, 직업이 많아서 더 재밌어요 ㅎㅎ 다 같이 사진도 찰칵",
    title: "PC방에서 게임 번개!",

    writer: "윤경",
  },
  {
    id: 28,
    dateCreated: "8월 22일",
    images: [
      "https://user-images.githubusercontent.com/84257439/262351141-504ef563-5881-4eb0-bb03-8989c3017451.jpg",
      "https://user-images.githubusercontent.com/84257439/262351125-d1d9c2d8-5d32-4c2c-a831-e3f59f43e02f.jpg",
      "https://user-images.githubusercontent.com/84257439/262351134-89d74ce7-23ff-4abe-89e2-ff0d8f0275e4.jpg",
      "https://user-images.githubusercontent.com/84257439/262351144-ffdbcd9d-8789-4f74-ada3-a02d3ce80440.jpg",
    ],
    text: "8월 양천구 스터디 엠티😎 청평역에서 도보로 이동 가능하고 앞에 강도 끼어있는 펜션으로 첫 엠티를 갔습니다‼ 펜션 안에 노래방 기계가 있어서 다들 한 곡씩 마 노래도 하고! 고기도 구워먹고! 게임도 하고 마 다했서!!!!! 마트팀,, 고기사장님들,, 게임진행자,, 안주요리사분들 총무총괄분들 다들 수고 많았읍니다. 덕분에 풍성한 엠티가 되었어요〰〰 곰세마리와 관람차 지옥에 빠져서 잔뜩 술을 드신 모든 분들도 수고하셨습니다. (저는 먹고 즐기기만 했지만) 다음에 또 놀러가요!!!!! 스터디에서도… 자주 봅시다🙃 다들 개강하고… 자주 나오실거라 믿어 의심치 않습니다… (저도 열심히 나가보겠읍니다🤓)",
    title: "양천 여름 MT",

    writer: "찬민",
  },
  {
    id: 62,
    dateCreated: "8월 23일",
    images: [
      "https://user-images.githubusercontent.com/84257439/266530760-c9211cd5-5406-4dbe-8726-351f0710c240.jpg",
      "https://user-images.githubusercontent.com/84257439/266530731-c72566b7-5c14-46b0-9bf3-67da6f503307.jpg",
      "https://user-images.githubusercontent.com/84257439/266530804-00801ca4-e739-45fe-9c33-e40e2fa63f37.jpg",
      "https://user-images.githubusercontent.com/84257439/266530786-6e61ea82-92df-4f25-9635-f7a65e7411fa.jpg",
    ],
    text: "",

    writer: "최지아",
  },
  {
    id: 64,
    dateCreated: "8월 25일",
    images: [
      "https://user-images.githubusercontent.com/84257439/266534122-ee0f4627-25cb-48ea-8b9c-faee32e7c723.jpg",
      "https://user-images.githubusercontent.com/84257439/266534132-8dd6f018-4786-49d7-b487-15e087d4e8d1.jpg",
      "https://user-images.githubusercontent.com/84257439/266534135-c12d76bf-c79f-4c65-992e-780b8c31c927.jpg",
    ],
    text: "비 오는날 초가집에서 감성있는 막걸리 번개. 도토리묵이랑 막걸리가 특히 맛있었어요 ㅎㅎ",
  },
  {
    id: 10001,
    dateCreated: "10월 2일",
    images: [
      "https://user-images.githubusercontent.com/84257439/271972590-35d30eb1-126d-4462-aa09-3e194c428e1e.jpg",
      "https://user-images.githubusercontent.com/84257439/271972604-d45bc71c-ad56-4b0c-8bda-21cfb7fb788d.jpg",
      "https://user-images.githubusercontent.com/84257439/271972631-f696057b-f482-428a-9f51-5147e89134da.jpg",
      "https://user-images.githubusercontent.com/84257439/271972579-f46cb13b-b9c3-4726-b3f3-2347f4cea353.jpg",
      ,
    ],
    title: "수원 조모임 A,E",
    text: "수원 조모임 A,E",
  },

  {
    id: 10003,
    dateCreated: "10월 2일",
    images: [
      "https://user-images.githubusercontent.com/84257439/271977064-e0c86716-ec3c-4107-a420-712834c5433d.jpg",
      "https://user-images.githubusercontent.com/84257439/271977041-c7583f00-5d68-49b7-9c86-4c6064d4bacc.jpg",
      "https://user-images.githubusercontent.com/84257439/271972601-1cb1178e-4ba6-4b72-b440-e28c973e9913.jpg",
    ],
    title: "수원 조모임 F, G",
    text: "수원 조모임 F, G",
  },
  {
    id: 10004,
    dateCreated: "10월 2일",
    images: [
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/%EC%A1%B0%EB%AA%A8%EC%9E%84/271978083-e4294333-6b0b-4ec3-b35f-d30f9c42d47f+(1).webp",
      "https://user-images.githubusercontent.com/84257439/271973650-b75cd620-5d50-4004-b940-cc7ad0bbf2a6.jpg",
    ],
    title: "강남 조모임",
    text: "강남 조모임",
  },
  {
    id: 10005,
    dateCreated: "10월 2일",
    images: [
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/%EC%A1%B0%EB%AA%A8%EC%9E%84/271978078-bb49b768-27a6-4acb-8c1b-4b7442529f56.webp",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/%EC%A1%B0%EB%AA%A8%EC%9E%84/271978061-4e192f9b-8b5b-4de8-a7e4-0d0ef9d673f2.webp",
      "https://user-images.githubusercontent.com/84257439/271978083-e4294333-6b0b-4ec3-b35f-d30f9c42d47f.jpg",
    ],
    title: "수원 조모임 B,C",
    text: "수원 조모임 B,C",
  },
  {
    id: 10006,
    dateCreated: "10월 2일",
    images: [
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/%EC%A1%B0%EB%AA%A8%EC%9E%84/271976398-86da4b7a-9811-4399-a6eb-3ba10053af8f.webp",
      "https://user-images.githubusercontent.com/84257439/271976421-d0a2cb5c-1959-4cb3-ae4f-014455df9879.jpg",
      "https://user-images.githubusercontent.com/84257439/271976402-779e7815-dedc-4d13-a4d1-45003133c997.jpg",
      "https://user-images.githubusercontent.com/84257439/271976409-73676f0d-75f6-4ca4-bd9f-2749e7c40f7a.jpg",
      "https://user-images.githubusercontent.com/84257439/271976418-7a018634-07ed-4b77-af49-507eb63faa5c.jpg",
    ],
    title: "양천 조모임 A,B,C",
    text: "양천 조모임 A,B,C",
  },
  {
    id: 72,
    dateCreated: "10월 2일",
    images: [
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/%EC%A1%B0%EB%AA%A8%EC%9E%84/271933759-39a5e429-493a-46d2-9179-0df6192dbb05.webp",
      "https://user-images.githubusercontent.com/84257439/271933797-f6c9bcd5-56be-4176-a536-5f6b9956561e.jpg",
      "https://user-images.githubusercontent.com/84257439/271933769-9724e866-74f6-4672-80c4-16e6e695368b.jpg",
      "https://user-images.githubusercontent.com/84257439/271933774-c1757b4a-86c4-4f04-981a-c13ce084ad01.jpg",
      "https://user-images.githubusercontent.com/84257439/271933800-8941e5fa-8e49-481d-8e98-5cfecc076b21.jpg",
    ],
    text: "저녁 같이 먹고 강남역에 있는 무제한 칵테일바에 갔어요! 안주 반입이 가능해서 편의점 과자랑 함께했답니다 ㅎㅎ 과자 사오라고 했더니 그들의 초이스는 뻥이요, 계란과자, 건빵... 어딘가 세대를 건너간 듯한 초이스지만 생각보다 너무 맛있더라고요! 초중반에는 칵테일만 먹었는데, 다 도수가 엄청 약하더라고요...! 끊임없이 계속 시켜서 사장님께 미안한 마음... 나중에는 그냥 샷으로 마셨어요 ㅎㅎ 토닉워터도 섞어서! 막차까지 게임도 하고, 얘기도 많이 하고 시간가는 줄 몰랐던 번개였습니당",
    title: "무제한 칵테일바 번개",
  },
  {
    id: 82,
    dateCreated: "10월 10일",
    images: [
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/%EC%88%98%EC%9B%90+10.9/KakaoTalk_20231010_045952391_02.webp",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/%EC%88%98%EC%9B%90+10.9/KakaoTalk_20231010_045952391.webp",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/%EC%88%98%EC%9B%90+10.9/KakaoTalk_20231010_045952391_01.webp",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/%EC%88%98%EC%9B%90+10.9/KakaoTalk_20231010_045952391_04.webp",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/%EC%88%98%EC%9B%90+10.9/KakaoTalk_20231010_045952391_06.webp",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/%EC%88%98%EC%9B%90+10.9/KakaoTalk_20231010_045952391_03.webp",
    ],
    text: "재밌었던 한글날 번개! 1차로 갔던 술집이 음식이 진짜 맛있었어요 ㅜㅜ 음식이 맛있으니까 술도 잘 들어가고 말도 잘 나오고 아무튼 다 재밌는거임. 이번에는 수원/안양 같이 열었던 거라 초면인 사람들이 더 많았는데도 너무 잘 놀았습니당. 다들 몇시까지 마신건지 모르겠지만 잘 들어가셨죠? 다음에 또 봐요!",
    title: "한글날 술 번개",
  },
  {
    id: 84,
    dateCreated: "10월 28일",
    images: [
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/%EC%88%98%EC%9B%90+10.28/KakaoTalk_20231031_173829100_01.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/%EC%88%98%EC%9B%90+10.28/KakaoTalk_20231031_173829100_02.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/%EC%88%98%EC%9B%90+10.28/KakaoTalk_20231031_173829100.jpg",
    ],
    text: "",
    title: "광교 술 번개",
    writer: "김지훈",
  },
  {
    id: 87,
    dateCreated: "10월 29일",
    images: [
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/10.29+%EA%B0%95%EB%82%A8+%EB%B2%88%EA%B0%9C/KakaoTalk_20231031_174933331.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/10.29+%EA%B0%95%EB%82%A8+%EB%B2%88%EA%B0%9C/KakaoTalk_20231031_173628666_01.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/%EC%88%98%EC%9B%90+10.28/KakaoTalk_20231031_173829100_02.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/10.29+%EA%B0%95%EB%82%A8+%EB%B2%88%EA%B0%9C/KakaoTalk_20231031_173628666_03.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/10.29+%EA%B0%95%EB%82%A8+%EB%B2%88%EA%B0%9C/KakaoTalk_20231031_173628666_04.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/10.29+%EA%B0%95%EB%82%A8+%EB%B2%88%EA%B0%9C/KakaoTalk_20231031_173628666_05.jpg",
    ],
    text: "강남에서 모인 술 번개! 이번에는 정말 초면인 사람이 많았는데도, 어색한 순간 없이 재밌는 모임이었어요! 놀다보니 막차를 놓친 사람들도, 겁나 뛰어서 막차를 겨우 탄 사람들도 있었는데 아쉬운 마음에 바로 다음 번개를 또 열었네요 ㅎㅎ",
    title: "시험 끝난 기념 강남 술 번개!",
  },
  {
    id: 71,
    dateCreated: "11월 4일",
    images: [
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/11.03+%EC%88%98%EC%9B%90/KakaoTalk_20231104_140640981_01.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/11.03+%EC%88%98%EC%9B%90/KakaoTalk_20231104_140640981.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/11.03+%EC%88%98%EC%9B%90/KakaoTalk_20231104_140640981_02.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/11.03+%EC%88%98%EC%9B%90/KakaoTalk_20231104_140640981_03.jpg",
    ],
    text: "",
    title: "아주대생 친목 모임",
  },
  {
    id: 94,
    dateCreated: "11월 4일",
    images: [
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/11.04+%EB%B2%94%EA%B3%84/KakaoTalk_20231105_143924081_01.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/11.04+%EB%B2%94%EA%B3%84/KakaoTalk_20231105_143924081.jpg",
    ],
    text: "",
    title: "범계역 번개 모임",
  },
  {
    id: 97,
    dateCreated: "11월 11일",
    images: [
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/11.11+%EC%88%98%EC%9B%90/KakaoTalk_20231117_162333882_03.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/11.11+%EC%88%98%EC%9B%90/KakaoTalk_20231117_162333882_02.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/11.11+%EC%88%98%EC%9B%90/KakaoTalk_20231117_162333882.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/11.11+%EC%88%98%EC%9B%90/KakaoTalk_20231117_162333882_01.jpg",
    ],
    text: "",
    title: "빼빼로데이 수원역 번개! (20대 초반)",
  },
  {
    id: 99,
    dateCreated: "11월 17일",
    images: [
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/11.17+%EC%88%98%EC%9B%90+%EC%A0%95%EB%AA%A8/KakaoTalk_20231119_190648380.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/11.17+%EC%88%98%EC%9B%90+%EC%A0%95%EB%AA%A8/KakaoTalk_20231119_190648380_01.jpg",
    ],
    text: "",
    title: "수원 정기 모임",
  },
  {
    id: 98,
    dateCreated: "11월 18일",
    images: [
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/11.18+%EC%96%91%EC%B2%9C+%EC%A0%95%EA%B8%B0%EB%AA%A8%EC%9E%84/KakaoTalk_20231119_190729310.jpg",
    ],
    text: "까먹고 사진을 하나도 안찍었는데... 아무튼 역시 파티룸은 어두워야 된다는 걸 한번 더 깨달음. 공간 자체는 작았는데도 되게 재밌는 일이 많았음. 만난지 얼마 안돼서 노래방 가는 조도 있었고, 갑자기 공개 프로포즈(?) 하는 사람도 봄. 사실 다른 조는 어땠는지 잘 모르겠고 아무튼 우리 조는 올타임으로 재밌었음. 생각해보니까 보드게임 많이 가지고 갔던 것도 까먹고 있었음... 막차타고 가는 인원이 생각보다 많아서 조금 아쉬웠지만 밤새 놀았던 분들도 넘 재밌었슴다",
    title: "양천/강남 정기모임",
  },
  {
    id: 108,
    dateCreated: "11월 24일",
    images: [
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/11.24+%EC%88%98%EC%9B%90/KakaoTalk_20231130_155203036_03.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/11.24+%EC%88%98%EC%9B%90/KakaoTalk_20231130_155203036.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/11.24+%EC%88%98%EC%9B%90/KakaoTalk_20231130_155203036_01.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/11.24+%EC%88%98%EC%9B%90/KakaoTalk_20231130_155203036_02.jpg",
    ],
    text: "마라는 옳다",
    title: "용용선생 마라 번개",
  },
  {
    id: 110,
    dateCreated: "12월 1일",
    images: [
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/12.1+%EC%88%98%EC%9B%90/KakaoTalk_20231206_193123506_03.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/12.1+%EC%88%98%EC%9B%90/KakaoTalk_20231206_193123506_01.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/12.1+%EC%88%98%EC%9B%90/KakaoTalk_20231206_193123506_02.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/12.1+%EC%88%98%EC%9B%90/KakaoTalk_20231206_193123506.jpg",
    ],
    text: "",
    title: "수원역 술 번개(20대 초반)",
  },
  {
    id: 111,
    dateCreated: "12월 2일",
    images: [
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/12.2+%EC%88%98%EC%9B%90+%EC%A0%95%EA%B8%B0%EC%8A%A4%ED%84%B0%EB%94%94/KakaoTalk_20231206_193541715.jpg",
    ],
    text: "",
    title: "12월 1주차 정기스터디",
  },
  {
    id: 114,
    dateCreated: "12월 6일",
    images: [
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/12.6+%EC%88%98%EC%9B%90+%EC%A0%95%EA%B8%B0+%EC%8A%A4%ED%84%B0%EB%94%94/KakaoTalk_20231206_193820021_01.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/12.6+%EC%88%98%EC%9B%90+%EC%A0%95%EA%B8%B0+%EC%8A%A4%ED%84%B0%EB%94%94/KakaoTalk_20231206_193820021_02.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/12.6+%EC%88%98%EC%9B%90+%EC%A0%95%EA%B8%B0+%EC%8A%A4%ED%84%B0%EB%94%94/KakaoTalk_20231206_193820021_03.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/12.6+%EC%88%98%EC%9B%90+%EC%A0%95%EA%B8%B0+%EC%8A%A4%ED%84%B0%EB%94%94/KakaoTalk_20231206_193820021_04.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/12.6+%EC%88%98%EC%9B%90+%EC%A0%95%EA%B8%B0+%EC%8A%A4%ED%84%B0%EB%94%94/KakaoTalk_20231206_193820021.jpg",
    ],
    text: "일찍부터 와서 공부를 시작함. 일단 여기 대박인게 저 넓은 공간에 사람이 우리밖에 없었음. 그래서 눈치 안보고 공부하다가 얘기하다가 함. 케이크 먹으면서 그렇게 5시간 정도 하고 저녁을 먹으러 감. 오랜 토론 끝에 닭갈비로 결정했음. 맥주 딱 한잔만 했음. 원래 약간의 술은 공부에 도움이 된다고 누가 그랬음. 아무튼 그럼. 저녁을 먹은 뒤 앞에 투썸 미팅룸 큰걸로 빌려서 10시까지 공부함. 되게 뭔가 많이 한 듯.",
    title: "12월 6일 정기스터디",
  },
  {
    id: 116,
    dateCreated: "12월 14일",
    images: [
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/12.14+%EC%88%98%EC%9B%90+%EC%8A%A4%ED%84%B0%EB%94%94/KakaoTalk_20231216_145858635.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/12.14+%EC%88%98%EC%9B%90+%EC%8A%A4%ED%84%B0%EB%94%94/KakaoTalk_20231216_145858635_01.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/12.14+%EC%88%98%EC%9B%90+%EC%8A%A4%ED%84%B0%EB%94%94/KakaoTalk_20231216_145858635_02.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/12.14+%EC%88%98%EC%9B%90+%EC%8A%A4%ED%84%B0%EB%94%94/KakaoTalk_20231216_145858635_03.jpg",
    ],
    text: "오늘도 역시 거의 장소 전세내고 쓴 기분... 알고보니 9시까지 사용이 가능해서 6시까지 공부하다가 저녁먹고 다시와서 마저 했음. 저녁은 역할맥에 갔는데 술 먹으러 간건 아니고(설마 시험 기간인데) 라이트한 안주를 찾다가 가게 됨.",
    title: "12월 14일 정기스터디",
  },
  {
    id: 120,
    dateCreated: "12월 20일",
    images: [
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/12.20+%EC%88%98%EC%9B%90/KakaoTalk_20231221_202156894_03.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/12.20+%EC%88%98%EC%9B%90/KakaoTalk_20231221_202156894_01.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/12.20+%EC%88%98%EC%9B%90/KakaoTalk_20231221_202156894_02.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/12.20+%EC%88%98%EC%9B%90/KakaoTalk_20231221_202156894.jpg",
    ],
    text: "사진이 왜 이러냐면... 그만큼 신나게 놀았기 때문이다. 스터디를 마치고 맛있는 고기와 껍데기로 1차를 시작했다. 나름 유튜브에서 많이 봤던 곳을 갔는데 상상을 초월하게 맛있었다. 2차로는 새로 생긴 술집을 갔다. 별 얘기를 다 한거 같다. 원래 2차로 끝내려고 했는데, 3차로 노래방에 갔다. 온돌식 룸이었는데 분위기가 좋았다. 처음에는 분명 잔잔하게 시작을 했던 거 같은데, 끝나고 나니까 막차 시간에 너무 힘들었다. 의도치않게 정말 열정적으로 놀게되었다.",
    title: "20일 수원역 번개",
  },
  {
    id: 121,
    dateCreated: "12월 28일",
    images: [
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/12.28+%EC%88%98%EC%9B%90/KakaoTalk_20240101_124748459.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/12.28+%EC%88%98%EC%9B%90/KakaoTalk_20240101_124748459_01.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/12.28+%EC%88%98%EC%9B%90/KakaoTalk_20240101_124748459_02.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/12.28+%EC%88%98%EC%9B%90/KakaoTalk_20240101_124748459_03.jpg",
    ],
    text: "1차는 이자카야를 갔는데 가격이 너무 비싸서 조금만 먹고 2차로 이동했다. 룸술집이었는데 주문을 하고 한참이 지나도 메뉴가 계속 안나와서 몇번을 더 물어보니까 와이파이가 잘 안돼서 주문이 안들어왔다는데... 21세기 강남에서 이게 말인가? 분노게이지가 올라가던 도중 과일화채 2개가 서비스로 나와서 맛있게 먹었다. 막차를 놓쳐서 집 가는게 힘들었지만... I들 사이에 껴 있으니까 힐링이 되고 좋았다.",
    title: "강남 술 번개(28일)",
  },
  {
    id: 122,
    dateCreated: "1월 8일",
    images: [
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/01.08_%EC%A0%84%EC%8B%9C%ED%9A%8C/KakaoTalk_20240110_171022564_01.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/01.08_%EC%A0%84%EC%8B%9C%ED%9A%8C/KakaoTalk_20240110_171022564_02.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/01.08_%EC%A0%84%EC%8B%9C%ED%9A%8C/KakaoTalk_20240110_171022564_03.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/01.08_%EC%A0%84%EC%8B%9C%ED%9A%8C/KakaoTalk_20240110_171022564.jpg",
    ],
    text: "반나절 내내 놀았어요! 점심에 피자 먹고, 전시회 본 다음에, 걷다가, 보드게임 하고, 늦게까지 전막걸리를 마셨던 알찬(?) 플랜이었죠. 말도 안되게 돈이 나온건 비밀...",
    title: "전시회 번개",
  },
  {
    id: 123,
    dateCreated: "5월 5일",
    images: [
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/5.04_%ED%95%9C%EA%B0%95+%EB%B2%88%EA%B0%9C/KakaoTalk_20240505_145027199_01.jpg",
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A6%AC%EB%B7%B0/5.04_%ED%95%9C%EA%B0%95+%EB%B2%88%EA%B0%9C/KakaoTalk_20240505_145148461.jpg",
    ],
    text: "한강 공원에 나들이를 왔어요 :) 누가 날 잡은건지 주말인데 사람도 별로 없고 날씨도 너무 좋더라고요 ㅎㅎ 12시에 만나서 배달 음식 먹고, 얘기 좀 하다가, 게임도 하고, 4명은 텐트에서 휴식, 4명은 한강 자전거를 타러 갔습니다! 근데 자전거 타러 간 인원 중 절반은 처음에는 자전거를 탈 줄 몰라서 어려워했는데, 나중에는 도로주행도 가능해짐 ㅋㅋㅋ 갈 사람은 가고, 몇명은 저녁까지 있었어요. 야시장 기간이라 밤에 오히려 사람이 더 많더라고요! 닭꼬치 먹고 밤까지 있다가 종료! 성공적인 나들이었다.",
    title: "한강공원 나들이",
  },
];
