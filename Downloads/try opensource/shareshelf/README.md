# ShareShelf - Hyperlocal Lending Platform

A full-stack MERN application that enables neighbors to share tools, equipment, and other items within their community. Users can list items they own, browse items from others, and manage borrow requests with a trust score system.

## 🎯 Features

- **User Authentication**: JWT-based authentication with access and refresh tokens
- **Item Management**: List, browse, and filter items by category, location, and search terms
- **Borrow System**: State machine-based borrow request workflow (requested → approved → picked_up → returned)
- **Trust Score**: Dynamic trust score based on completed swaps, on-time returns, and reviews
- **Review System**: Users can review borrowers and owners after completed exchanges
- **Email Notifications**: Automated reminders for due and overdue items (via Nodemailer)
- **Image Upload**: Support for multiple image uploads with Cloudinary integration
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS
- **Dashboard**: Comprehensive dashboard with tabs for managing items and requests

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken), bcryptjs
- **File Upload**: Multer + Cloudinary
- **Scheduled Jobs**: node-cron
- **Email**: Nodemailer
- **Validation**: express-validator

### Frontend
- **Framework**: React 18
- **Bundler**: Vite
- **Routing**: React Router v6
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Icons**: React Icons

## 📦 Project Structure

```
shareshelf/
├── backend/
│   ├── config/          # Database and Cloudinary configuration
│   ├── controllers/      # Request handlers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth, error handling, file upload
│   ├── utils/           # Helper functions
│   ├── jobs/            # Cron jobs
│   ├── server.js        # Express server setup
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service layer
│   │   ├── redux/       # State management
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
├── .gitignore
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** in `.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/shareshelf
   JWT_SECRET=your_secret_key_here
   JWT_REFRESH_SECRET=your_refresh_secret_here
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

   Optional (for image uploads):
   ```
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

   Optional (for email reminders):
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=noreply@shareshelf.com
   ```

5. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

6. **Run the server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** in `.env`:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user profile
- `GET /api/users/profile/me` - Get current user profile (protected)
- `PUT /api/users/:id` - Update user profile (protected)
- `POST /api/users/:id/recalculate-trust` - Recalculate trust score (protected)

### Items
- `GET /api/items` - Browse items (with filters)
- `GET /api/items/:id` - Get item details
- `GET /api/items/user/:userId` - Get user's items
- `POST /api/items` - Create item (protected, multipart)
- `PUT /api/items/:id` - Update item (protected)
- `DELETE /api/items/:id` - Delete item (protected)

### Borrow Requests
- `GET /api/borrow-requests` - Get user's requests (protected)
- `POST /api/borrow-requests` - Create request (protected)
- `GET /api/borrow-requests/:id` - Get request details (protected)
- `PUT /api/borrow-requests/:id/status` - Update request status (protected)
- `DELETE /api/borrow-requests/:id` - Cancel request (protected)

### Reviews
- `GET /api/reviews/user/:userId` - Get user's reviews
- `POST /api/reviews` - Create review (protected)
- `PUT /api/reviews/:id` - Update review (protected)
- `DELETE /api/reviews/:id` - Delete review (protected)

## 💻 Running the Full Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Then open `http://localhost:5173` in your browser.

## 📝 End-to-End Flow

1. **Register**: Sign up with name, email, password, and location
2. **List Item**: Add items with images, description, category, condition, and deposit amount
3. **Browse**: Search and filter items by category, location, and keywords
4. **Request**: Send a borrow request specifying the return date
5. **Approve**: Item owner approves or rejects the request
6. **Pick Up**: Borrower marks item as picked up
7. **Return**: Borrower marks item as returned
8. **Review**: Both parties can leave reviews
9. **Trust Score Update**: Trust score recalculates based on reviews and on-time returns

## 🔒 State Machine for Borrow Requests

```
requested → approved → picked_up → returned
         ↓                    ↓
        rejected            overdue
```

Valid transitions:
- `requested` → `approved` | `rejected` (owner only)
- `approved` → `picked_up` | `rejected`
- `picked_up` → `returned` | `overdue`
- `overdue` → `returned`

## 📧 Email Notifications

- **New Request**: Sent to owner when borrower requests an item
- **Approval**: Sent to borrower when request is approved
- **Overdue Reminder**: Sent daily at 8 AM for overdue items (via cron job)

Emails use Nodemailer with mock transporter fallback (console.log) if SMTP not configured.

## ⚙️ Cron Job

The reminder cron job runs daily at 8 AM:
- Checks for overdue borrow requests
- Marks them as `overdue`
- Sends reminder emails to borrower and owner
- Updates borrower's overdue count and recalculates trust score

## 🎨 UI Components

### Common
- Navbar (with mobile menu)
- Footer
- Loader (spinner)
- ProtectedRoute (authentication guard)

### Items
- ItemCard (item preview)
- ItemList (grid with pagination)
- ItemForm (create/edit item with image upload)

### Requests
- RequestStatusBadge (colored status indicator)

## 🔐 Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT token validation on protected routes
- Token refresh mechanism
- CORS enabled for frontend URL
- Input validation with express-validator
- Error middleware for consistent error responses

## 📦 Building for Production

### Backend
```bash
cd backend
npm install --production
# Set NODE_ENV=production in .env
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 🐛 Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running: `mongod`
- Check MONGO_URI in .env

**Image Upload Not Working**
- Without Cloudinary config, images are saved to `uploads/` folder
- Ensure `uploads/` directory is created and has write permissions

**Email Not Sending**
- Check SMTP credentials in .env
- Gmail users need to use "App Password" (not regular password)
- Emails will log to console if SMTP not configured

**Token Expired**
- Frontend automatically uses refresh token to get new access token
- If refresh fails, user is redirected to login

## 📄 License

MIT

## 👥 Contributing

Feel free to submit issues and enhancement requests!

---

**Built with ❤️ for sharing and community**
