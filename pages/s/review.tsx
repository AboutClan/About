import { useEffect } from "react";

export default function Review() {
  useEffect(() => {
    const openUrl = "https://about20s.club/_open" + `?dl=home/gatherReview?id=4786`;

    window.location.replace(openUrl);
  }, []);

  return <></>;
}
