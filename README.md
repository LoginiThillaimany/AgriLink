## AgriLink - Full-Stack App

End-to-end app for browsing products, cart, orders, and customer auth.

### Prerequisites
- Node 18+
- MongoDB connection string

### Backend Setup
```bash
cd AgriLink/agrilink-backend
npm install
```
Create a `.env` with:
```
MONGO_URI=your_connection_string
JWT_SECRET=your_long_random_secret
PORT=5000
```
Run:
```bash
npm run start
# Health
curl http://localhost:5000/health
curl http://localhost:5000/ready
```

### Frontend Setup
```bash
cd AgriLink/agrilink-frontend
npm install
```
Create a `.env` with:
```
EXPO_PUBLIC_API_URL=http://localhost:5000
```
Run web:
```bash
npm run web -- --clear
# open the URL Expo prints (usually http://localhost:8081)
```

### Features
- JWT auth (register/login), profile page
- Products: fetch + create
- Cart: per-user persisted
- Orders: create + list per user

### Troubleshooting
- If you see 500/MIME errors on web, close all dev servers, clear cache, and use `npm run web -- --clear` then open the URL that Expo prints (avoid stale 8082).
- Ensure backend is running and `EXPO_PUBLIC_API_URL` matches.


