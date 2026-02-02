import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Tag, Spin, Typography, Descriptions, theme } from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import styled from "styled-components";
import type { Product } from "@shop-monorepo/types";

import { useProduct } from "../../hooks/useProductQueries";
import { useBrands } from "../../hooks/useBrandQueries";
import { useCategories } from "../../hooks/useCategoryQueries";
import { useModal } from "../../context/ModalContext";
import { EditProductForm } from "./EditProductForm";
import { ROUTES } from "../../routes/routes";
import { PageContainer, Toolbar } from "../../components/PageLayout";
import { formatCategoryName } from "../../utils/categoryUtils";

const { Title, Text, Paragraph } = Typography;

const ContentContainer = styled.div`
  display: flex;
  gap: 32px;
  flex: 1;
  overflow: auto;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImageSection = styled.div`
  flex-shrink: 0;
  width: 400px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ProductImage = styled.img<{ $radius: number }>`
  width: 100%;
  height: auto;
  border-radius: ${(props) => props.$radius}px;
  object-fit: cover;
`;

const DetailsSection = styled.div`
  flex: 1;
  min-width: 0;
`;

const PriceBlock = styled.div`
  margin-bottom: 16px;
`;

const CurrentPrice = styled(Text)`
  font-size: 24px;
  font-weight: bold;
`;

const OldPrice = styled(Text)`
  font-size: 18px;
  text-decoration: line-through;
  margin-left: 12px;
`;

const DiscountTag = styled(Tag)`
  margin-left: 12px;
  font-size: 14px;
`;

const StatusTags = styled.div`
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export const ProductViewPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { token } = theme.useToken();

  const { data: product, isLoading, error } = useProduct(slug || "");
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();

  const handleBack = () => {
    navigate(ROUTES.PRODUCTS);
  };

  const handleEdit = () => {
    if (!product) return;
    openModal({
      title: "Редагувати продукт",
      content: <EditProductForm product={product} />,
      footer: null,
    });
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <Spin size="large" />
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (error || !product) {
    return (
      <PageContainer>
        <Toolbar>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
            Назад до списку
          </Button>
        </Toolbar>
        <Text type="danger">
          {error?.message || "Продукт не знайдено"}
        </Text>
      </PageContainer>
    );
  }

  const brandName = brands.find((b) => b.id === product.brandId)?.name;
  const categoryNames = product.categoryIds
    .map((id) => formatCategoryName(categories, id))
    .filter(Boolean);

  const formattedDate = new Date(product.createdAt).toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <PageContainer>
      <Toolbar>
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          Назад до списку
        </Button>
        <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
          Редагувати
        </Button>
      </Toolbar>

      <ContentContainer>
        <ImageSection>
          {product.image && (
            <ProductImage
              src={product.image}
              alt={product.name}
              $radius={token.borderRadius}
            />
          )}
        </ImageSection>

        <DetailsSection>
          <Title level={2}>{product.name}</Title>

          <PriceBlock>
            <CurrentPrice>{product.price} грн</CurrentPrice>
            {product.oldPrice && (
              <OldPrice type="secondary">{product.oldPrice} грн</OldPrice>
            )}
            {product.discount && (
              <DiscountTag color="red">-{product.discount}%</DiscountTag>
            )}
          </PriceBlock>

          <StatusTags>
            <Tag color={product.isActive ? "green" : "default"}>
              {product.isActive ? "Активний" : "Неактивний"}
            </Tag>
            {product.isNew && <Tag color="blue">Новинка</Tag>}
          </StatusTags>

          <Descriptions column={1} bordered size="small">
            {brandName && (
              <Descriptions.Item label="Бренд">{brandName}</Descriptions.Item>
            )}
            {categoryNames.length > 0 && (
              <Descriptions.Item label="Категорії">
                {categoryNames.join(", ")}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Slug">{product.slug}</Descriptions.Item>
            <Descriptions.Item label="Дата створення">
              {formattedDate}
            </Descriptions.Item>
          </Descriptions>

          {product.description && (
            <>
              <Title level={4} style={{ marginTop: 24 }}>
                Опис
              </Title>
              <Paragraph>{product.description}</Paragraph>
            </>
          )}
        </DetailsSection>
      </ContentContainer>
    </PageContainer>
  );
};
