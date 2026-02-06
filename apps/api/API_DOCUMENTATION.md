# Shop API Documentation

This document provides a detailed description of the Shop API, including its endpoints, data models, and authentication mechanisms.

## Base URL

The base URL for all API endpoints is `/api`.

## Authentication

Most endpoints require authentication. The API uses JSON Web Tokens (JWT) for authentication. To authenticate, you need to include a valid JWT in the `Authorization` header of your requests as a Bearer token.

`Authorization: Bearer <your_jwt_token>`

## Endpoints

### Health Check

#### `GET /ping`

Returns a simple "pong" message to indicate that the API is running.

-   **Success Response (200 OK):**
    -   Content-Type: `text/plain`
    -   Body: `pong`

---

### Products

#### `GET /products`

Retrieves a paginated list of products.

-   **Query Parameters:**
    -   `page` (optional, integer, default: 1): The page number to retrieve.
    -   `limit` (optional, integer, default: 10): The number of products per page.
    -   `brand` (optional, string): The slug of the brand to filter by.
    -   `category` (optional, string): The slug of the category to filter by.
-   **Success Response (200 OK):**
    -   Content-Type: `application/json`
    -   Body: A `PaginatedProducts` object.

#### `POST /products`

Creates a new product.

-   **Request Body:**
    -   Content-Type: `application/json`
    -   Schema: `ProductInput`
-   **Success Response (201 Created):**
    -   Content-Type: `application/json`
    -   Body: The created `Product` object.
-   **Error Response (400 Bad Request):** If the input data is invalid.

#### `GET /products/{idOrSlug}`

Retrieves a single product by its ID or slug.

-   **Path Parameters:**
    -   `idOrSlug` (required, string): The ID or slug of the product.
-   **Success Response (200 OK):**
    -   Content-Type: `application/json`
    -   Body: The `Product` object.
-   **Error Response (404 Not Found):** If the product is not found.

#### `PUT /products/{id}`

Updates an existing product.

-   **Path Parameters:**
    -   `id` (required, integer): The ID of the product to update.
-   **Request Body:**
    -   Content-Type: `application/json`
    -   Schema: `ProductInput`
-   **Success Response (200 OK):**
    -   Content-Type: `application/json`
    -   Body: The updated `Product` object.
-   **Error Response (404 Not Found):** If the product is not found.

#### `DELETE /products/{id}`

Deletes a product.

-   **Path Parameters:**
    -   `id` (required, integer): The ID of the product to delete.
-   **Success Response (200 OK):** A success message.
-   **Error Response (404 Not Found):** If the product is not found.

---

### Brands

#### `GET /brands`

Retrieves a list of all brands.

-   **Success Response (200 OK):**
    -   Content-Type: `application/json`
    -   Body: An array of `Brand` objects.

#### `POST /brands`

Creates a new brand.

-   **Request Body:**
    -   Content-Type: `application/json`
    -   Schema: `BrandInput`
-   **Success Response (201 Created):**
    -   Content-Type: `application/json`
    -   Body: The created `Brand` object.

#### `GET /brands/{slug}`

Retrieves a single brand by its slug.

-   **Path Parameters:**
    -   `slug` (required, string): The slug of the brand.
-   **Success Response (200 OK):**
    -   Content-Type: `application/json`
    -   Body: The `Brand` object.
-   **Error Response (404 Not Found):** If the brand is not found.

#### `PUT /brands/{id}`

Updates an existing brand.

-   **Path Parameters:**
    -   `id` (required, integer): The ID of the brand to update.
-   **Request Body:**
    -   Content-Type: `application/json`
    -   Schema: `BrandInput`
-   **Success Response (200 OK):**
    -   Content-Type: `application/json`
    -   Body: The updated `Brand` object.
-   **Error Response (404 Not Found):** If the brand is not found.

#### `DELETE /brands/{id}`

Deletes a brand.

-   **Path Parameters:**
    -   `id` (required, integer): The ID of the brand to delete.
-   **Success Response (200 OK):** A success message.
-   **Error Response (404 Not Found):** If the brand is not found.

---

### Categories

#### `GET /categories`

Retrieves a list of all categories.

-   **Success Response (200 OK):**
    -   Content-Type: `application/json`
    -   Body: An array of `Category` objects.

#### `POST /categories`

Creates a new category.

-   **Request Body:**
    -   Content-Type: `application/json`
    -   Schema: `CategoryInput`
-   **Success Response (201 Created):**
    -   Content-Type: `application/json`
    -   Body: The created `Category` object.

#### `GET /categories/{slug}`

Retrieves a single category by its slug.

-   **Path Parameters:**
    -   `slug` (required, string): The slug of the category.
-   **Success Response (200 OK):**
    -   Content-Type: `application/json`
    -   Body: The `Category` object.
-   **Error Response (404 Not Found):** If the category is not found.

#### `PUT /categories/{id}`

Updates an existing category.

-   **Path Parameters:**
    -   `id` (required, integer): The ID of the category to update.
-   **Request Body:**
    -   Content-Type: `application/json`
    -   Schema: `CategoryInput`
-   **Success Response (200 OK):**
    -   Content-Type: `application/json`
    -   Body: The updated `Category` object.
-   **Error Response (404 Not Found):** If the category is not found.

#### `DELETE /categories/{id}`

Deletes a category.

-   **Path Parameters:**
    -   `id` (required, integer): The ID of the category to delete.
-   **Success Response (200 OK):** A success message.
-   **Error Response (404 Not Found):** If the category is not found.

---

### Authentication

#### `GET /auth/google`

Initiates the Google OAuth 2.0 authentication flow. The user will be redirected to the Google login page. After successful authentication, Google will redirect the user back to the frontend application with a JWT token.

-   **Response (302 Found):** Redirects to the Google authentication page or the frontend application.

---

### File Upload

#### `POST /upload`

Uploads a file.

-   **Request Body:**
    -   Content-Type: `multipart/form-data`
    -   `file` (required, file): The file to upload.
-   **Success Response (200 OK):**
    -   Content-Type: `application/json`
    -   Body: `{ "url": "https://<your-r2-public-url>/<file-key>" }`
-   **Error Response (400 Bad Request):** If the file is not provided.

---

## Schemas

### `Product`

| Name          | Type      | Description                               |
| ------------- | --------- | ----------------------------------------- |
| `id`          | integer   | The unique identifier for the product.    |
| `name`        | string    | The name of the product.                  |
| `description` | string    | The description of the product.           |
| `image`       | string    | The URL of the product image.             |
| `oldPrice`    | number    | The original price of the product.        |
| `discount`    | number    | The discount percentage.                  |
| `price`       | number    | The current price of the product.         |
| `brandId`     | integer   | The ID of the brand.                      |
| `slug`        | string    | The URL-friendly slug for the product.    |
| `isActive`    | boolean   | Whether the product is active.            |
| `isNew`       | boolean   | Whether the product is marked as new.     |
| `createdAt`   | string    | The date and time the product was created. |
| `categoryIds` | integer[] | An array of category IDs for the product. |

### `ProductInput`

| Name          | Type      | Description                               |
| ------------- | --------- | ----------------------------------------- |
| `name`        | string    | The name of the product.                  |
| `description` | string    | The description of the product.           |
| `image`       | string    | The URL of the product image.             |
| `price`       | number    | The price of the product.                 |
| `oldPrice`    | number    | The original price of the product.        |
| `brandId`     | integer   | The ID of the brand.                      |
| `isActive`    | boolean   | Whether the product is active.            |
| `isNew`       | boolean   | Whether the product is marked as new.     |
| `categoryIds` | integer[] | An array of category IDs for the product. |

### `PaginatedProducts`

| Name    | Type        | Description                             |
| ------- | ----------- | --------------------------------------- |
| `hits`  | `Product`[] | An array of `Product` objects.          |
| `total` | integer     | The total number of products available. |

### `Brand`

| Name   | Type    | Description                           |
| ------ | ------- | ------------------------------------- |
| `id`   | integer | The unique identifier for the brand.  |
| `name` | string  | The name of the brand.                |
| `slug` | string  | The URL-friendly slug for the brand.  |

### `BrandInput`

| Name   | Type   | Description            |
| ------ | ------ | ---------------------- |
| `name` | string | The name of the brand. |

### `Category`

| Name   | Type    | Description                              |
| ------ | ------- | ---------------------------------------- |
| `id`   | integer | The unique identifier for the category.  |
| `name` | string  | The name of the category.                |
| `slug` | string  | The URL-friendly slug for the category.  |

### `CategoryInput`

| Name   | Type   | Description               |
| ------ | ------ | ------------------------- |
| `name` | string | The name of the category. |

### `User`

| Name        | Type    | Description                                       |
| ----------- | ------- | ------------------------------------------------- |
| `id`        | integer | The unique identifier for the user.               |
| `name`      | string  | The name of the user.                             |
| `email`     | string  | The email address of the user.                    |
| `role`      | string  | The role of the user.                             |
| `googleId`  | string  | The user's Google ID.                             |
| `avatarUrl` | string  | The URL of the user's avatar image.               |
| `createdAt` | string  | The date and time the user was created.           |
| `updatedAt` | string  | The date and time the user was last updated.      |