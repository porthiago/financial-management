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

ALTER TABLE purchases
ALTER COLUMN user_id
DROP NOT NULL;

ALTER TABLE purchases
ALTER COLUMN amount
DROP NOT NULL;

ALTER TABLE purchases
ALTER COLUMN unit_price
DROP NOT NULL;

ALTER TABLE purchases
ALTER COLUMN place
DROP NOT NULL;

ALTER TABLE purchases
ADD COLUMN purchase_date TIMESTAMP NOT NULL;

ALTER TABLE purchases
ADD COLUMN order_id VARCHAR(255) NOT NULL;

/*
CREATE TABLE orders
order_id
Qtd. total de itens:12
Valor a pagar R$:70,61
Forma de pagamento:Valor pago R$:
3 - Cartão de Crédito70,61
url_nfe
purchase_date
*/

CREATE TABLE IF NOT EXISTS orders (
  id serial PRIMARY KEY,
  total_items INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  payment_method VARCHAR(255) NOT NULL,
  url_nfe VARCHAR(255) NOT NULL,
  purchase_date TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE purchases 
ALTER COLUMN order_id 
TYPE INTEGER 
USING (trim(order_id)::integer);

ALTER TABLE purchases
ADD CONSTRAINT purchase_order_id_fk 
FOREIGN KEY (order_id) 
REFERENCES orders (id);