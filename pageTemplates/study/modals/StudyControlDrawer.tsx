import { Box, Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { StudyUserCheckIcon } from "../../../components/Icons/ControlButtonIcon";
import BottomFlexDrawer from "../../../components/organisms/drawer/BottomFlexDrawer";
import { dayjsToStr } from "../../../utils/dateTimeUtils";
import StudyApplyDrawer from "../../vote/voteDrawer/StudyApplyDrawer";
import StudyOpenDrawer from "../../vote/voteDrawer/StudyOpenDrawer";

type DrawerType = "apply" | "open";

interface StudyControlDrawerProps {
  date: string;
  onClose: () => void;
}

function StudyControlDrawer({ date, onClose }: StudyControlDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modalParam = searchParams.get("modal") as DrawerType;

  const [drawerType, setDrawerType] = useState<DrawerType>(null);

  useEffect(() => {
    if (modalParam) setDrawerType(modalParam);
    else {
      setDrawerType(null);
    }
  }, [modalParam]);

  const buttonProps: {
    text: string;
    icon: JSX.Element;
    func: () => void;
    isDisabled?: boolean;
  }[] = [
    {
      text: "스터디 신청",
      icon: <StudyApplyIcon />,
      func: () => {
        router.push(
          { pathname: router.pathname, query: { ...router.query, modal: "apply" } },
          undefined,
          {
            shallow: true,
          },
        );
        setDrawerType("apply");
      },
    },
    {
      text: "스터디 개설",
      icon: <StudyOpenIcon />,
      func: () => {
        router.push(
          { pathname: router.pathname, query: { ...router.query, modal: "open" } },
          undefined,
          {
            shallow: true,
          },
        );
        setDrawerType("open");
      },
    },
    {
      text: " 실시간 공부 인증",
      icon: <StudyUserCheckIcon color="gray" />,
      func: () => {
        router.push(`/vote/attend/certification?date=${dayjsToStr(dayjs())}&type=soloRealTimes`);
      },
    },
  ];

  return (
    <>
      <BottomFlexDrawer
        isOverlay
        isDrawerUp
        setIsModal={onClose}
        isHideBottom
        drawerOptions={{ footer: { text: "취소", func: onClose } }}
        height={249}
        zIndex={800}
      >
        {buttonProps.map((props, idx) => (
          <Button
            key={idx}
            h="52px"
            justifyContent="flex-start"
            display="flex"
            variant="unstyled"
            py={4}
            w="100%"
            lineHeight="20px"
            onClick={props.func}
            isDisabled={props?.isDisabled}
          >
            <Box w="20px" h="20px" mr={4} opacity={0.28}>
              {props.icon}
            </Box>
            <Box fontSize="13px" color="var(--gray-600)" fontWeight="500">
              {props.text}
            </Box>
          </Button>
        ))}
      </BottomFlexDrawer>

      {drawerType === "apply" && (
        <StudyApplyDrawer
          defaultDate={date}
          onClose={() => {
            onClose();
            router.back();
          }}
        />
      )}
      {drawerType === "open" && (
        <StudyOpenDrawer
          onClose={() => {
            onClose();
            router.back();
          }}
        />
      )}
    </>
  );
}

function StudyApplyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="#424242"
    >
      <path d="M480-160q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q74 0 126 17t112 52q11 6 16.5 14t5.5 21v418q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-481q15 5 29.5 11t28.5 14q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm140-240v-440l120-40v440l-120 40Z" />
    </svg>
  );
}

function StudyOpenIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="#424242"
    >
      <path d="M238-200q-100-5-149-42T40-349q0-65 53.5-105.5T242-503q39-3 58.5-12.5T320-542q0-26-29.5-39T193-600l7-80q103 8 151.5 41.5T400-542q0 53-38.5 83T248-423q-64 5-96 23.5T120-349q0 35 28 50.5t94 18.5l-4 80Zm317-30L390-395l345-345q20-20 47.5-20t47.5 20l70 70q20 20 20 47.5T900-575L555-230Zm-196 70q-17 4-30-9t-9-30l31-151 158 158-150 32Z" />
    </svg>
  );
}

export default StudyControlDrawer;
