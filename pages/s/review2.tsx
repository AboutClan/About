import { useEffect } from "react";

export default function Review() {
  useEffect(() => {
    const openUrl = "https://about20s.club/_open" + `?dl=home/gatherReview`;

    window.location.replace(openUrl);
  }, []);

  return <></>;
}
