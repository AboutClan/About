import { Box, Button, VStack } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

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
import { useUserInfo } from "../../../hooks/custom/UserHooks";
import { useFeedMutation } from "../../../hooks/feed/mutations";
import { useGatherIDQuery } from "../../../hooks/gather/queries";
import { usePointSystemMutation } from "../../../hooks/user/mutations";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";
import { appendFormData } from "../../../utils/formDataUtils";

function FeedWritingPage() {
  const router = useRouter();

  const toast = useToast();
  const searchParams = useSearchParams();
  const { category } = useParams<{ category: "gather" | "group" }>() || {};
  const id = searchParams.get("id");
  const userInfo = useUserInfo();
  const methods = useForm<{ content: string }>({
    defaultValues: { content: "" },
  });
  const { register, handleSubmit, watch } = methods;

  const [imageArr, setImageArr] = useState<string[]>([]);
  const [imageFormArr, setImageFormArr] = useState<Blob[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // const { data: group } = useGroupIdQuery(id, {
  //   enabled: category === "group" && !!id && !transferFeedSummary,
  // });

  const { data: gather } = useGatherIDQuery(+id, {
    enabled: !!id,
  });

  const isOrganazier = (gather?.user as UserSimpleInfoProps)?._id === userInfo?._id;

  const { mutate: updatePoint } = usePointSystemMutation("point");
  const { mutate, isLoading } = useFeedMutation({
    onSuccess() {
      const defaultValue = !isAnonymous ? 1000 : 200;
      const addValue = gather.type.title === "스터디" || !isOrganazier ? 0 : 1000;
      const value = defaultValue + addValue;
      updatePoint({ value, message: "모임 후기 지원금" });
      toast("success", `${value.toLocaleString()} Point가 지급되었습니다.`);
      router.push(`/gather/${id}`);
    },
  });

  useEffect(() => {
    if (!gather) return;
    if (!isOrganazier && dayjs(gather.date).isAfter(dayjs().subtract(2, "day"))) {
      toast(
        "info",
        "후기 작성 시 포인트가 지급됩니다. 모임장 동의를 구하거나 하루가 더 지난 뒤 작성해 주세요!",
      );
    }
  }, [gather, isOrganazier]);

  // useEffect(() => {
  //   if (gather) {
  //     setSummary({
  //       url: `/gather/${gather.id}`,
  //       title: gather.title,
  //       subCategory: gather.type.title,
  //     });
  //   }
  // }, [gather]);

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
    appendFormData(formData, "date", gather.date);
    appendFormData(formData, "title", gather.title);
    appendFormData(formData, "isAnonymous", isAnonymous ? "true" : "false");
    appendFormData(formData, "text", content);
    appendFormData(formData, "typeId", id);
    appendFormData(formData, "subCategory", gather.type.title);
    mutate(formData);
  };

  const imageTileArr: ImageUploadTileProps[] = imageArr.map((image) => ({
    imageUrl: image,
    func: (url: string) => {
      const findIdx = imageArr.findIndex((image) => image === url);
      if (findIdx === -1) return;
      setImageArr((old) => {
        const copy = [...old];
        copy.splice(findIdx, 1);
        return copy;
      });
      setImageFormArr((old) => {
        const copy = [...old];
        copy.splice(findIdx, 1);
        return copy;
      });
    },
  }));

  return (
    <>
      <Header title="" rightPadding={8}>
        <Button
          isDisabled={!watch().content || isLoading}
          variant="ghost"
          size="md"
          type="submit"
          form="secret-square-form"
          border="none"
          mr={-2}
        >
          완료
        </Button>
      </Header>
      <Slide>
        <RegisterOverview>
          <span>모임 후기 작성</span>
          <span>어떤 모임이었는지, 함께한 순간들을 자유롭게 적어주세요.</span>
        </RegisterOverview>

        <Box my={5}>
          {gather && (
            <SummaryBlock
              url={`/gather/${gather.groupId}`}
              title={gather.title}
              text={`${gather.type.title} · ${dayjsToFormat(dayjs(gather.date), "M월 D일(ddd)")}`}
            />
          )}
        </Box>

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
          maxFiles={4}
          setImageUrls={setImageArr}
          setImageForms={setImageFormArr}
        />
        <Box w={1} />
        <UserSecretButton isAnonymous={isAnonymous} setIsAnonymous={setIsAnonymous} />
      </WritingNavigation>
    </>
  );
}

const INFO_ARR = [
  "실명은 1,000 Point, 익명은 200 Point가 즉시 지급합니다.",
  "모임장이라면 추가로 1,000 Point가 지급됩니다. (카공 제외)",
  "함께 참여한 멤버들에게 리뷰 알림이 전송됩니다.",
  "작성된 리뷰는 모임 페이지, 라운지, 프로필에서 볼 수 있습니다.",
];

export default FeedWritingPage;
