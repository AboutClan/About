import { Box, Button, VStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";

import Textarea from "../../../components/atoms/Textarea";
import WritingNavigation from "../../../components/atoms/WritingNavigation";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import SummaryBlock, { SummaryBlockProps } from "../../../components/molecules/SummaryBlock";
import { useGroupIdQuery } from "../../../hooks/groupStudy/queries";
import { transferFeedSummaryState } from "../../../recoils/transferRecoils";
import { appendFormData } from "../../../utils/formDataUtils";

function FeedWritingPage() {
  const searchParams = useSearchParams();
  const { category } = useParams<{ category: string }>() || {};
  const id = searchParams.get("id");

  const { data: session } = useSession();

  const methods = useForm<{ content: string }>({
    defaultValues: { content: "" },
  });
  const { register, handleSubmit, watch } = methods;

  const transferFeedSummary = useRecoilValue(transferFeedSummaryState);
  const [summary, setSummary] = useState<SummaryBlockProps>();

  const { data: group } = useGroupIdQuery(id, { enabled: !!id && !transferFeedSummary });

  useEffect(() => {
    if (transferFeedSummary) {
      setSummary(transferFeedSummary);
    } else if (group) {
      setSummary({
        url: `/group/${group.id}`,
        title: group.title,
        text: group.guide,
      });
    }
  }, [transferFeedSummary, group]);

  const formData = new FormData();

  const onSubmit: SubmitHandler<{ content: string }> = (data) => {
    appendFormData(formData, "type", category);
    appendFormData(formData, "image", "imageUrl");
    appendFormData(formData, "title", group.title);
    appendFormData(formData, "text", data.content);
    appendFormData(formData, "writer", session?.user.name);
  };

  return (
    <>
      <Header title="글 쓰기" rightPadding={8}>
        <Button
          isDisabled={!watch().content}
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
            <SummaryBlock url={summary.url} title={summary.title} text={summary.text} />
          </Box>
        )}
        <VStack h="100%" px={4}>
          <FormProvider {...methods}>
            <Box as="form" w="100%" onSubmit={handleSubmit(onSubmit)} id="secret-square-form">
              <Textarea
                placeholder="본문을 입력해주세요"
                {...register("content", {
                  required: true,
                  minLength: 10,
                  setValueAs: (value) => value.trim(),
                })}
                minH={180}
              />
            </Box>
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
      </WritingNavigation>
    </>
  );
}

export default FeedWritingPage;
