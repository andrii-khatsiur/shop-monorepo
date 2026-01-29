import React from "react";
import type { ReactNode } from "react";
import { Modal as AntModal } from "antd";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: ReactNode;
  width?: string | number;
  closable?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  title,
  onClose,
  children,
  footer,
  width,
  closable,
}) => {
  return (
    <AntModal
      title={title}
      open={open}
      onCancel={onClose}
      footer={footer}
      width={width}
      closable={closable}
    >
      {children}
    </AntModal>
  );
};
