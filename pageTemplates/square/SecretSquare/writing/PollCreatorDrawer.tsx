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
  VStack,
} from "@chakra-ui/react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Input } from "../../../../components/atoms/Input";
import { SecretSquareFormData } from "../../../../types/models/square";

interface PollCreatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PollCreatorDrawer({ isOpen, onClose }: PollCreatorDrawerProps) {
  const { control, register, trigger, resetField } = useFormContext<SecretSquareFormData>();
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

  const handleClose = () => {
    resetField("pollList");
    resetField("canMultiple");
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} size="full" placement="bottom">
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
