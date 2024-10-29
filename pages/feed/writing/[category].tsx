import { Box, Button, VStack } from "@chakra-ui/react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";

import Textarea from "../../../components/atoms/Textarea";
import WritingNavigation from "../../../components/atoms/WritingNavigation";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import SuccessScreen from "../../../components/layouts/SuccessScreen";
import ImageUploadButton from "../../../components/molecules/ImageUploadButton";
import SummaryBlock from "../../../components/molecules/SummaryBlock";
import UserSecretButton from "../../../components/molecules/UserSecretButton";
import ImageUploadSlider, {
  ImageUploadTileProps,
} from "../../../components/organisms/sliders/ImageUploadSlider";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useFeedMutation } from "../../../hooks/feed/mutations";
import { useGatherIDQuery } from "../../../hooks/gather/queries";
import { useGroupIdQuery } from "../../../hooks/groupStudy/queries";
import { useRealTimeAttendMutation } from "../../../hooks/realtime/mutations";
import { convertSummaryText } from "../../../libs/convertFeedToLayout";
import {
  TransferFeedSummaryProps,
  transferFeedSummaryState,
} from "../../../recoils/transferRecoils";
import { appendFormData } from "../../../utils/formDataUtils";

function FeedWritingPage() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const { category } = useParams<{ category: "gather" | "group" }>() || {};
  const id = searchParams.get("id");

  const methods = useForm<{ content: string }>({
    defaultValues: { content: "" },
  });
  const { register, handleSubmit, watch } = methods;

  const transferFeedSummary = useRecoilValue(transferFeedSummaryState);
  const [isSuccessScreen, setIsSuccessScreen] = useState(false);
  const [summary, setSummary] = useState<TransferFeedSummaryProps>();
  const [imageArr, setImageArr] = useState<string[]>([]);
  const [imageFormArr, setImageFormArr] = useState<Blob[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const { data: group } = useGroupIdQuery(id, {
    enabled: category === "group" && !!id && !transferFeedSummary,
  });
  const { data: gather } = useGatherIDQuery(+id, {
    enabled: category === "gather" && !!id && !transferFeedSummary,
  });

  const { mutate, isLoading } = useFeedMutation({
    onSuccess() {
      setIsSuccessScreen(true);
    },
  });

  useEffect(() => {
    if (transferFeedSummary) {
      setSummary(transferFeedSummary);
    } else if (group) {
      setSummary({
        url: `/group/${group.id}`,
        title: group.title,
        subCategory: group.category.sub,
      });
    } else if (gather) {
      setSummary({
        url: `/gather/${gather.id}`,
        title: gather.title,
        subCategory: gather.type.subtitle,
      });
    }
  }, [transferFeedSummary, group]);

  const formData = new FormData();

  const onSubmit: SubmitHandler<{ content: string }> = ({ content }) => {
    if (!imageFormArr?.length) {
      toast("warning", "최소 한장 이상의 사진이 필요합니다.");
      return;
    }
    appendFormData(formData, "type", category);
    for (const form of imageFormArr) {
      appendFormData(formData, "images", form);
    }
    appendFormData(formData, "title", summary.title);
    appendFormData(formData, "isAnonymous", isAnonymous ? "true" : "false");
    appendFormData(formData, "text", content);
    appendFormData(formData, "typeId", id);
    appendFormData(formData, "subCategory", summary.subCategory);

    mutate(formData);
  };

  const imageTileArr: ImageUploadTileProps[] = imageArr.map((image) => ({
    imageUrl: image,
    func: (url: string) => {
      setImageArr(imageArr.filter((old) => old !== url));
    },
  }));
  const { mutate: mutate2 } = useRealTimeAttendMutation();
  return (
    <>
      <Header title="글 쓰기" rightPadding={8}>
        <Button
          isDisabled={!watch().content || isLoading}
          variant="ghost"
          size="sm"
          type="submit"
          form="secret-square-form"
        >
          완료
        </Button>
      </Header>
      <Slide>
        {summary && (
          <Box p="16px">
            <SummaryBlock
              url={summary.url}
              title={summary.title}
              text={convertSummaryText(category, summary.subCategory)}
            />
          </Box>
        )}
        <VStack h="100%" px={4}>
          <FormProvider {...methods}>
            <Box as="form" w="100%" onSubmit={handleSubmit(onSubmit)} id="secret-square-form">
              <Textarea
                placeholder="본문을 입력해주세요"
                {...register("content", {
                  required: true,
                  minLength: 5,
                  setValueAs: (value) => value.trim(),
                })}
                minH={180}
              />
              {imageArr.length ? (
                <Box mt="20px">
                  <ImageUploadSlider imageTileArr={imageTileArr} size="sm" />
                </Box>
              ) : null}
            </Box>
          </FormProvider>
        </VStack>
      </Slide>
      <WritingNavigation>
        <ImageUploadButton
          maxFiles={5}
          setImageUrls={setImageArr}
          setImageForms={setImageFormArr}
        />
        <UserSecretButton isAnonymous={isAnonymous} setIsAnonymous={setIsAnonymous} />
      </WritingNavigation>
      {isSuccessScreen && (
        <SuccessScreen url={`/${category}/${id}`}>
          <>
            <span>피드가 올라갔습니다!</span>
            <div>피드는 해당 페이지 또는 라운지에서 확인이 가능해요!</div>
          </>
        </SuccessScreen>
      )}
    </>
  );
}

export default FeedWritingPage;
