-- Lisää vain puuttuvat taulut (kun 6 ensimmäistä taulua on jo olemassa)

CREATE TABLE group_join_requests (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  group_id    BIGINT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id     BIGINT NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  invited_by  BIGINT REFERENCES users(id) ON DELETE SET NULL,  -- NULL = käyttäjä pyysi itse
  status      request_status NOT NULL DEFAULT 'pending',
  decided_by  BIGINT REFERENCES users(id) ON DELETE SET NULL,  -- NULL = ei vielä päätetty
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  decided_at  TIMESTAMPTZ
);

CREATE TABLE group_messages (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  group_id   BIGINT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id    BIGINT NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_group_messages_group ON group_messages(group_id, created_at);
CREATE INDEX idx_join_requests_group  ON group_join_requests(group_id, status);

CREATE UNIQUE INDEX uq_join_requests_pending
  ON group_join_requests(group_id, user_id)
  WHERE status = 'pending';
