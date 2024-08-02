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
  const { control, register, trigger, resetField, getValues } =
    useFormContext<SecretSquareFormData>();
  // TODO 2 <= pollItems.length <= 5
  const {
    fields: pollItems,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "pollItems",
    rules: {
      validate: (pollList) => {
        // pollist is default value
        const isDefaultValue = pollList.length === 3 && pollList.every(({ name }) => name === "");
        const isValid =
          pollList.length >= 2 && pollList.every(({ name }) => !!name && !!name.trim());
        return isDefaultValue || isValid || "2개 이상의 항목을 입력해주세요.";
      },
    },
  });

  const addPollItem = () => {
    append({ name: "" });
  };

  const handleClose = () => {
    resetField("pollItems");
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
            {pollItems.map((item, index) => {
              const showRemovePollItemButton = index >= 2;
              return (
                <Flex key={item.id} w="100%">
                  <Input
                    autoFocus={index === 0}
                    placeholder="항목 입력"
                    {...register(`pollItems.${index}.name`, {
                      setValueAs: (value) => value.trim(),
                    })}
                  />
                  {showRemovePollItemButton && (
                    <Button
                      type="button"
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      삭제
                    </Button>
                  )}
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
              <Switch id="can-multiple" colorScheme="mintTheme" {...register("canMultiple")} />
            </Flex>
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button
            type="button"
            w="100%"
            colorScheme="mintTheme"
            onClick={async () => {
              const isValid = await trigger("pollItems");
              if (isValid) {
                resetField("pollItems", { defaultValue: getValues("pollItems") });
                resetField("canMultiple", { defaultValue: getValues("canMultiple") });
                onClose();
              }
            }}
          >
            완료
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
