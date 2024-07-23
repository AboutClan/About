import { useEffect, useState } from "react";

const WritingNavigation = () => {
  const [modalBottom, setModalBottom] = useState("0px");

  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;
      const windowHeight = window.innerHeight;
      const keyboardHeight = windowHeight - viewportHeight;

      if (keyboardHeight > 0) {
        // 모바일 키보드가 올라왔을 때의 높이 기준 조정
        setModalBottom(`${keyboardHeight}px`); // 모달을 키보드 바로 위에 위치
      } else {
        setModalBottom("0px"); // 기본 위치
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: modalBottom,
        left: 0,
        right: 0,
        backgroundColor: "white",
        padding: "20px",
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <p>This is AComponent</p>
    </div>
  );
};

export default WritingNavigation;
