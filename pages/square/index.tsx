import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import SquareLoungeSection from "../../pageTemplates/square/SquareLoungeSection";
import SquareSecretSection from "../../pageTemplates/square/SquareSecretSection";
import SquareTabNav, { SquareTab } from "../../pageTemplates/square/SquareTabNav";

function SquarePage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as "secret" | "lounge";

  const [tab, setTab] = useState<SquareTab>("시크릿 스퀘어");

  useEffect(() => {
    if (tabParam === "secret") setTab("시크릿 스퀘어");
    if (tabParam === "lounge") setTab("라운지");
  }, [tabParam]);

  return (
    <>
      <Header title="어바웃 스퀘어" isBack={false} />
      <Slide>
        <SquareTabNav tab={tab} setTab={setTab} />
        {tab === "시크릿 스퀘어" ? <SquareSecretSection /> : <SquareLoungeSection />}
      </Slide>
    </>
  );
}

export default SquarePage;
