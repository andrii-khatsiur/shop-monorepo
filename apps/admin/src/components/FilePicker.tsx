import React from "react";
import { Upload, message } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useUploadFile, useDeleteFile } from "../hooks/useUploadQueries";

const StyledUpload = styled(Upload)`
  .ant-upload-select {
    width: 102px !important;
    height: 102px !important;
  }

  .ant-upload-list-item-thumbnail {
    width: 100px !important;
    height: 100px !important;
    object-fit: cover;
  }
`;

interface FilePickerProps {
  value?: string;
  onChange?: (url: string | undefined) => void;
}

export const FilePicker: React.FC<FilePickerProps> = ({ value, onChange }) => {
  const uploadMutation = useUploadFile();
  const deleteMutation = useDeleteFile();

  const isLoading = uploadMutation.isPending || deleteMutation.isPending;

  const uploadButton = (
    <div>
      {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleCustomRequest: UploadProps["customRequest"] = async ({
    file,
    onSuccess,
    onError,
  }) => {
    try {
      const result = await uploadMutation.mutateAsync(file as File);
      onSuccess?.(result);
      onChange?.(result.url);
    } catch (error: any) {
      onError?.(error);
      onChange?.(undefined);
    }
  };

  const handleRemove = async () => {
    if (!value) return;

    try {
      await deleteMutation.mutateAsync(value);
      onChange?.(undefined);
    } catch {
      // Error handled by mutation
    }
  };

  const fileList: UploadFile[] = value
    ? [
        {
          uid: value,
          name: value.substring(value.lastIndexOf("/") + 1),
          status: "done",
          url: value,
          thumbUrl: value,
        },
      ]
    : [];

  return (
    <StyledUpload
      name="file"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={{ showPreviewIcon: false, showRemoveIcon: true }}
      customRequest={handleCustomRequest}
      beforeUpload={(file) => {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error("Зображення має бути менше 2MB!");
        }
        return isLt2M;
      }}
      fileList={fileList}
      onRemove={handleRemove}
      maxCount={1}
    >
      {fileList.length >= 1 ? null : uploadButton}
    </StyledUpload>
  );
};
