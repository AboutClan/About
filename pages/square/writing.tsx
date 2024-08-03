import { Box, Button, Flex, Spacer, useDisclosure, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
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
import { useCompleteToast, useInfoToast } from "../../hooks/custom/CustomToast";
import { usePostSecretSquareMutation } from "../../hooks/secretSquare/mutations";
import PollCreatorDrawer from "../../pageTemplates/square/SecretSquare/writing/PollCreatorDrawer";
import SquareCategoryRadioGroup from "../../pageTemplates/square/SecretSquare/writing/SquareCategoryRadioGroup";
import { SecretSquareFormData } from "../../types/models/square";

const defaultFormData: SecretSquareFormData = {
  category: "일상",
  title: "",
  content: "",
  pollItems: [{ name: "" }, { name: "" }, { name: "" }],
  canMultiple: false,
};

function SquareWritingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const methods = useForm<SecretSquareFormData>({
    defaultValues: defaultFormData,
  });
  const { register, handleSubmit, watch, getValues, resetField } = methods;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [imageArr, setImageArr] = useState<string[]>([]);
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [imageFormArr, setImageFormArr] = useState<Blob[]>([]);
  const pollItems = getValues("pollItems");
  const isPollType = pollItems.every(({ name }) => !!name);

  const { mutate: postSecretSquareMutate, isLoading } = usePostSecretSquareMutation();
  const completeToast = useCompleteToast();
  const infoToast = useInfoToast();

  const onSubmit: SubmitHandler<SecretSquareFormData> = (data) => {
    const type = isPollType ? "poll" : "general";
    const { category, title, content, pollItems, canMultiple } = data;

    const formData = new FormData();

    if (type === "poll") {
      formData.append("pollItems", JSON.stringify(pollItems));
      formData.append("canMultiple", JSON.stringify(canMultiple));
    }

    formData.append("category", category);
    formData.append("title", title);
    formData.append("type", type);
    formData.append("content", content);
    formData.append("author", session?.user.id);
    imageFormArr.forEach((imageBlob) => {
      formData.append("images", imageBlob);
    });

    postSecretSquareMutate(
      { formData },
      {
        onSuccess: () => {
          completeToast("free", "게시물 등록이 완료되었습니다.");
          router.replace("/square");
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
          size="sm"
          type="submit"
          form="secret-square-form"
        >
          완료
        </Button>
      </Header>
      <Slide>
        <VStack h="100%" px={4}>
          <FormProvider {...methods}>
            <Box as="form" w="100%" onSubmit={handleSubmit(onSubmit)} id="secret-square-form">
              <SquareCategoryRadioGroup />

              <Input
                placeholder="제목을 입력해주세요"
                {...register("title", {
                  required: true,
                  minLength: 3,
                  setValueAs: (value) => value.trim(),
                })}
              />
              <Spacer h="12px" />
              <Textarea
                placeholder="본문을 입력해주세요"
                {...register("content", {
                  required: true,
                  minLength: 10,
                  setValueAs: (value) => value.trim(),
                })}
                minH={180}
              />
              {imageArr.length ? (
                <Box mt="20px">
                  <ImageUploadSlider imageTileArr={imageTileArr} size="sm" />
                </Box>
              ) : null}
              <PollCreatorDrawer isOpen={isOpen} onClose={onClose} />
            </Box>
            {isPollType && (
              <Box
                p={4}
                sx={{
                  margin: "1rem",
                  width: "100%",
                  borderRadius: "var(--rounded)",
                  border: "var(--border-main)",
                  background: "white",
                }}
              >
                <Flex justifyContent="flex-end" gap={2}>
                  <Button type="button" onClick={onOpen}>
                    수정
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      resetField("pollItems", { defaultValue: defaultFormData["pollItems"] });
                      resetField("canMultiple", { defaultValue: defaultFormData["canMultiple"] });
                    }}
                  >
                    삭제
                  </Button>
                </Flex>
                <VStack as="ul" mt={2}>
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
          color="var(--gray-600)"
          type="button"
          onClick={() => {
            if (isPollType) {
              infoToast("free", "투표는 최대 1개 등록할 수 있습니다.");
              return;
            }
            onOpen();
          }}
          leftIcon={<i className="fa-regular fa-check-to-slot fa-lg" />}
          variant="ghost"
          size="sm"
        >
          투표
        </Button>
      </WritingNavigation>
    </>
  );
}

export default SquareWritingPage;
