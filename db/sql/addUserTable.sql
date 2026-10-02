
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  restricted BOOLEAN DEFAULT FALSE
);

--docker exec -it db-db-1 psql -U corpus -d corpus_dev -c "INSERT INTO users (username, name, email) VALUES ('TheRealMrBean', 'Rowan Atkinson', 'rowan@bean.co.uk');"
