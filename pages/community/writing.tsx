import { Box, Button, Flex, IconButton, Spacer, useDisclosure, VStack } from "@chakra-ui/react";
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
import RequestChangeProfileImageModalAvatar from "../../modals/userRequest/RequestChangeProfileImageModal/RequestChangeProfileImageModalAvatar";
import PollCreatorDrawer from "../../pageTemplates/community/writing/PollCreatorDrawer";
import SquareCategoryRadioGroup from "../../pageTemplates/community/writing/SquareCategoryRadioGroup";
import { SecretSquareFormData } from "../../types/models/square";
import { AvatarProps } from "../../types/models/userTypes/userInfoTypes";

const defaultFormData: SecretSquareFormData = {
  category: "일상 · 자유",
  title: "",
  content: "",
  pollItems: [{ name: "" }, { name: "" }],
  canMultiple: false,
};

function SquareWritingPage() {
  const router = useRouter();
  const toast = useToast();

  const methods = useForm<SecretSquareFormData>({
    defaultValues: {
      ...defaultFormData,
    },
  });
  const { register, handleSubmit, watch, getValues, resetField } = methods;

  const {
    isOpen: isOpenPollCreatorDrawer,
    onOpen: onOpenPollCreatorDrawer,
    onClose: onClosePollCreatorDrawer,
  } = useDisclosure();

  const [imageArr, setImageArr] = useState<string[]>([]);
  const [isAvatarModal, setIsAvatarModal] = useState(false);
  const [imageFormArr, setImageFormArr] = useState<Blob[]>([]);
  const pollItems = getValues("pollItems");
  const isPollType = pollItems.every(({ name }) => !!name.trim());

  const [avatar, setAvatar] = useState<AvatarProps>({ type: 0, bg: 0 });

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
    const type = "general";

    const { category, title, content, pollItems, canMultiple } = data;

    const formData = new FormData();

    if (isPollType) {
      formData.append("pollItems", JSON.stringify(pollItems));
      formData.append("canMultiple", JSON.stringify(canMultiple));
    }

    formData.append("avatar", JSON.stringify(avatar));
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
          router.replace(`/community/${squareId}`);
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
  console.log(12, avatar);
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
              <SquareCategoryRadioGroup />
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
                    <VoteIcon color="black" />
                    <Box as="span" ml={2} color="gray.800" fontWeight={600} lineHeight="20px">
                      투표
                    </Box>
                  </Flex>
                  <Box>
                    <IconButton
                      h="24px"
                      w="24px"
                      p="0 !important"
                      icon={<EditIcon />}
                      aria-label="edit vote"
                      borderRadius="full"
                      bgColor="var(--gray-200)"
                      size="xs"
                      onClick={onOpenPollCreatorDrawer}
                      type="button"
                      mr="12px"
                    />
                    <IconButton
                      icon={<XIcon />}
                      h="24px"
                      w="24px"
                      p="0 !important"
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
                        p={2}
                        pl={3}
                        color="gray.600"
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
          ml={1}
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

        <Button
          ml={1}
          px="6px"
          color="var(--gray-500)"
          type="button"
          iconSpacing="4px"
          leftIcon={<AvatarIcon />}
          variant="ghost"
          size="sm"
          onClick={() => setIsAvatarModal(true)}
          fontSize="12px"
          border="none"
        >
          아바타
        </Button>
      </WritingNavigation>
      {isAvatarModal && (
        <RequestChangeProfileImageModalAvatar
          defaultAvatar={avatar}
          setAvatar={setAvatar}
          setIsModal={() => {
            setIsAvatarModal(false);
          }}
        />
      )}
    </>
  );
}

function VoteIcon({ color }: { color?: "black" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill={color === "black" ? "var(--gray-700)" : "var(--gray-500)"}
    >
      <path d="M200-80q-33 0-56.5-23.5T120-160v-152q0-14 5-28t15-25l62-70q11-13 28.5-13.5T260-437q11 11 12 27t-10 28l-55 62h546l-53-60q-11-12-10-28t12-27q12-12 29.5-11.5T760-433l60 68q10 11 15 25t5 28v152q0 33-23.5 56.5T760-80H200Zm224-304L285-525q-23-23-23-57t23-57l196-196q23-23 57-23t57 23l141 139q23 23 23.5 56.5T737-583L537-383q-23 23-56.5 22.5T424-384Zm256-256L538-780 340-582l142 140 198-198Z" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="12px"
      viewBox="0 -960 960 960"
      width="12px"
      fill="var(--gray-800)"
    >
      <path d="M160 0q-33 0-56.5-23.5T80-80q0-33 23.5-56.5T160-160h640q33 0 56.5 23.5T880-80q0 33-23.5 56.5T800 0H160Zm0-280v-113q0-8 3-15.5t9-13.5l436-435q11-11 25.5-17t30.5-6q16 0 31 6t27 18l55 56q12 11 17.5 26t5.5 31q0 15-5.5 29.5T777-687L342-252q-6 6-13.5 9t-15.5 3H200q-17 0-28.5-11.5T160-280Zm504-408 56-56-56-56-56 56 56 56Z" />
    </svg>
  );
}
function AvatarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="var(--gray-500)"
    >
      <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
    </svg>
  );
}

export function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="12px"
      viewBox="0 -960 960 960"
      width="12px"
      fill="var(--gray-800)"
    >
      <path d="M480-405.91 293.04-218.96Q278.09-204 256-204t-37.04-14.96Q204-233.91 204-256t14.96-37.04L405.91-480 218.96-666.96Q204-681.91 204-704t14.96-37.04Q233.91-756 256-756t37.04 14.96L480-554.09l186.96-186.95Q681.91-756 704-756t37.04 14.96Q756-726.09 756-704t-14.96 37.04L554.09-480l186.95 186.96Q756-278.09 756-256t-14.96 37.04Q726.09-204 704-204t-37.04-14.96L480-405.91Z" />
    </svg>
  );
}

export default SquareWritingPage;
