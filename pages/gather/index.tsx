import { Box, Flex, Switch, Text } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";

import WritingButton from "../../components/atoms/buttons/WritingButton";
import { Input } from "../../components/atoms/Input";
import Textarea from "../../components/atoms/Textarea";
import Slide from "../../components/layouts/PageSlide";
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import { useToast } from "../../hooks/custom/CustomToast";
import { useGatherRequestMutation } from "../../hooks/gather/mutations";
import { ModalLayout } from "../../modals/Modals";
import PageGuideModal from "../../modals/PageGuideModal";
import GatherHeader from "../../pageTemplates/gather/GatherHeader";
import GatherMain from "../../pageTemplates/gather/GatherMain";
import GatherPick from "../../pageTemplates/gather/GatherPick";
import SquareLoungeSection from "../../pageTemplates/square/SquareLoungeSection";
import { sharedGatherWritingState } from "../../recoils/sharedDataAtoms";
import { transferGatherDataState } from "../../recoils/transferRecoils";
import { IModal } from "../../types/components/modalTypes";
import { checkAndSetLocalStorage } from "../../utils/storageUtils";

function Gather() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const tabParam = searchParams.get("tab");
  const { data: session } = useSession();
  const isGuest = session?.user.role === "guest";

  const setTrasnferGatherData = useSetRecoilState(transferGatherDataState);
  const setTransferGatherWriting = useSetRecoilState(sharedGatherWritingState);
  const [isModal, setIsModal] = useState(false);
  const [tab, setTab] = useState<"번개" | "라운지" | "이런 번개 어때요?">("번개");
  const [isGatherPickModal, setIsGatherPickModal] = useState(false);

  useEffect(() => {
    setTrasnferGatherData(null);
    setTransferGatherWriting(null);
    if (!checkAndSetLocalStorage("gatherGuidePopUp", 21)) {
      setIsModal(true);
    }
  }, []);

  useEffect(() => {
    if (tabParam === "gather") setTab("번개");
    if (tabParam === "lounge") setTab("라운지");
  }, [tabParam]);

  const tabNavOptions: ITabNavOptions[] = [
    {
      text: "번개",
      func: () => {
        newSearchParams.set("tab", "gather");
        router.replace("gather" + "?" + newSearchParams.toString());
        setTab("번개");
      },
    },
    {
      text: "라운지",
      func: () => {
        newSearchParams.set("tab", "lounge");
        router.replace("gather" + "?" + newSearchParams.toString());
        setTab("라운지");
      },
    },
    {
      text: "이런 번개 어때요?",
      func: () => {
        newSearchParams.set("tab", "gatherPick");
        router.replace("gather" + "?" + newSearchParams.toString());
        setTab("이런 번개 어때요?");
      },
    },
  ];

  return (
    <>
      <GatherHeader tab={tab} />
      <Slide isNoPadding>
        <Box fontSize="16px" mb={3} bgColor="white" borderBottom="var(--border)" px={5}>
          <TabNav tabOptionsArr={tabNavOptions} selected={tab} />
        </Box>
      </Slide>
      <Slide isNoPadding={tab !== "번개"}>
        {tab === "번개" ? (
          <GatherMain />
        ) : tab === "라운지" ? (
          <SquareLoungeSection />
        ) : (
          <GatherPick />
        )}
      </Slide>
      {!isGuest && tab === "번개" && (
        <WritingButton url="/gather/writing/category" type="thunder" />
      )}
      {!isGuest && tab === "이런 번개 어때요?" && (
        <WritingButton onClick={() => setIsGatherPickModal(true)} />
      )}
      {isModal && (
        <PageGuideModal title="번개 가이드" footerOptions={{}} setIsModal={setIsModal}>
          다양한 번개 모임에 참여해 보세요! 금방 마감될지도 모른다구요? 개설시에는 최대{" "}
          <b>15,000원</b> 지원금 획득! 참여 승인제 및 다양한 기능이 있습니다!
        </PageGuideModal>
      )}
      {isGatherPickModal && <GatherPickModal setIsModal={setIsGatherPickModal} />}
    </>
  );
}

function GatherPickModal({ setIsModal }: IModal) {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useGatherRequestMutation({
    onSuccess() {
      queryClient.refetchQueries(["gatherRequest"]);
      setIsModal(false);
    },
  });

  const handleSubmit = () => {
    if (!title || !content) {
      toast("warning", "내용을 작성해 주세요.");
    }

    mutate({
      title,
      content,
      isAnonymous,
    });
  };

  return (
    <ModalLayout
      title="이런 번개 열어주세요!"
      footerOptions={{ main: { text: "완 료", func: handleSubmit, isLoading } }}
      setIsModal={setIsModal}
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="원하는 모임을 적어주세요."
        size="sm"
        px={3}
      />
      <Textarea
        my={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="하고 싶은 말을 남겨주세요."
        px={3}
        h="80px"
      />
      <Flex align="center" justify="space-between">
        <Flex>
          <Text mr={2} fontSize="12px" color="gray.600" lineHeight="20px">
            익명 체크
          </Text>
          <Switch
            colorScheme="mint"
            isChecked={isAnonymous}
            onChange={() => setIsAnonymous((old) => !old)}
          />
        </Flex>
        <Box lineHeight="20px" fontSize="12px" color="mint">
          {isAnonymous ? "- 100 Point" : "실명 무료"}
        </Box>
      </Flex>
    </ModalLayout>
  );
}

export default Gather;
