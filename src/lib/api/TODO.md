# MythStride API Contract TODOs

- Confirm `POST /api/auth/login` response shape. The frontend currently expects `{ accessToken, tokenType?, expiresAt?, user? }`.
- Confirm `GET /api/player/profile` private profile fields for `username`, `displayName`, `level`, `title`, distance, streak, and guild.
- Confirm `GET /api/boss/current` returns `null` or a boss object when no boss is active.
- Confirm `GET /api/trophies` and `GET /api/history` return arrays.
- Confirm `GET /api/public/player/{username}` is the production public profile endpoint.
- Confirm whether API responses are bare DTOs or wrapped in `{ data }`, `{ profile }`, `{ player }`, `{ boss }`, `{ trophies }`, `{ history }`, or `{ runs }` envelopes.
- Confirm whether login returns `accessToken`, `token`, or another token field. The frontend accepts common aliases defensively but should be narrowed after backend confirmation.
- Confirm whether `POST /api/waitlist` returns a bare message or a `{ data: { message } }` envelope.
