import {
  Box,
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
import { useInfoToast } from "../../../../hooks/custom/CustomToast";
import { SecretSquareFormData } from "../../../../types/models/square";

interface PollCreatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MIN_POLL_ITEMS = 2;
const MAX_POLL_ITEMS = 5;

export default function PollCreatorDrawer({ isOpen, onClose }: PollCreatorDrawerProps) {
  const { control, register, trigger, resetField, getValues } =
    useFormContext<SecretSquareFormData>();
  const {
    fields: pollItems,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "pollItems",
    rules: {
      validate: (pollList) => {
        const isValid =
          pollList.length >= MIN_POLL_ITEMS && pollList.every(({ name }) => !!name.trim());
        return isValid;
      },
    },
  });
  const infoToast = useInfoToast();

  const addPollItem = () => {
    append({ name: "" });
  };

  const handleClose = () => {
    resetField("pollItems");
    resetField("canMultiple");
    onClose();
  };

  const handleCompletePollCreation = async () => {
    const isValid = await trigger("pollItems");
    if (!isValid) {
      infoToast("free", "비어있는 항목이 있어요.");
      return;
    }
    resetField("pollItems", { defaultValue: getValues("pollItems") });
    resetField("canMultiple", { defaultValue: getValues("canMultiple") });
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
                    <Box
                      as="button"
                      type="button"
                      color="var(--color-mint)"
                      px={6}
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      <i className="fa-regular fa-circle-minus fa-xl" />
                    </Box>
                  )}
                </Flex>
              );
            })}
            <Button
              type="button"
              w="100%"
              onClick={addPollItem}
              isDisabled={pollItems.length >= MAX_POLL_ITEMS}
            >
              <i className="fa-regular fa-plus-large" style={{ marginRight: "8px" }} />
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
            onClick={handleCompletePollCreation}
          >
            완료
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
