import React, { useState } from "react";
import { Upload, message } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { apiClient } from "../services/api";

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
  value?: string; // URL of the uploaded file
  onChange?: (url: string | undefined) => void;
  loading?: boolean;
}

export const FilePicker: React.FC<FilePickerProps> = ({
  value,
  onChange,
  loading = false,
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const isLoading = loading || internalLoading;

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
      setInternalLoading(true);
      const result = await apiClient.upload.file(file as File);
      onSuccess?.(result);
      onChange?.(result.url);
      message.success("Файл успішно завантажено!");
    } catch (error: any) {
      onError?.(error);
      message.error(`Помилка завантаження файлу: ${error.message}`);
      onChange?.(undefined); // Clear value on error
    } finally {
      setInternalLoading(false);
    }
  };

  const fileList: UploadFile[] = value
    ? [
        {
          uid: value, // Unique id, can be the URL itself
          name: value.substring(value.lastIndexOf("/") + 1), // Extract filename from URL
          status: "done",
          url: value,
          thumbUrl: value, // Use the URL as thumbnail
        },
      ]
    : [];

  const handleRemove = () => {
    onChange?.(undefined);
    message.info("Файл видалено.");
  };

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
      maxCount={1} // Allow only one file
    >
      {fileList.length >= 1 ? null : uploadButton}
    </StyledUpload>
  );
};
