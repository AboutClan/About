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

const DEFAULT_POLL_ITEMS_COUNT = 2;
const MIN_POLL_ITEMS_COUNT = 2;
const MAX_POLL_ITEMS_COUNT = 5;

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
        // pollist is default value
        const isDefaultValue =
          pollList.length === DEFAULT_POLL_ITEMS_COUNT && pollList.every(({ name }) => name === "");
        const isValid =
          pollList.length >= MIN_POLL_ITEMS_COUNT && pollList.every(({ name }) => !!name.trim());
        return isDefaultValue || isValid;
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
        <DrawerCloseButton size="lg" />
        <DrawerHeader px="16px" h="var(--header-h)">
          투표 만들기
        </DrawerHeader>
        <DrawerBody px="16px">
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
                      ml="4px"
                      as="button"
                      type="button"
                      color="var(--gray-500)"
                      px={2}
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
              isDisabled={pollItems.length >= MAX_POLL_ITEMS_COUNT}
            >
              <i className="fa-regular fa-plus-large" style={{ marginRight: "8px" }} />
              항목 추가
            </Button>
            <Flex mt="12px" align="center" justifyContent="space-between" w="100%">
              <FormLabel htmlFor="can-multiple" mb="0">
                복수 선택 가능
              </FormLabel>
              <Switch id="can-multiple" colorScheme="mint" {...register("canMultiple")} />
            </Flex>
          </VStack>
        </DrawerBody>

        <DrawerFooter px="16px">
          <Button
            h="46px"
            type="button"
            w="100%"
            colorScheme="mint"
            onClick={handleCompletePollCreation}
          >
            완료
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
