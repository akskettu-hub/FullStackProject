CREATE TABLE collection_title_statements(
  id SERIAL PRIMARY KEY,
  collection_id INT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  seq INT NOT NULL,
  text TEXT NOT NULL
);
