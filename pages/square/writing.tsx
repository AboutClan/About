import { Box, Button, Flex, Spacer, useDisclosure, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { Input } from "../../components/atoms/Input";
import Textarea from "../../components/atoms/Textarea";
import UploadImage from "../../components/atoms/UploadImage";
import WritingNavigation from "../../components/atoms/WritingNavigation";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import ImageUploadButton from "../../components/molecules/ImageUploadButton";
import PollCreatorDrawer from "../../pageTemplates/square/SecretSquare/writing/PollCreatorDrawer";
import SquareCategoryRadioGroup from "../../pageTemplates/square/SecretSquare/writing/SquareCategoryRadioGroup";
import { SecretSquareFormData } from "../../types/models/square";

const defaultFormData: SecretSquareFormData = {
  category: "일상",
  title: "",
  content: "",
  pollList: [{ value: "" }, { value: "" }, { value: "" }],
  canMultiple: false,
};

function SquareWritingPage() {
  const methods = useForm<SecretSquareFormData>({
    defaultValues: defaultFormData,
  });
  const { register, handleSubmit, watch, getValues, resetField } = methods;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [image, setImage] = useState("");
  const [imageForm, setImageForm] = useState();

  const pollList = getValues("pollList");
  const isPollType = pollList.every(({ value }) => !!value);

  const onSubmit: SubmitHandler<SecretSquareFormData> = (data) => {
    console.log(data);

    const type = isPollType ? "poll" : "general";

    // TODO
    // POST request body
    if (type === "poll") {
      // const body = {
      //   category: data.category,
      //   title: data.title,
      //   content: data.content,
      //   type: type,
      //   authorId: session?.user.uid, // 서버에서 이 값으로 어떤 유저인지 찾기 위함
      //   author: session?.user.name,
      //   pollList: data.pollList,
      //   canMultiple: data.canMultiple,
      // };
    } else if (type === "general") {
      // const body = {
      //   category: data.category,
      //   title: data.title,
      //   content: data.content,
      //   type: type,
      //   authorId: session?.user.uid, // 서버에서 이 값으로 어떤 유저인지 찾기 위함
      //   author: session?.user.name,
      // };
    }
  };

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
              {image && (
                <Box mt="20px">
                  <UploadImage url={image} onClose={() => setImage("")} />
                </Box>
              )}
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
                      resetField("pollList", { defaultValue: defaultFormData["pollList"] });
                      resetField("canMultiple", { defaultValue: defaultFormData["canMultiple"] });
                    }}
                  >
                    삭제
                  </Button>
                </Flex>
                <VStack as="ul" mt={2}>
                  {pollList.map(({ value }, index) => {
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
                        {value}
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
        <Button
          color="var(--gray-600)"
          type="button"
          leftIcon={<i className="fa-regular fa-image fa-lg" />}
          variant="ghost"
          size="sm"
        >
          사진
        </Button>
        <ImageUploadButton setImageUrl={setImage} setImageForm={setImageForm} />
        <Button
          color="var(--gray-600)"
          type="button"
          onClick={() => {
            if (isPollType) {
              // TODO toast
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
