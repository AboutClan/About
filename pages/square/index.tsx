import { useState } from "react";

import Header from "../../components/layouts/Header";
import SquareTabNav, { SquareTab } from "../../pageTemplates/square/SquareTabNav";

function SquarePage() {
  const [tab, setTab] = useState<SquareTab>("시크릿 스퀘어");

  return (
    <>
      <Header title="어바웃 스퀘어" isBack={false} />
      <SquareTabNav tab={tab} setTab={setTab} />
    </>
  );
}

export default SquarePage;
