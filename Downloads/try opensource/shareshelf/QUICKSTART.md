# ShareShelf Quick Start Guide

## ✅ Project Successfully Generated!

Your complete ShareShelf MERN stack project is ready. All files have been created with working code.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env
```

**Edit `.env`** (minimum required):
```
MONGO_URI=mongodb://localhost:27017/shareshelf
JWT_SECRET=your_random_secret_key_123
JWT_REFRESH_SECRET=your_random_refresh_secret_456
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 2: Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `.env`** (already correct if backend is on localhost:5000):
```
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Run the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
Backend will be available at `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will open at `http://localhost:5173`

---

## 📋 What's Included

### Backend Features ✓
- ✅ User authentication (register/login/refresh token)
- ✅ Item CRUD with image upload
- ✅ Borrow request state machine
- ✅ Review & rating system
- ✅ Trust score calculation
- ✅ Email reminders with cron job
- ✅ MongoDB integration
- ✅ Input validation
- ✅ Error handling middleware
- ✅ JWT token management

### Frontend Features ✓
- ✅ User authentication (login/register)
- ✅ Browse & search items
- ✅ Item details with image gallery
- ✅ Create/edit items with multi-image upload
- ✅ Borrow request workflow
- ✅ Dashboard with 3 tabs
- ✅ Profile management
- ✅ User reviews & ratings
- ✅ Trust score display
- ✅ Responsive design (mobile-friendly)
- ✅ Redux state management
- ✅ Loading & error states

---

## 🧪 Test the Application

### 1. Register Two Users
- Go to `/register`
- Create User A (Location: "bangalore")
- Create User B (Location: "bangalore")

### 2. User A: List an Item
- Login as User A
- Go to `/add-item`
- Fill form and upload images
- Submit

### 3. User B: Browse & Request
- Login as User B
- Go to `/browse`
- Find User A's item
- Click "View Details"
- Set return date and submit request

### 4. User A: Approve Request
- Go to `/dashboard`
- Click "Requests on My Items" tab
- Click "Approve" button

### 5. Complete the Cycle
- User B marks as "Picked Up" then "Returned"
- User A sees returned status
- Both can leave reviews
- Trust scores update automatically

---

## 📊 Database

The application uses MongoDB. You can:

1. **Use Local MongoDB:**
   ```bash
   # Install MongoDB locally, then:
   mongod
   ```

2. **Use MongoDB Atlas (Cloud):**
   - Create account at https://www.mongodb.com/cloud/atlas
   - Create a cluster
   - Get connection string
   - Add to `.env`:
     ```
     MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/shareshelf
     ```

---

## 📸 Image Upload

**Without Cloudinary (Default):**
- Images save to `backend/uploads/` folder
- Works out of the box
- Perfect for development

**With Cloudinary:**
1. Sign up at https://cloudinary.com
2. Get API credentials
3. Add to `.env`:
   ```
   CLOUDINARY_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

---

## 📧 Email Notifications

**Without Email Config (Default):**
- Emails print to console
- Perfect for development
- No configuration needed

**With Real Email:**
1. Enable 2-factor authentication on Gmail
2. Create "App Password" (16-char password)
3. Add to `.env`:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_16_char_app_password
   EMAIL_FROM=noreply@shareshelf.com
   ```

---

## 🔄 Cron Job

The reminder cron job automatically:
- Runs daily at 8 AM
- Finds overdue items
- Sends reminder emails
- Updates trust scores

---

## 📁 Project Structure Overview

```
shareshelf/
├── backend/
│   ├── config/db.js              (MongoDB setup)
│   ├── controllers/              (Business logic)
│   ├── models/                   (Mongoose schemas)
│   ├── routes/                   (API endpoints)
│   ├── middleware/               (Auth, errors)
│   ├── utils/                    (Helpers)
│   ├── jobs/reminderCron.js      (Scheduled tasks)
│   ├── server.js                 (Entry point)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/           (React components)
│   │   ├── pages/                (Page routes)
│   │   ├── services/             (API calls)
│   │   ├── redux/                (State management)
│   │   ├── App.jsx               (Main component)
│   │   └── main.jsx              (Entry point)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore                    (Excludes node_modules, .env)
└── README.md                     (Full documentation)
```

---

## 🎯 Key Features Explained

### State Machine for Borrow Requests
```
User A Lists Item
      ↓
User B Requests → Approval Status: "requested"
      ↓
User A Approves → Status: "approved"
      ↓
User B Picks Up → Status: "picked_up"
      ↓
User B Returns → Status: "returned"
      ↓
Both Leave Reviews → Trust Scores Update
```

### Trust Score System
- Base: 50 points
- +2 for each on-time return
- -5 for each overdue return
- Review ratings add ±7.5 points each
- Final: 0-100 (capped)

### State Validation
Invalid transitions are rejected with clear errors:
- Can't go from "returned" to "picked_up"
- Can't mark "returned" without approval first
- Prevents data inconsistency

---

## 🛠 Available Scripts

### Backend
```bash
npm run dev     # Development server (with nodemon)
npm start       # Production server
```

### Frontend
```bash
npm run dev     # Development server (with hot reload)
npm run build   # Build for production
npm run preview # Preview production build
```

---

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Ensure MongoDB is running: `mongod` |
| Port already in use | Change PORT in .env (backend) or in vite.config.js (frontend) |
| Images not uploading | Check `backend/uploads/` folder permissions |
| Email not sending | Verify SMTP config in .env (or use console fallback) |
| Token expired on frontend | Automatic refresh token mechanism handles this |
| CORS error | Check FRONTEND_URL in backend .env |

---

## 📚 Next Steps

1. ✅ Follow the "Quick Setup" above
2. ✅ Run both servers
3. ✅ Test the end-to-end flow
4. ✅ Explore the code in each folder
5. ✅ Customize colors, copy, or add features
6. ✅ Deploy to production (Heroku, AWS, etc.)

---

## 🎓 Code Quality

### What's Already Done:
- ✅ Async/await with proper error handling
- ✅ Business logic in utils (not in controllers)
- ✅ Consistent naming conventions
- ✅ Comments on complex logic
- ✅ State machine validation
- ✅ Input validation
- ✅ Centralized error middleware
- ✅ Redux for state management
- ✅ Protected routes for authentication
- ✅ Loading & error states in UI

### Best Practices:
- Separation of concerns (controllers → utils)
- Token refresh mechanism
- Input sanitization
- Proper HTTP status codes
- Consistent API response format
- Clean component hierarchy
- Reusable utility functions

---

## 📖 Documentation Files

- **README.md** - Full documentation
- **backend/.env.example** - Backend environment template
- **frontend/.env.example** - Frontend environment template
- **This file** - Quick start guide

---

## 💡 Pro Tips

1. **Use MongoDB Compass** to view database visually
2. **VS Code REST Client** to test API endpoints
3. **Redux DevTools** browser extension to debug state
4. **React DevTools** to inspect components
5. **Network tab** in DevTools to monitor API calls

---

## 🎉 You're All Set!

Your ShareShelf project is complete and ready to run. 

**Start building!** 🚀

For questions, refer to the detailed README.md in the project root.

---

**Happy coding! 💻**
