import { Box, Button, Flex, useDisclosure, VStack } from "@chakra-ui/react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { Input } from "../../components/atoms/Input";
import Textarea from "../../components/atoms/Textarea";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
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
  const { register, handleSubmit, getValues, resetField } = methods;

  const { isOpen, onOpen, onClose } = useDisclosure();

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
      <Header title="글 작성하기">
        <Flex justify="flex-end">
          {/* TODO design submit button */}
          <Button type="submit" form="secret-square-form">
            완료
          </Button>
        </Flex>
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
              <Textarea
                placeholder="본문을 입력해주세요"
                {...register("content", {
                  required: true,
                  minLength: 10,
                  setValueAs: (value) => value.trim(),
                })}
              />
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
            <Button
              type="button"
              onClick={() => {
                if (isPollType) {
                  // TODO toast
                  return;
                }
                onOpen();
              }}
            >
              투표
            </Button>
          </FormProvider>
        </VStack>
      </Slide>
    </>
  );
}

export default SquareWritingPage;
