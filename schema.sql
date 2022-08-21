CREATE DATABASE financial_management;

CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS purchases (
  id serial PRIMARY KEY,
  user_id INTEGER NOT NULL,
  description VARCHAR(255) NOT NULL,
  amount INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  place VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- INSERT INTO users (first_name, last_name, email, password) VALUES ('test', 'user', 'user@test.com', 'test');

-- TODO: add income table

-- ALTER TABLE purchases
-- ALTER COLUMN user_id
-- DROP NOT NULL;

-- ALTER TABLE purchases
-- ALTER COLUMN amount
-- DROP NOT NULL;

-- ALTER TABLE purchases
-- ALTER COLUMN unit_price
-- DROP NOT NULL;

-- ALTER TABLE purchases
-- ALTER COLUMN place
-- DROP NOT NULL;