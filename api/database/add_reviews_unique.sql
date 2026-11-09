ALTER TABLE reviews
  ADD CONSTRAINT reviews_user_movie_key UNIQUE (user_id, movie_id);
