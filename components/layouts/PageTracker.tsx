import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

import { BASE_BOTTOM_NAV_SEGMENT } from "../../pageTemplates/layout/Layout";
import { slideDirectionState } from "../../recoils/navigationRecoils";
import { parseUrlToSegments } from "../../utils/stringUtils";

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
  hasgTag: 6,
  condition: 7,
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

      switch (curFirstSegment) {
        case "home":
          setLeftSlide();
          break;

        case "study":
          if (prevSegments[0] !== "home" && prevSegments[0] !== "studyList") {
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
          if (!currentSegments[1] && prevSegments[0] !== "event") {
            setLeftSlide();
          }
          break;

        case "member":
          if (!currentSegments[2] && prevSegments[0] !== "home") {
            setLeftSlide();
          }
          break;

        case "gather":
          handleWritingPage(
            GATHER_WRITING_SEQUENCE,
            currentSegments,
            prevSegments,
            setLeftSlide,
            setRightSlide,
          );
          break;

        case "group":
          handleWritingPage(
            GROUP_WRITING_SEQUENCE,
            currentSegments,
            prevSegments,
            setLeftSlide,
            setRightSlide,
          );
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
      if (!currentSegments[1]) {
        setLeftSlide();
      } else if (currentSegments[1] === "writing") {
        if (!prevSegments[2]) {
          setRightSlide();
        } else {
          const prevCategoryValue = pageSequence[prevSegments[2]];
          const curCategoryValue = pageSequence[currentSegments[2]];

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
