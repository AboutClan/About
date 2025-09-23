import { Box, Button, VStack } from "@chakra-ui/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";

import InfoList from "../../../components/atoms/lists/InfoList";
import Textarea from "../../../components/atoms/Textarea";
import WritingNavigation from "../../../components/atoms/WritingNavigation";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
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
import { usePointSystemMutation } from "../../../hooks/user/mutations";
import { convertSummaryText } from "../../../libs/convertFeedToLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import {
  TransferFeedSummaryProps,
  transferFeedSummaryState,
} from "../../../recoils/transferRecoils";
import { appendFormData } from "../../../utils/formDataUtils";

function FeedWritingPage() {
  const router = useRouter();

  const toast = useToast();
  const searchParams = useSearchParams();
  const { category } = useParams<{ category: "gather" | "group" }>() || {};
  const id = searchParams.get("id");

  const methods = useForm<{ content: string }>({
    defaultValues: { content: "" },
  });
  const { register, handleSubmit, watch } = methods;

  const transferFeedSummary = useRecoilValue(transferFeedSummaryState);
  console.log(32, transferFeedSummary);
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

  const { mutate: updatePoint } = usePointSystemMutation("point");
  const { mutate, isLoading } = useFeedMutation({
    onSuccess() {
      if (isAnonymous) {
        updatePoint({ value: 1000, message: "번개 후기 실명 지원금" });
        toast("success", "1,000 Point가 지급되었습니다.");
      } else {
        updatePoint({ value: 200, message: "번개 후기 익명 지원금" });
        toast("success", "200 Point가 지급되었습니다.");
      }

      router.push(`/gather/${id}`);
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
    console.log(category);
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
        <RegisterOverview>
          <span>리뷰 쓰고, 지원금 받자!</span>
          <span>리뷰 작성 후, 마이페이지에서 신청 가능!</span>
        </RegisterOverview>
        {summary && (
          <Box my={5}>
            <SummaryBlock
              url={summary.url}
              title={summary.title}
              text={convertSummaryText(category, summary.subCategory)}
            />
          </Box>
        )}
        <VStack h="100%">
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
        <Box mt={10}>
          <InfoList items={INFO_ARR} />
        </Box>
      </Slide>
      <WritingNavigation>
        <ImageUploadButton
          maxFiles={5}
          setImageUrls={setImageArr}
          setImageForms={setImageFormArr}
        />
        <UserSecretButton isAnonymous={isAnonymous} setIsAnonymous={setIsAnonymous} />
      </WritingNavigation>
    </>
  );
}

const INFO_ARR = [
  "모임장은 후기 작성 후 지원금 신청이 가능합니다.",
  "실명은 1,000 Point, 익명은 200 Point가 즉시 지급합니다.",
  "모임장이 운영진인 경우 다른 인원도 작성할 수 있습니다.",
];

export default FeedWritingPage;
