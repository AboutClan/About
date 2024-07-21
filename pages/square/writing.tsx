import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormLabel,
  Switch,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import styled from "styled-components";

import { Input } from "../../components/atoms/Input";
import Textarea from "../../components/atoms/Textarea";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import SquareCategoryRadioGroup from "../../pageTemplates/square/SecretSquare/writing/SquareCategoryRadioGroup";
import { SquareType } from "../../types/models/square";

type FormData = {
  category: "일상" | "고민" | "정보" | "같이해요";
  title: string;
  content: string;
  pollList: { value: string }[];
  canMultiple: boolean;
};
const defaultFormData: FormData = {
  category: "일상",
  title: "",
  content: "",
  pollList: [{ value: "" }, { value: "" }, { value: "" }],
  canMultiple: false,
};

function SquareWritingPage() {
  const methods = useForm<FormData>({
    defaultValues: defaultFormData,
  });
  const {
    register,
    handleSubmit,
    formState: { dirtyFields },
  } = methods;

  const isPollType =
    dirtyFields["pollList"] && dirtyFields["pollList"].every(({ value: isDirty }) => isDirty);

  const [squareType, setSquareType] = useState<SquareType>("general");

  const { data: session } = useSession();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);

    // const writingData = {
    //   category: data.category,
    //   title: data.title,
    //   content: data.content,
    //   id: dayjs().format("hhmmss"),
    //   voteList: [],
    //   writer: session?.user.name,
    //   date: dayjs().format("YYYY-MM-DD"),
    // };
    // TODO
    // 유효성 검사
    // post 요청

    const type =
      dirtyFields["pollList"] && dirtyFields["pollList"].every(({ value: isDirty }) => isDirty)
        ? "poll"
        : "general";
    // console.log({ type });
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
        <FormProvider {...methods}>
          <LayoutForm onSubmit={handleSubmit(onSubmit)} id="secret-square-form">
            <SquareCategoryRadioGroup />

            <Input
              placeholder="제목을 입력해주세요"
              {...register("title", {
                required: true,
                minLength: 3,
              })}
            />
            <Textarea
              placeholder="본문을 입력해주세요"
              {...register("content", {
                required: true,
                minLength: 10,
              })}
            />
            {/* TODO 사진, 투표 creator modal */}
            <PollCreatorDrawer isOpen={isOpen} onClose={onClose} />
          </LayoutForm>
          <Button
            type="button"
            onClick={() => {
              // if (!isPollType)
              onOpen();
            }}
          >
            투표
          </Button>
        </FormProvider>
      </Slide>
    </>
  );
}

interface PollCreatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function PollCreatorDrawer({ isOpen, onClose }: PollCreatorDrawerProps) {
  const {
    control,
    register,
    trigger,
    formState: { errors },
  } = useFormContext<FormData>();
  const {
    fields: pollList,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "pollList",
    rules: {
      validate: (pollList) => {
        const isValid = pollList.length >= 2 && pollList.every(({ value }) => !!value);
        return isValid || "2개 이상의 항목을 입력해주세요.";
      },
    },
  });

  const addPollItem = () => {
    append({ value: "" });
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="full" placement="bottom">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>투표 만들기</DrawerHeader>

        <DrawerBody>
          <VStack spacing={4}>
            {pollList.map((item, index) => {
              return (
                <Flex key={item.id} w="100%">
                  <Input
                    autoFocus={index === 0}
                    placeholder="항목 입력"
                    {...register(`pollList.${index}.value`)}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    삭제
                  </Button>
                </Flex>
              );
            })}
            <Button type="button" w="100%" onClick={addPollItem}>
              항목 추가
            </Button>
            <Flex align="center" justifyContent="space-between" w="100%">
              <FormLabel htmlFor="can-multiple" mb="0">
                복수 선택 가능
              </FormLabel>
              <Switch id="can-multiple" {...register("canMultiple")} />
            </Flex>
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button
            type="button"
            w="100%"
            onClick={async () => {
              const isValid = await trigger("pollList");
              if (isValid) onClose();
            }}
          >
            완료
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const Layout = styled(motion.div)``;

const LayoutForm = styled.form`
  padding: 0 16px;
`;

const TitleInput = styled.input`
  width: 100%;
  margin-top: 16px;
  height: 44px;
  display: flex;
  align-items: center;
  border-bottom: 2px solid var(--font-h6);
  background-color: var(--font-h8);
  color: var(--font-h2);
  ::placeholder {
    font-size: 16px;
    font-weight: 600;
    color: var(--font-h4);
  }
`;

export default SquareWritingPage;
