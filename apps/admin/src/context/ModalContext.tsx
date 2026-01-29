import type { ReactNode } from "react";
import React, { createContext, useContext, useState } from "react";
import { Modal } from "../components/Modal";

export interface ModalConfig {
  title: string;
  content: ReactNode;
  footer?: ReactNode; // Optional: for custom footer
  width?: string | number; // Optional: for custom width
  closable?: boolean; // Optional: whether the modal can be closed by clicking mask or close button
  // Add other Ant Design Modal props as needed
}

interface ModalContextType {
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalState, setModalState] = useState<ModalConfig & { open: boolean }>(
    {
      open: false,
      title: "",
      content: null,
    }
  );

  const openModal = (config: ModalConfig) => {
    setModalState({ open: true, ...config });
  };

  const closeModal = () => {
    setModalState((prevState) => ({ ...prevState, open: false }));
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal
        open={modalState.open}
        title={modalState.title}
        onClose={closeModal}
        footer={modalState.footer}
        width={modalState.width}
        closable={modalState.closable}
      >
        {modalState.content}
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
