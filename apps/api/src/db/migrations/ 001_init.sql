CREATE TABLE
  users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    google_id TEXT UNIQUE,
    name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    is_active INTEGER NOT NULL DEFAULT 1
  );

CREATE UNIQUE INDEX IF NOT EXISTS idx_brands_slug ON brands (slug);

CREATE TABLE
  IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    is_active INTEGER NOT NULL DEFAULT 1,
    parent_id INTEGER REFERENCES categories (id) ON DELETE SET NULL
  );

CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug ON categories (slug);

CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories (parent_id);

CREATE TABLE
  IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    old_price REAL,
    discount INTEGER,
    price REAL NOT NULL,
    brand_id INTEGER,
    slug TEXT NOT NULL UNIQUE,
    is_active INTEGER NOT NULL DEFAULT 1,
    is_new INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands (id) ON DELETE SET NULL
  );

CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON products (slug);

CREATE TABLE
  IF NOT EXISTS product_categories (
    product_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    root_category_id INTEGER REFERENCES categories (id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
  );

CREATE INDEX IF NOT EXISTS idx_pc_root_category ON product_categories (root_category_id);

CREATE INDEX IF NOT EXISTS idx_pc_category ON product_categories (category_id);

CREATE TRIGGER set_root_category_id AFTER INSERT ON product_categories BEGIN
UPDATE product_categories
SET
  root_category_id = COALESCE(
    (
      SELECT
        parent_id
      FROM
        categories
      WHERE
        id = NEW.category_id
    ),
    NEW.category_id
  )
WHERE
  product_id = NEW.product_id
  AND category_id = NEW.category_id;

END;