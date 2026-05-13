# 🚀 Vitra Pre-Deployment Checklist

## ✅ Completed Fixes

### Backend Configuration
- [x] Created `.env` and `.env.example` files
- [x] Updated `config/db.js` to use environment variables for database credentials
- [x] Updated `server.js` to use `ALLOWED_ORIGINS` environment variable for CORS
- [x] Updated `middleware/authMiddleware` to use `JWT_SECRET` from environment
- [x] Updated `controller/userController` to use `JWT_SECRET` from environment
- [x] PORT is now configurable via environment variable

### Frontend Configuration
- [x] Created `.env` and `.env.example` files
- [x] Updated `src/api/api.js` to use `VITE_API_URL` environment variable

---

## 📋 Critical Tasks Before Hosting

### 1. **Update .env Files with Production Values**
```
Location: Vitra-Backend/.env
- Replace "YOUR_AIVEN_PASSWORD" with actual database password
- Set NODE_ENV to "production"
- Update ALLOWED_ORIGINS with your production domain(s)
- Generate a strong JWT_SECRET (use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
```

### 2. **Frontend Environment Setup**
```
Location: Vitra-Frontend/.env
- Update VITE_API_URL to your production backend URL (e.g., https://api.yourdomain.com)
- For production build: npm run build
```

### 3. **Build & Test**

#### Backend
```bash
cd Vitra-Backend
npm install
node server.js
```
Expected: "MySQL connected" and "Models synced with MySQL" messages

#### Frontend
```bash
cd Vitra-Frontend
npm install
npm run build
# Check that dist/ folder is created
```

### 4. **Security Review**
- [ ] No `.env` file is committed to version control (add to `.gitignore`)
- [ ] Database credentials are never hardcoded
- [ ] JWT_SECRET is strong and unique
- [ ] CORS is restricted to your domain (not all origins)
- [ ] All sensitive data in environment variables

### 5. **Database Connection Test**
```bash
# Run from backend directory
node -e "require('./config/db').authenticate().then(() => console.log('✅ DB Connected')).catch(err => console.log('❌ DB Error:', err.message))"
```

### 6. **API Testing**
Test these endpoints before deploying:
- POST `/api/users/register` - User registration
- POST `/api/users/login` - User login
- GET `/api/users/me` - Get profile (with token)
- GET `/api/users/doctors` - Get doctors list (with token)
- POST `/api/appointments` - Create appointment (with token)

### 7. **Environment Variables Summary**

#### Backend (.env)
```
DB_NAME=defaultdb
DB_USER=avnadmin
DB_PASSWORD=<your_actual_password>
DB_HOST=mysql-1663326c-kritiyadavcoding-6ab9.a.aivencloud.com
DB_PORT=13918
PORT=5000
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
JWT_SECRET=<strong_random_secret>
```

#### Frontend (.env.production)
```
VITE_API_URL=https://api.yourdomain.com
```

---

## 🔧 Hosting Platform Specific Notes

### If using Vercel/Netlify for Frontend
1. Set environment variables in platform dashboard
2. Connect GitHub repo for auto-deploy
3. Build command: `npm run build`
4. Output directory: `dist`

### If using Heroku/Railway/Render for Backend
1. Add environment variables in platform dashboard
2. Ensure `package.json` has correct start script
3. Database SSL is already configured

### If using VPS/Docker
1. Create `.dockerignore` to exclude `.env` (use `.env.example` for reference)
2. Copy `.env` to server separately (never in docker image)
3. Use docker secrets or environment variables

---

## ⚠️ Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| CORS errors | Check ALLOWED_ORIGINS in backend .env matches frontend domain |
| Database connection fails | Verify DB_NAME, DB_PASSWORD, DB_HOST, and DB_PORT in Render env vars |
| JWT token errors | Ensure JWT_SECRET is consistent and present in .env |
| 404 API errors | Check VITE_API_URL in frontend .env |
| Build fails | Run `npm install` again, check for syntax errors |

---

## 📝 .gitignore Updates

Add this to your `.gitignore` file to prevent exposing secrets:
```
.env
.env.local
.env.*.local
node_modules/
dist/
.DS_Store
```

---

## ✨ Testing Checklist

- [ ] Backend starts without errors
- [ ] Database connection successful
- [ ] User can register with new account
- [ ] User can login and receive JWT token
- [ ] Protected routes reject requests without token
- [ ] Frontend build completes successfully
- [ ] Frontend API calls reach backend correctly
- [ ] Appointment creation works end-to-end

---

**Last Updated:** April 28, 2026
**Status:** Ready for staging/production deployment
