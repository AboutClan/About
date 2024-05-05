import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { FullScreen } from "../styles/layout/modal";
import { DispatchBoolean } from "../types/hooks/reactTypes";

interface IModalPortal {
  children?: React.ReactNode;
  setIsModal?: DispatchBoolean;
  opacity?: number;
}

function ModalPortal({ children, setIsModal, opacity = 0.4 }: IModalPortal) {
  const ref = useRef<Element | null>();
  const [mounted, setMounted] = useState(false);

  const closeModal = () => {
    if (setIsModal) setIsModal(false);
  };

  useEffect(() => {
    setMounted(true);

    if (document) {
      const dom = document.getElementById("root-modal");
      ref.current = dom;
    }
  }, []);
  if (ref.current && mounted) {
    return createPortal(
      <div className="modal-container">
        <FullScreen onClick={closeModal} opacity={opacity} />
        {children}
      </div>,
      ref.current,
    );
  }
  return null;
}

export default ModalPortal;
