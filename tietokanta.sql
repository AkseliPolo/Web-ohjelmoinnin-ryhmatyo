DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'group_role') THEN
    CREATE TYPE group_role AS ENUM ('member', 'admin');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_status') THEN
    CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;
END $$;


CREATE TABLE IF NOT EXISTS users (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username       TEXT        NOT NULL UNIQUE,          -- kirjautumistunnus
  display_name   TEXT        NOT NULL,                 -- näkyy muille
  email          TEXT        NOT NULL,
  password_hash  TEXT        NOT NULL,                 -- esim. bcrypt / argon2
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_users_email_lower ON users (lower(email));


CREATE TABLE IF NOT EXISTS movies (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tmdb_id       INTEGER     NOT NULL UNIQUE,
  title         TEXT        NOT NULL,
  release_year  SMALLINT,
  poster_path   TEXT,
  cached_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);



CREATE TABLE IF NOT EXISTS reviews (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     BIGINT      NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  movie_id    BIGINT      NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  rating      SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body        TEXT,                                    -- tyhjä = pelkkä tähtiarvio
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, movie_id)                           -- yksi arvostelu per elokuva
);
CREATE INDEX IF NOT EXISTS idx_reviews_movie ON reviews(movie_id);

-- Katselutoivelista

CREATE TABLE IF NOT EXISTS watchlist_items (
  user_id   BIGINT      NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  movie_id  BIGINT      NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  added_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, movie_id)
);


-- keskusteluryhmät


CREATE TABLE IF NOT EXISTS groups (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name         TEXT        NOT NULL,
  description  TEXT,
  created_by   BIGINT      REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Jäsenyys, perusstaja lisätään 'admin'-roolilla

CREATE TABLE IF NOT EXISTS group_members (
  group_id   BIGINT      NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id    BIGINT      NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  role       group_role  NOT NULL DEFAULT 'member',
  joined_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members(user_id);

-- Liittymispyynnöt ja kutsut
CREATE TABLE IF NOT EXISTS group_join_requests (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  group_id    BIGINT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id     BIGINT NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  invited_by  BIGINT REFERENCES users(id) ON DELETE SET NULL,  -- NULL = käyttäjä pyysi itse
  status      request_status NOT NULL DEFAULT 'pending',
  decided_by  BIGINT REFERENCES users(id) ON DELETE SET NULL,  -- NULL = ei vielä päätetty
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  decided_at  TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_join_requests_group ON group_join_requests(group_id, status);
-- Vain yksi avoin pyyntö per käyttäjä per ryhmä
CREATE UNIQUE INDEX IF NOT EXISTS uq_join_requests_pending
  ON group_join_requests(group_id, user_id)
  WHERE status = 'pending';

-- Ryhmächat
CREATE TABLE IF NOT EXISTS group_messages (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  group_id   BIGINT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id    BIGINT REFERENCES users(id) ON DELETE SET NULL,     -- viesti jää, vaikka käyttäjä poistuu
  body       TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 4000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_group_messages_group ON group_messages(group_id, created_at);
