import { Box, Button, Flex, IconButton, Spacer, useDisclosure, VStack } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { Input } from "../../components/atoms/Input";
import Textarea from "../../components/atoms/Textarea";
import WritingNavigation from "../../components/atoms/WritingNavigation";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import ImageUploadButton from "../../components/molecules/ImageUploadButton";
import ImageUploadSlider, {
  ImageUploadTileProps,
} from "../../components/organisms/sliders/ImageUploadSlider";
import { useToast } from "../../hooks/custom/CustomToast";
import { useCreateSecretSquareMutation } from "../../hooks/secretSquare/mutations";
import PollCreatorDrawer from "../../pageTemplates/community/writing/PollCreatorDrawer";
import SquareCategoryRadioGroup from "../../pageTemplates/community/writing/SquareCategoryRadioGroup";
import { SecretSquareFormData } from "../../types/models/square";

const defaultFormData: SecretSquareFormData = {
  category: "일상",
  title: "",
  content: "",
  pollItems: [{ name: "" }, { name: "" }],
  canMultiple: false,
};

function SquareWritingPage() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const typeParams = searchParams.get("type");
  const isSecret = typeParams === "anonymous";

  const methods = useForm<SecretSquareFormData>({
    defaultValues: {
      ...defaultFormData,
      category: isSecret ? "일상" : "정보",
    },
  });
  const { register, handleSubmit, watch, getValues, resetField } = methods;

  const {
    isOpen: isOpenPollCreatorDrawer,
    onOpen: onOpenPollCreatorDrawer,
    onClose: onClosePollCreatorDrawer,
  } = useDisclosure();

  const [imageArr, setImageArr] = useState<string[]>([]);

  const [imageFormArr, setImageFormArr] = useState<Blob[]>([]);
  const pollItems = getValues("pollItems");
  const isPollType = pollItems.every(({ name }) => !!name.trim());

  const { mutate: createSecretSquareMutate, isLoading: isCreateSquareLoading } =
    useCreateSecretSquareMutation();

  const openPollCreatorDrawer = () => {
    if (isPollType) {
      toast("info", "투표는 최대 1개만 등록할 수 있습니다.");
      return;
    }
    onOpenPollCreatorDrawer();
  };

  const onSubmit: SubmitHandler<SecretSquareFormData> = (data) => {
    let type = "general";
    if (isSecret) {
      if (isPollType) type = "poll";
      else type = "general";
    } else {
      if (isPollType) type = "poll2";
      else type = "info";
    }
    const { category, title, content, pollItems, canMultiple } = data;

    const formData = new FormData();

    if (type === "poll2") {
      formData.append("pollItems", JSON.stringify(pollItems));
      formData.append("canMultiple", JSON.stringify(canMultiple));
    }

    formData.append("category", category);
    formData.append("title", title);
    formData.append("type", type);
    formData.append("content", content);
    formData.append("squareType", content);
    imageFormArr.forEach((imageBlob) => {
      formData.append("images", imageBlob);
    });

    createSecretSquareMutate(
      { formData },
      {
        onSuccess: ({ squareId }) => {
          setTimeout(() => {
            toast("success", "등록되었습니다.");
          }, 200);
          router.replace(`/community/${squareId}?type=${isSecret ? "anonymous" : "info"}`);
        },
      },
    );
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
          isDisabled={!watch().title || !watch().content}
          variant="ghost"
          size="md"
          type="submit"
          form="secret-square-form"
          isLoading={isCreateSquareLoading}
          px={3}
        >
          완료
        </Button>
      </Header>
      <Slide isNoPadding>
        <VStack h="100%" px={5}>
          <FormProvider {...methods}>
            <Box as="form" w="100%" onSubmit={handleSubmit(onSubmit)} id="secret-square-form">
              <SquareCategoryRadioGroup type={isSecret ? "secret" : "info"} />
              <Input
                placeholder="제목을 입력해주세요"
                {...register("title", {
                  required: true,
                  minLength: 1,
                  setValueAs: (value) => value.trim(),
                })}
              />
              <Spacer h="12px" />
              <Textarea
                placeholder="본문을 입력해주세요"
                {...register("content", {
                  required: true,
                  minLength: 1,
                  setValueAs: (value) => value.trim(),
                })}
                minH={180}
              />
              {imageArr.length ? (
                <Box mt="20px">
                  <ImageUploadSlider imageTileArr={imageTileArr} size="sm" />
                </Box>
              ) : null}
              <PollCreatorDrawer
                isOpen={isOpenPollCreatorDrawer}
                onClose={onClosePollCreatorDrawer}
              />
            </Box>
            {isPollType && (
              <Box
                px={4}
                py={3}
                pb={4}
                sx={{
                  margin: "1rem",
                  width: "100%",
                  borderRadius: "var(--rounded)",
                  border: "var(--border-main)",
                  background: "white",
                }}
              >
                <Flex justifyContent="space-between" align="center" gap={2}>
                  <Flex align="center">
                    <i className="fa-solid fa-check-to-slot" />
                    <Box as="span" ml={2} fontWeight={600}>
                      투표
                    </Box>
                  </Flex>
                  <Box>
                    <IconButton
                      icon={<i className="fa-solid fa-pen fa-xs" />}
                      aria-label="edit vote"
                      borderRadius="full"
                      bgColor="var(--gray-200)"
                      size="xs" // 버튼 크기 설정
                      onClick={onOpenPollCreatorDrawer}
                      type="button"
                      mr="12px"
                    />
                    <IconButton
                      icon={<i className="fa-solid fa-x fa-xs" />}
                      aria-label="delete vote"
                      borderRadius="full"
                      bgColor="var(--gray-200)"
                      size="xs"
                      type="button"
                      onClick={() => {
                        resetField("pollItems", { defaultValue: defaultFormData["pollItems"] });
                        resetField("canMultiple", { defaultValue: defaultFormData["canMultiple"] });
                      }}
                    />
                  </Box>
                </Flex>
                <VStack as="ul" mt={3}>
                  {pollItems.map(({ name }, index) => {
                    return (
                      <Box
                        as="li"
                        p={2}
                        sx={{
                          borderRadius: "var(--rounded)",
                          border: "var(--border-main)",
                          listStyle: "none",
                          width: "100%",
                        }}
                        key={index}
                      >
                        {name}
                      </Box>
                    );
                  })}
                </VStack>
              </Box>
            )}
          </FormProvider>
        </VStack>
      </Slide>
      <WritingNavigation>
        <ImageUploadButton
          maxFiles={5}
          setImageUrls={setImageArr}
          setImageForms={setImageFormArr}
        />

        <Button
          px="6px"
          color="var(--gray-500)"
          type="button"
          iconSpacing="4px"
          leftIcon={<VoteIcon />}
          variant="ghost"
          size="sm"
          onClick={openPollCreatorDrawer}
          fontSize="12px"
          border="none"
        >
          투표
        </Button>
      </WritingNavigation>
    </>
  );
}

function VoteIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="20px"
    fill="var(--gray-500)"
  >
    <path d="M200-80q-33 0-56.5-23.5T120-160v-152q0-14 5-28t15-25l62-70q11-13 28.5-13.5T260-437q11 11 12 27t-10 28l-55 62h546l-53-60q-11-12-10-28t12-27q12-12 29.5-11.5T760-433l60 68q10 11 15 25t5 28v152q0 33-23.5 56.5T760-80H200Zm224-304L285-525q-23-23-23-57t23-57l196-196q23-23 57-23t57 23l141 139q23 23 23.5 56.5T737-583L537-383q-23 23-56.5 22.5T424-384Zm256-256L538-780 340-582l142 140 198-198Z" />
  </svg>
}

export default SquareWritingPage;
