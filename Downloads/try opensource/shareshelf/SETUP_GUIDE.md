# 🚀 ShareShelf - Setup Complete!

## ✅ Status

```
✅ All 64 project files created
✅ Backend dependencies installed (181 packages)
✅ Frontend dependencies installed
✅ Environment files created (.env files)
✅ Ready to run!
```

---

## 🔧 NEXT STEP: Set Up MongoDB

### Option 1: Use MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster (M0 free tier)
4. Go to "Database Access" → Create user (username: "shareshelf_user", password: "strongpassword123")
5. Go to "Network Access" → Add IP Address (click "Allow Access from Anywhere")
6. Click "Connect" on your cluster
7. Copy the connection string
8. Replace `<password>` with your user password
9. Edit `backend/.env` and update:
   ```
   MONGO_URI=mongodb+srv://shareshelf_user:strongpassword123@cluster0.xxxxx.mongodb.net/shareshelf?retryWrites=true&w=majority
   ```

### Option 2: Use Local MongoDB

1. **Download MongoDB:**
   - Windows: https://www.mongodb.com/try/download/community
   - Follow installer
   - Default installation path: `C:\Program Files\MongoDB\Server\7.0`

2. **Create data directory:**
   ```bash
   mkdir C:\data\db
   ```

3. **Start MongoDB (in a terminal):**
   ```bash
   mongod --dbpath C:\data\db
   ```

4. **Verify connection:**
   ```bash
   mongo
   > db.version()
   ```

MongoDB connection string will be: `mongodb://localhost:27017/shareshelf` (already in `.env`)

---

## 🎯 Run the Application

### Terminal 1: Start Backend Server

```bash
cd backend
npm run dev
```

**Expected output:**
```
Server running on http://localhost:5000
MongoDB Connected
Reminder cron job scheduled
```

### Terminal 2: Start Frontend Server

```bash
cd frontend
npm run dev
```

**Expected output:**
```
Local: http://localhost:5173
```

### Open Browser

Go to: **http://localhost:5173**

---

## 📋 Current Environment Setup

### Backend (.env) - Already Created ✅

```
MONGO_URI=mongodb://localhost:27017/shareshelf
JWT_SECRET=shareshelf_jwt_secret_key_12345
JWT_REFRESH_SECRET=shareshelf_jwt_refresh_secret_key_67890
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Optional extras** (commented out):
- Cloudinary for image CDN
- Email SMTP settings for real emails

### Frontend (.env) - Already Created ✅

```
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 Test the App Once Running

1. **Register User A**
   - Email: user_a@test.com
   - Password: Test@123
   - Location: bangalore

2. **Register User B**
   - Email: user_b@test.com
   - Password: Test@123
   - Location: bangalore

3. **User A: Add an Item**
   - Click "Add Item" in navbar
   - Title: "Drill Machine"
   - Description: "Electric drill, rarely used"
   - Category: "tools"
   - Condition: "excellent"
   - Deposit Amount: "500"
   - Location: "bangalore"
   - Upload images (optional)
   - Submit

4. **User B: Browse & Request**
   - Click "Browse"
   - Search for "drill" or browse
   - Click item details
   - Click "Request to Borrow"
   - Set return date (2-3 days in future)
   - Submit

5. **User A: Approve Request**
   - Click "Dashboard"
   - Click "Requests on My Items" tab
   - Click "Approve"

6. **Complete the Cycle**
   - User B marks as "Picked Up"
   - User A marks as "Picked Up"
   - User B marks as "Returned"
   - User A marks as "Returned"
   - Both users leave reviews

7. **Verify Trust Scores**
   - Click "Profile"
   - See updated trust score
   - View reviews received

---

## ⚠️ Troubleshooting

### Backend fails to start: "MongoDB connection failed"

**Solution:**
- Ensure MongoDB is running (either locally via `mongod` or via Atlas URI)
- Check MONGO_URI in `backend/.env`
- If using Atlas, verify IP whitelist allows your connection

### Frontend shows "Cannot connect to API"

**Solution:**
- Ensure backend is running on port 5000
- Check that `VITE_API_URL=http://localhost:5000/api` in `frontend/.env`
- No trailing slash after `/api`

### Images not uploading

**Solution:**
- Images save to `backend/uploads/` by default
- Folder is created automatically
- Check folder has write permissions
- Or configure Cloudinary in `.env`

### Email not sending

**Solution:**
- Without SMTP config, emails print to console (this is normal in development!)
- Look for email text in backend terminal output
- To use real emails, add SMTP settings to `.env`

### "Port 5000 already in use"

**Solution:**
- Change PORT in `backend/.env` to 5001
- Then update `VITE_API_URL` in `frontend/.env` to `http://localhost:5001/api`

### npm install errors

**Solution:**
- Clear cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

---

## 📁 Project Files

```
shareshelf/
├── backend/
│   ├── .env                    ✅ Created with config
│   ├── .env.example
│   ├── node_modules/           ✅ Installed
│   ├── package.json
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── jobs/
│   └── uploads/                (images saved here)
│
├── frontend/
│   ├── .env                    ✅ Created with config
│   ├── .env.example
│   ├── node_modules/           ✅ Installed
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── redux/
│   └── tailwind.config.js
│
├── README.md                   (Full documentation)
├── QUICKSTART.md               (Quick setup guide)
└── PROJECT_SUMMARY.txt         (Overview)
```

---

## 🎉 Ready to Launch!

You have everything needed. Just:

1. ✅ Set up MongoDB (Atlas or local)
2. ✅ Run backend: `npm run dev` (in backend folder)
3. ✅ Run frontend: `npm run dev` (in frontend folder)
4. ✅ Open http://localhost:5173

**Both terminals must run simultaneously!**

---

## 📚 Documentation

- **README.md** - Full project docs, API endpoints, deployment
- **QUICKSTART.md** - Quick 3-step setup
- **PROJECT_SUMMARY.txt** - Project overview

---

## 🚨 Remember

- **Never commit `.env` files** to Git
- Keep JWT secrets secure
- MongoDB Atlas provides free tier (great for development)
- Email logs to console by default (no SMTP config needed for testing)
- Images save locally to `uploads/` by default

---

## 🎯 What's Next After Getting It Running?

1. Test the complete flow (user → item → borrow → return → review)
2. Explore the codebase
3. Customize colors in `frontend/tailwind.config.js`
4. Add more categories/conditions in models
5. Deploy to production (Heroku, AWS, Vercel, etc.)

---

**Everything is ready! Start the servers and begin building! 🚀**
