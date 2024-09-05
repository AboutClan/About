import { useEffect, useState } from "react";

export function useKeypadHeight() {
  const [keypadHeight, setKeypadHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;
      const windowHeight = window.innerHeight;

      setKeypadHeight(windowHeight - viewportHeight);
    };
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
    }
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  return keypadHeight;
}
