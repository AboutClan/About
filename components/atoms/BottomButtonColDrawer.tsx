import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import styled from "styled-components";

import { useCompleteToast, useErrorToast } from "../../hooks/custom/CustomToast";
import { IModal } from "../../types/components/modalTypes";
import { BasicButtonProps } from "../../types/components/propTypes";

interface IBottomButtonColDrawer extends IModal {
  infoArr: BasicButtonProps[];
}

function BottomButtonColDrawer({ infoArr, setIsModal }: IBottomButtonColDrawer) {
  const completeToast = useCompleteToast();
  const errorToast = useErrorToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [declareIdx, setDeclareIdx] = useState("0");
  console.log(342);
  return (
    <Drawer placement="bottom" onClose={onClose} isOpen>
      <DrawerOverlay />
      <DrawerContent bg="transparent">
        <DrawerBody px={5} display="flex" justifyContent="center" alignItems="center">
          <Flex direction="column" w="full" justify="center" align="center" onClick={onClose}>
            {infoArr?.map((info, idx) => (
              <Button
                borderStartStartRadius={idx === 0 ? undefined : 0}
                borderTopRightRadius={idx === 0 ? undefined : 0}
                borderEndEndRadius={idx === 0 ? 0 : undefined}
                borderEndStartRadius={idx === 0 ? 0 : undefined}
                w="full"
                mt={0.5}
                key={idx}
                size="lg"
                bg="white"
              >
                {info.text}
              </Button>
            ))}
            <Button w="full" size="lg" mt={2} bg="white">
              취 소
            </Button>
            {/* <SocialButton
              url="/study/writing/place"
              title="스터디"
              subTitle="직접 스터디를 만들어봐요"
              icon={<i className="fa-regular fa-books" style={{ color: "white" }} />}
              color="green.400"
            />
            <SocialButton
              url="/gather/writing/category"
              title="모임"
              subTitle="재밌는 모임으로 친해져요"
              icon={<i className="fa-regular fa-cloud-bolt" style={{ color: "white" }} />}
              color="red.400"
            />
            <SocialButton
              url="/group/writing/main"
              title="소모임"
              subTitle="비슷한 관심사의 인원들과 함께해요!"
              icon={<i className="fa-regular fa-campfire" style={{ color: "white" }} />}
              color="blue.400"
            /> */}
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

const Title = styled.span``;

export default BottomButtonColDrawer;
