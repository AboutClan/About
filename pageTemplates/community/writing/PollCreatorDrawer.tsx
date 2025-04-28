import {
  Box,
  Button,
  Drawer,
  DrawerBody,
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

import { Input } from "../../../components/atoms/Input";
import { useTypeToast } from "../../../hooks/custom/CustomToast";
import { SecretSquareFormData } from "../../../types/models/square";
import { XIcon } from "../../studyPage/studyPageMap/TopNav";

interface PollCreatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_POLL_ITEMS_COUNT = 2;
const MIN_POLL_ITEMS_COUNT = 2;
const MAX_POLL_ITEMS_COUNT = 5;

export default function PollCreatorDrawer({ isOpen, onClose }: PollCreatorDrawerProps) {
  const typeToast = useTypeToast();
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
      typeToast("empty");
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
        <DrawerHeader
          display="flex"
          justifyContent="space-between"
          fontSize="18px"
          pl={5}
          pr={3}
          h="var(--header-h)"
          alignItems="center"
        >
          <Box>투표 만들기</Box>
          <Button variant="nostyle" px={2}>
            <XIcon />
          </Button>
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
                    size="md"
                  />
                  {showRemovePollItemButton && (
                    <Box
                      ml={2}
                      as="button"
                      type="button"
                      color="var(--gray-600)"
                      px={2}
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      <i className="fa-regular fa-circle-minus fa-lg" />
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
