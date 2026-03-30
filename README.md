# 🎓 Teachs – Premium Tutoring Platform

A full-stack tutoring website built with React + Node.js + MySQL, designed for Hostinger Node.js hosting.

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Backend | Node.js + Express |
| Database | MySQL 8 (Hostinger) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Payments | Razorpay |
| Hosting | Hostinger Node.js |

---

## 📁 Project Structure

```
teachs/
├── server.js              # Express server entry point
├── package.json           # Backend dependencies
├── .env.example           # Environment variable template
├── config/
│   └── db.js              # MySQL pool connection
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── routes/
│   ├── authRoutes.js      # Login, signup, JWT
│   ├── adminRoutes.js     # Admin management
│   ├── studentRoutes.js   # Student dashboard APIs
│   ├── teacherRoutes.js   # Teacher dashboard APIs
│   ├── pricingRoutes.js   # Pricing plans CRUD
│   ├── testRoutes.js      # Practice tests + questions
│   ├── leadRoutes.js      # Demo booking leads
│   ├── paymentRoutes.js   # Razorpay integration
│   ├── workshopRoutes.js  # Workshop sessions
│   ├── womenRoutes.js     # Women's program applications
│   └── settingsRoutes.js  # Site-wide settings
├── seed/
│   └── seed.js            # Database schema + seed data
├── uploads/               # File uploads directory
└── frontend/
    ├── public/
    │   └── index.html     # SEO meta tags + schema
    └── src/
        ├── App.js         # Routes + layout
        ├── index.css      # Global design system
        ├── context/
        │   └── AuthContext.js
        ├── utils/
        │   └── api.js     # Axios with JWT interceptors
        ├── components/
        │   ├── Navbar.js
        │   ├── Footer.js
        │   ├── WhatsAppButton.js
        │   ├── ChatBot.js
        │   ├── LeadForm.js
        │   └── AdminSidebar.js
        └── pages/
            ├── Home.js
            ├── Pricing.js
            ├── PracticeTests.js
            ├── TestDetail.js
            ├── Login.js
            ├── Signup.js
            ├── MentorWorkshop.js
            ├── WomensProgram.js
            ├── StudentDashboard.js
            ├── TeacherDashboard.js
            └── Admin/
                ├── AdminDashboard.js
                ├── AdminUsers.js
                ├── AdminPricing.js
                ├── AdminLeads.js
                ├── AdminPayments.js
                ├── AdminTests.js
                ├── AdminTestimonials.js
                ├── AdminWorkshop.js
                ├── AdminWomen.js
                ├── AdminAssign.js
                ├── AdminSchedule.js
                ├── AdminAnnouncements.js
                └── AdminSettings.js
```

---

## ⚡ Local Setup (Development)

### 1. Clone & Install
```bash
git clone https://github.com/your-username/teachs.git
cd teachs

# Install backend
npm install

# Install frontend
cd frontend && npm install && cd ..
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your MySQL credentials and API keys
```

### 3. Set Up Database
```bash
# Make sure MySQL is running locally
node seed/seed.js
```

This creates all tables and seeds:
- 🔐 **Admin:** admin@teachs.in / Teachs@Admin123
- 👨‍🏫 **Teacher:** priya@teachs.in / Teacher@123
- 👨‍🎓 **Student:** aryan@example.com / Student@123

### 4. Run Development Servers
```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
cd frontend && npm start
```

Visit: http://localhost:3000

---

## 🚀 Hostinger Deployment

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial Teachs commit"
git remote add origin https://github.com/your-username/teachs.git
git push -u origin main
```

### Step 2: Build Frontend
```bash
cd frontend && npm run build
```

### Step 3: Hostinger Node.js Setup
1. Log in to Hostinger hPanel
2. Go to **Hosting → Node.js**
3. Create a new Node.js app:
   - **Node version:** 18.x or 20.x
   - **Application root:** `/public_html/teachs` (or your domain folder)
   - **Application startup file:** `server.js`
   - **Entry point:** `npm start`

### Step 4: Upload Files
Via Git (recommended):
```bash
# In Hostinger terminal (SSH)
cd /home/username/your-domain
git clone https://github.com/your-username/teachs.git .
npm install
```

### Step 5: Environment Variables
In Hostinger hPanel → Node.js → Environment Variables, add all values from `.env.example`.

OR upload `.env` file via File Manager.

### Step 6: MySQL Database
1. Hostinger hPanel → Databases → MySQL Databases
2. Create database: `teachs_db`
3. Create user & assign full permissions
4. Update `.env` with credentials
5. Run: `node seed/seed.js`

### Step 7: Build & Deploy
```bash
# In Hostinger terminal
cd frontend && npm install && npm run build && cd ..
npm start
```

### Step 8: Set Entry Point
In Hostinger Node.js settings, ensure:
- **Startup file:** `server.js`
- **Restart app** after deployment

---

## 🔐 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@teachs.in | Teachs@Admin123 |
| Teacher | priya@teachs.in | Teacher@123 |
| Student | aryan@example.com | Student@123 |

⚠️ **Change all passwords immediately after first login!**

---

## 🌐 Key URLs

| URL | Description |
|-----|-------------|
| `/` | Homepage |
| `/pricing` | Pricing plans |
| `/practice-tests` | Practice tests |
| `/mentor-workshop` | Workshop page |
| `/womens-program` | Women's program |
| `/login` | Login |
| `/signup` | Student registration |
| `/dashboard/student` | Student dashboard |
| `/dashboard/teacher` | Teacher dashboard |
| `/admin` | Admin panel |
| `/api/health` | API health check |

---

## 💳 Razorpay Setup

1. Sign up at https://razorpay.com
2. Get your Key ID and Secret from Settings → API Keys
3. Add to `.env`:
   ```
   RAZORPAY_KEY_ID=rzp_live_xxxx
   RAZORPAY_KEY_SECRET=your_secret
   ```

For testing, use `rzp_test_` keys.

---

## 📝 Important Notes

- **Production:** Set `NODE_ENV=production` in `.env`
- **CORS:** Update `FRONTEND_URL` in `.env` to your actual domain
- **JWT Secret:** Use a strong random string (32+ characters)
- **File Uploads:** `uploads/` folder must be writable
- **No Docker, No TypeScript, No SSR** — plain Express + React build

---

## 🔧 Troubleshooting

**MySQL connection failed:**
- Check DB_HOST, DB_USER, DB_PASSWORD in .env
- Ensure MySQL service is running
- For Hostinger: use `localhost` as DB_HOST

**Cannot find module:**
- Run `npm install` in root AND `frontend/`

**Build fails:**
- Check Node.js version ≥ 16
- Delete `node_modules` and reinstall

**Login fails:**
- Run `node seed/seed.js` to ensure users exist
- Check JWT_SECRET is set in .env

---

## 📞 Support

For issues, contact: hello@teachs.in | WhatsApp: +91 98765 43210
