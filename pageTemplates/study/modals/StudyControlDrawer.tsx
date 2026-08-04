import { Box, Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import BottomFlexDrawer from "../../../components/organisms/drawer/BottomFlexDrawer";
import StudyApplyDrawer from "../../../components/services/study/apply/StudyApplyDrawer";
import { useCheckGuest } from "../../../hooks/custom/UserHooks";
import CafeMapGuestModal from "../../../modals/cafeMap/CafeMapGuestModal";
import { dayjsToStr } from "../../../utils/dateTimeUtils";
import StudyOpenDrawer from "../../vote/StudyOpenDrawer";

type DrawerType = "apply" | "open";

interface StudyControlDrawerProps {
  date: string;
  onClose: () => void;
}

function StudyControlDrawer({ date, onClose }: StudyControlDrawerProps) {
  const isGuest = useCheckGuest();
  const router = useRouter();
  const pathname = usePathname();
  const isCafeMap = pathname === "/cafe-map";
  const searchParams = useSearchParams();
  const modalParam = searchParams.get("modal") as DrawerType;

  const [drawerType, setDrawerType] = useState<DrawerType>(null);
  const [isCafeMapGuestModal, setIsCafeMapGuestModal] = useState(false);

  useEffect(() => {
    if (modalParam) setDrawerType(modalParam);
    else {
      setDrawerType(null);
    }
  }, [modalParam]);

  const handleGuest = () => {
    if (isCafeMap) {
      setIsCafeMapGuestModal(true);
      return;
    }

    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, guest: "on" },
      },
      undefined,
      { shallow: true },
    );
  };

  const buttonProps: {
    text: string;
    icon: JSX.Element;
    func: () => void;
    isDisabled?: boolean;
  }[] = [
    {
      text: "스터디 매칭 신청",
      icon: <StudyApplyIcon isActive={!isCafeMap} />,
      func: () => {
        if (isGuest) {
          handleGuest();
          return;
        }
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
      text: "직접 스터디 개설",
      icon: <StudyOpenIcon isActive={!isCafeMap} />,
      func: () => {
        if (isGuest) {
          handleGuest();
          return;
        }
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
      text: "개인 공부 인증",
      icon: <StudyCheckIcon />,
      func: () => {
        if (isGuest) {
          handleGuest();
          return;
        }
        router.push(`/vote/attend/configuration?date=${dayjsToStr(dayjs())}&type=soloRealTimes`);
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
        drawerOptions={{ footer: { text: "닫 기", func: onClose } }}
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
            <Box w="20px" h="20px" mr={4} opacity={0.5}>
              {props.icon}
            </Box>
            <Box
              fontSize="13px"
              color={
                isCafeMap && props.text !== "개인 공부 인증" ? "var(--gray-400)" : "var(--gray-600)"
              }
              fontWeight="regular"
            >
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
      {isCafeMapGuestModal && <CafeMapGuestModal setIsModal={setIsCafeMapGuestModal} />}
    </>
  );
}

export function StudyApplyIcon({ isActive = true }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20px"
      height="20px"
      viewBox="0 -960 960 960"
      fill={isActive ? "#424242" : "var(--gray-500)"}
    >
      <path d="M287-687q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47Zm353 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T584-952q14-5 28-6.5t28-1.5q66 0 113 47t47 113q0 66-47 113t-113 47Zm120 480q-83 0-141.5-58.5T560-360q0-84 58.5-142T760-560q84 0 142 58t58 142q0 83-58 141.5T760-160Zm-28-110 141-142-28-28-113 113-57-57-28 29 85 85ZM80-320v-112q0-34 17.5-62.5T144-538q62-31 126-46.5T400-600q45 0 89 7t88 22q-54 47-78 113.5T483-320H80Z" />
    </svg>
  );
}

export function StudyOpenIcon({ isActive = true }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20px"
      height="20px"
      viewBox="0 -960 960 960"
      fill={isActive ? "#424242" : "var(--gray-500)"}
    >
      <path d="M720-160h-80q-17 0-28.5-11.5T600-200q0-17 11.5-28.5T640-240h80v-80q0-17 11.5-28.5T760-360q17 0 28.5 11.5T800-320v80h80q17 0 28.5 11.5T920-200q0 17-11.5 28.5T880-160h-80v80q0 17-11.5 28.5T760-40q-17 0-28.5-11.5T720-80v-80Zm-600 0q-17 0-28.5-11.5T80-200v-200h-7q-19 0-31-14.5T34-448l40-200q3-14 14-23t25-9h534q14 0 25 9t14 23l40 200q4 19-8 33.5T687-400h-7v80q0 17-11.5 28.5T640-280q-17 0-28.5-11.5T600-320v-80H440v200q0 17-11.5 28.5T400-160H120Zm40-80h200v-160H160v160Zm-40-480q-17 0-28.5-11.5T80-760q0-17 11.5-28.5T120-800h520q17 0 28.5 11.5T680-760q0 17-11.5 28.5T640-720H120Z" />
    </svg>
  );
}
export function StudyCheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20px"
      height="20px"
      viewBox="0 -960 960 960"
      fill="#424242"
    >
      <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q48 0 93.5 11t87.5 32q15 8 19.5 24t-5.5 30q-10 14-26.5 18t-32.5-4q-32-15-66.5-23t-69.5-8q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-8-.5-15.5T798-511q-2-17 6.5-32.5T830-564q16-5 30 3t16 24q2 14 3 28t1 29q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-328 372-373q11-11 27.5-11.5T852-781q11 11 11 28t-11 28L452-324q-12 12-28 12t-28-12L282-438q-11-11-11-28t11-28q11-11 28-11t28 11l86 86Z" />
    </svg>
  );
}

export default StudyControlDrawer;
