# foundify-backend (scaffold)

This is a ready-to-upload backend scaffold for **Foundify ✨** (Lost & Found tracking).

Replace placeholder secrets in `.env.example` with your real keys and rename to `.env` before running.

## Quick start (local)

1. Install dependencies:

```bash
cd foundify-backend
npm install
```

2. Copy `.env.example` to `.env` and edit:

- `MONGO_URI` — your MongoDB Atlas connection string (replace `<password>`).
- `JWT_SECRET` — a long random string.
- `CLOUDINARY_*` — set your Cloudinary cloud name/key/secret.
- `CLIENT_URL` — frontend URL (e.g. http://localhost:5173 or your Vercel URL)

Example `.env`:

```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/foundifyDB?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=dhnxvwjc2
CLOUDINARY_API_KEY=262776978971287
CLOUDINARY_API_SECRET=your_cloudinary_secret
ADMIN_EMAIL=carljay@foundify.ph
CLIENT_URL=http://localhost:5173
```

3. Start server:

```bash
npm run dev
```

API endpoints:

- `POST /api/auth/signup` — body: `{ name, email, password }`
- `POST /api/auth/login` — body: `{ email, password }`
- `POST /api/auth/forgot` — body: `{ email }`
- `POST /api/auth/reset` — body: `{ email, token, password }`
- `GET  /api/items` — list items
- `POST /api/items` — create item (auth required)
- `POST /api/items/:id/claim` — claim request (auth required)
- `POST /api/items/:id/verify` — owner verify claim (auth required)
- `POST /api/upload/upload` — Cloudinary upload (auth required), body: `{ data: 'data:image/...' }`

## Deploy to Render

- Create a new **Web Service**, link to this repo, set `Root` to repo root (or `/backend` if monorepo).
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables in Render (see `.env.example`)
