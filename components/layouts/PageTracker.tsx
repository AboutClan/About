import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

import { BASE_BOTTOM_NAV_SEGMENT } from "../../pageTemplates/layout/Layout";
import { slideDirectionState } from "../../recoils/navigationRecoils";
import { parseUrlToSegments } from "../../utils/stringUtils";

const REGISTER_WRITING_SEQUENCE = {
  location: 1,
  name: 2,
  gender: 3,
  birthday: 4,
  mbti: 5,
  major: 6,
  interest: 7,
  comment: 8,
  instagram: 9,
  phone: 9,
  fee: 10,
};

const GATHER_WRITING_SEQUENCE = {
  category: 1,
  content: 2,
  date: 3,
  location: 4,
  condition: 5,
};

const GROUP_WRITING_SEQUENCE = {
  main: 1,
  sub: 2,
  guide: 3,
  content: 4,
  period: 5,
  hashTag: 6,
  condition: 7,
};
const STUDY_WRITING_SEQUENCE = {
  place: 1,
  content: 2,
  image: 3,
  complete: 4,
};

function PageTracker() {
  const router = useRouter();
  const pathname = usePathname();
  const setSlideDirection = useSetRecoilState(slideDirectionState);

  useEffect(() => {
    if (!pathname) return;

    const determineSlideDirection = (currentSegments, prevSegments) => {
      const curFirstSegment = currentSegments[0];

      const setLeftSlide = () => setSlideDirection("left");
      const setRightSlide = () => setSlideDirection("right");

      if (prevSegments?.[0] === "profile") {
        if (currentSegments?.[0] === "chat") {
          setRightSlide();
        } else setLeftSlide();
        return;
      }

      switch (curFirstSegment) {
        case "home":
          if (prevSegments[0] !== "vote") setLeftSlide();

          break;

        case "study":
        
          if (currentSegments?.[1] === "writing") {
            handleWritingPage(
              STUDY_WRITING_SEQUENCE,
              currentSegments,
              prevSegments,
              setLeftSlide,
              setRightSlide,
            );
            break;
          }

          if (!["home", "studyList", "studyPage"].includes(prevSegments?.[0])) {
            setLeftSlide();
          }
          break;

        case "user":
          if (!currentSegments[1] && prevSegments[0] !== "home") {
            setLeftSlide();
          }
          break;

        case "event":
          if (!currentSegments[1] && prevSegments[0] !== "home") {
            setLeftSlide();
          }
          break;

        case "store":
          if (prevSegments[0] === "home") {
            setRightSlide();
            break;
          }
          if (!currentSegments[1] && prevSegments[0] !== "event") {
            setLeftSlide();
          }
          break;

        case "member":
          if (!currentSegments[2] && prevSegments[0] !== "home") {
            setLeftSlide();
          }
          break;

        case "register":
          handleWritingPage(
            REGISTER_WRITING_SEQUENCE,
            currentSegments,
            prevSegments,
            setLeftSlide,
            setRightSlide,
          );

          break;

        case "gather":
          if (currentSegments?.[1] === "writing") {
            handleWritingPage(
              GATHER_WRITING_SEQUENCE,
              currentSegments,
              prevSegments,
              setLeftSlide,
              setRightSlide,
            );
            break;
          }

          if (prevSegments[0] === "gather") {
            if (currentSegments?.[2] === "setting") {
              setRightSlide();
            } else if (prevSegments?.[1]) {
              setLeftSlide();
            }
          }
          break;

        case "group":
          if (prevSegments?.[0] === "home") {
            return;
          }
          handleWritingPage(
            GROUP_WRITING_SEQUENCE,
            currentSegments,
            prevSegments,
            setLeftSlide,
            setRightSlide,
          );
          break;
        case "square":
          if (prevSegments?.[0] === "square" && prevSegments?.[1] === "writing") {
            setLeftSlide();
          }
          break;
        default:
          break;
      }
    };

    const handleWritingPage = (
      pageSequence,
      currentSegments,
      prevSegments,
      setLeftSlide,
      setRightSlide,
    ) => {
      const isRegister = prevSegments?.[0] === "register";

      if (!currentSegments[1]) {
        setLeftSlide();
      } else if (currentSegments[1] === "writing" || isRegister) {
        if (!prevSegments[2] && !isRegister) {
          setRightSlide();
        } else {
          const prevCategoryValue = pageSequence[isRegister ? prevSegments[1] : prevSegments[2]];
          const curCategoryValue =
            pageSequence[isRegister ? currentSegments[1] : currentSegments[2]];

          if (prevCategoryValue < curCategoryValue) {
            setRightSlide();
          } else {
            setLeftSlide();
          }
        }
      }
    };

    const handleRouterStart = (url) => {
      if (!url || !pathname) return;
      const prevSegments = parseUrlToSegments(pathname);
      const currentSegments = parseUrlToSegments(url);

      if (
        prevSegments[0] !== currentSegments[0] &&
        BASE_BOTTOM_NAV_SEGMENT.includes(prevSegments[0]) &&
        BASE_BOTTOM_NAV_SEGMENT.includes(currentSegments[0])
      ) {
        setSlideDirection(null);
        return;
      }

      determineSlideDirection(currentSegments, prevSegments);
    };

    const handleRouterCompleted = (url) => {
      if (url) {
        setSlideDirection("right");
      }
    };

    router.events.on("routeChangeStart", handleRouterStart);
    router.events.on("routeChangeComplete", handleRouterCompleted);
    return () => {
      router.events.off("routeChangeStart", handleRouterStart);
      router.events.off("routeChangeComplete", handleRouterCompleted);
    };
  }, [router.events, pathname, setSlideDirection]);

  return null;
}

export default PageTracker;
