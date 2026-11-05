-- Aja pgAdminissa kerran movieapp-tietokantaan.
-- Tarvitaan, jotta arvostelun päivitys (ON CONFLICT) toimii.
-- Virhe "already exists" tarkoittaa, että rajoite on jo olemassa.
ALTER TABLE reviews
  ADD CONSTRAINT reviews_user_movie_key UNIQUE (user_id, movie_id);
