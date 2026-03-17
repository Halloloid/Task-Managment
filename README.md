# Task Manager - Full-Stack Application

A production-ready task management application with authentication, CRUD operations, real-time search, filtering, and pagination. Built as a technical assessment demonstrating strong understanding of backend architecture, security practices, database handling, frontend integration, and deployment strategies.

---

## 🔗 Live Deployment

- **Frontend (Live Demo):** https://task-managment-vert.vercel.app/
- **Backend API:** https://task-managment-c56d.onrender.com
- **API Health Check:** https://task-managment-c56d.onrender.com/health
- **GitHub Repository:** https://github.com/Halloloid/Task-Managment

---

## 📸 Screenshots

### Login Page
![alt text](image.png)

### Dashboard
![alt text](image-1.png)


---

## 🚀 Features

### Core Functionality
- ✅ **User Authentication** - JWT-based authentication with secure HTTP-only cookies
- ✅ **Task CRUD Operations** - Create, Read, Update, Delete tasks
- ✅ **Advanced Filtering** - Filter tasks by status (Pending, In Progress, Completed)
- ✅ **Real-time Search** - Search tasks by title
- ✅ **Pagination** - Efficient data retrieval with pagination support
- ✅ **Authorization** - Users can only access their own tasks
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### Security & Advanced Features
- ✅ **Password Hashing** - bcrypt with 10 salt rounds
- ✅ **Secure Cookies** - HttpOnly, Secure, SameSite configurations
- ✅ **Input Validation** - Comprehensive validation on all endpoints
- ✅ **SQL Injection Prevention** - Prisma ORM with parameterized queries
- ✅ **Proper HTTP Status Codes** - RESTful API standards
- ✅ **Error Handling** - Structured error responses with appropriate status codes
- ✅ **CORS Configuration** - Controlled cross-origin resource sharing
- ✅ **Environment Variables** - No hardcoded sensitive data

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 
- **Framework:** Express.js 
- **Language:** TypeScript 
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma 
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Deployment:** Render

### Frontend
- **Framework:** React 
- **Build Tool:** Vite 
- **Language:** TypeScript 
- **Routing:** React Router 
- **HTTP Client:** Axios 
- **Styling:** Tailwind CSS 
- **Deployment:** Vercel

### Database Schema
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tasks     Task[]
  
  @@index([email])
}

model Task {
  id          String     @id @default(uuid())
  title       String
  description String     @db.Text
  status      TaskStatus @default(PENDING)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  userId      String
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([status])
  @@index([createdAt])
  @@index([userId, status])
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
}
```

---

## 🏗️ Architecture Overview

### System Design

```
┌─────────────┐      HTTPS        ┌──────────────┐
│   Browser   │ ────────────────> │   Frontend   │
│  (Client)   │                   │  (Vercel)    │
└─────────────┘                   └──────────────┘
                                         │
                                         │ REST API
                                         │ (JWT Cookies)
                                         ▼
                                  ┌──────────────┐
                                  │   Backend    │
                                  │   (Render)   │
                                  └──────────────┘
                                         │
                                         ├──────────> PostgreSQL
                                         │            (Neon)
                                         │
                                         └──────────> Prisma ORM
```

### Request Flow

1. **User Authentication:**
   - User submits login credentials
   - Backend validates credentials, hashes password with bcrypt
   - JWT token generated and set as HTTP-only cookie
   - Frontend stores auth state in context

2. **Task Operations:**
   - Frontend sends authenticated request with cookie
   - Backend middleware validates JWT token
   - Authorization check (user owns the task)
   - Database operation via Prisma ORM
   - Response with appropriate status code

3. **Data Flow:**
   - All requests pass through CORS middleware
   - Authentication middleware validates JWT
   - Controller handles business logic
   - Prisma executes type-safe database queries
   - Structured JSON response returned

---

## 📋 API Documentation

### Base URL
```
Production: https://task-managment-c56d.onrender.com/api
Local: http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}

Response (201 Created):
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### 2. Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response (200 OK):
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}

Sets Cookie: access_token=<JWT_TOKEN>; HttpOnly; Secure; SameSite=None
```

#### 3. Logout User
```http
POST /api/auth/logout
Cookie: access_token=<JWT_TOKEN>

Response (200 OK):
{
  "message": "Logged out successfully"
}
```

#### 4. Get Current User
```http
GET /api/auth/me
Cookie: access_token=<JWT_TOKEN>

Response (200 OK):
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-03-17T10:00:00Z"
  }
}
```

### Task Endpoints (All Require Authentication)

#### 5. Get All Tasks (with Pagination, Filtering, Search)
```http
GET /api/tasks?page=1&limit=10&status=PENDING&search=meeting
Cookie: access_token=<JWT_TOKEN>

Query Parameters:
- page (optional, default: 1)
- limit (optional, default: 10, max: 100)
- status (optional, values: PENDING | IN_PROGRESS | COMPLETED)
- search (optional, searches in title, case-insensitive)

Response (200 OK):
{
  "tasks": [
    {
      "id": "uuid",
      "title": "Complete assignment",
      "description": "Build task manager app",
      "status": "IN_PROGRESS",
      "createdAt": "2026-03-17T10:00:00Z",
      "updatedAt": "2026-03-17T12:00:00Z",
      "userId": "uuid"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalTasks": 47,
    "tasksPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### 6. Get Single Task
```http
GET /api/tasks/:id
Cookie: access_token=<JWT_TOKEN>

Response (200 OK):
{
  "task": {
    "id": "uuid",
    "title": "Complete assignment",
    "description": "Build task manager app",
    "status": "IN_PROGRESS",
    "createdAt": "2026-03-17T10:00:00Z",
    "updatedAt": "2026-03-17T12:00:00Z",
    "userId": "uuid"
  }
}
```

#### 7. Create Task
```http
POST /api/tasks
Cookie: access_token=<JWT_TOKEN>
Content-Type: application/json

{
  "title": "Complete assignment",
  "description": "Build task manager app",
  "status": "IN_PROGRESS"
}

Response (201 Created):
{
  "message": "Task created successfully",
  "task": {
    "id": "uuid",
    "title": "Complete assignment",
    "description": "Build task manager app",
    "status": "IN_PROGRESS",
    "createdAt": "2026-03-17T10:00:00Z",
    "updatedAt": "2026-03-17T10:00:00Z",
    "userId": "uuid"
  }
}
```

#### 8. Update Task
```http
PUT /api/tasks/:id
Cookie: access_token=<JWT_TOKEN>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "COMPLETED"
}

Response (200 OK):
{
  "message": "Task updated successfully",
  "task": {
    "id": "uuid",
    "title": "Updated title",
    "status": "COMPLETED",
    "updatedAt": "2026-03-17T14:00:00Z"
  }
}
```

#### 9. Delete Task
```http
DELETE /api/tasks/:id
Cookie: access_token=<JWT_TOKEN>

Response (200 OK):
{
  "message": "Task deleted successfully"
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Validation error",
  "details": ["Title and description are required"]
}
```

#### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

#### 403 Forbidden
```json
{
  "error": "Not authorized to access this task"
}
```

#### 404 Not Found
```json
{
  "error": "Task not found"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## 🔧 Local Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or Neon account)

### Backend Setup

```bash
# 1. Clone repository
git clone https://github.com/Halloloid/task-manager.git
cd task-manager/backend

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# 4. Setup database
npx prisma generate
npx prisma migrate dev

# 5. (Optional) Seed test data
npm run prisma:seed

# 6. Start development server
npm run dev
```

Backend runs on: http://localhost:5000

### Frontend Setup

```bash
# 1. Navigate to frontend folder
cd ../frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Frontend runs on: http://localhost:5173

---

## 🌍 Environment Variables

### Backend (.env)
```bash
# Server
PORT=5000
NODE_ENV=devlopment

# Database (Get from Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# JWT (Generate with: openssl rand -base64 32)
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
JWT_EXPIRES_IN="7d"

# Cookie
COOKIE_MAX_AGE=604800000

# Frontend URL (for CORS)
FRONTEND_URL="https://task-managment-vert.vercel.app"
```

### Frontend (.env)
```bash
VITE_API_URL=https://task-managment-c56d.onrender.com
```

---

## 🚀 Deployment

### Backend Deployment (Render)

1. **Create Web Service on Render**
   - Connect GitHub repository
   - Select backend folder as root directory

2. **Configuration:**
   - **Build Command:** `npm install && npx prisma migrate deploy && npm run build`
   - **Start Command:** `npm start`
   - **Environment Variables:** Add all variables from `.env.example`

3. **Database:**
   - Use Neon PostgreSQL (free tier)
   - Copy connection string to `DATABASE_URL`

### Frontend Deployment (Vercel)

1. **Deploy to Vercel**
   ```bash
   cd frontend
   npm install -g vercel
   vercel
   ```

2. **Configuration:**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variable: `VITE_API_URL=https://task-managment-c56d.onrender.com`

3. **Update Backend CORS:**
   - Add Vercel URL to `FRONTEND_URL` in backend environment variables

---

## 🧪 Testing the Application

### Using cURL

```bash
# 1. Register user
curl -X POST https://task-managment-c56d.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'

# 2. Login
curl -X POST https://task-managment-c56d.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}' \
  -c cookies.txt

# 3. Create task
curl -X POST https://task-managment-c56d.onrender.com/api/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Test Task","description":"Testing API","status":"PENDING"}'

# 4. Get all tasks
curl https://task-managment-c56d.onrender.com/api/tasks -b cookies.txt

# 5. Get tasks with filters
curl "https://task-managment-c56d.onrender.com/api/tasks?status=PENDING&search=Test&page=1&limit=10" \
  -b cookies.txt
```

### Using Postman

1. Import the API collection
2. Set base URL: `https://task-managment-c56d.onrender.com/api`
3. Test authentication endpoints first
4. Cookie is automatically saved after login
5. Test all CRUD operations

---

## 🔒 Security Features

### Implemented Security Measures

1. **Password Security**
   - bcrypt hashing with 10 salt rounds
   - Minimum password length: 8 characters
   - Never stored in plain text

2. **JWT Security**
   - Stored in HTTP-only cookies (not accessible via JavaScript)
   - Secure flag enabled in production (HTTPS only)
   - SameSite=None for cross-origin requests
   - 7-day expiration

3. **Input Validation**
   - Email format validation
   - Required field checks
   - Length validations (title: 3-200 chars, description: 10-2000 chars)
   - Status enum validation

4. **SQL Injection Prevention**
   - Prisma ORM with parameterized queries
   - No raw SQL queries

5. **Authorization**
   - JWT verification on all protected routes
   - Users can only access/modify their own tasks
   - Proper 403 Forbidden responses

6. **CORS Configuration**
   - Allowed origins specified
   - Credentials enabled for cookie sharing
   - Specific methods allowed

7. **Error Handling**
   - Generic error messages in production
   - No stack trace exposure
   - Appropriate HTTP status codes

---

## 📊 Performance Optimizations

1. **Database Indexing**
   - Indexes on: email, userId, status, createdAt
   - Composite index on userId + status
   - Fast query performance

2. **Pagination**
   - Limit maximum results per page (100)
   - Skip/take pattern for efficient querying

3. **Query Optimization**
   - Select only required fields
   - Avoid N+1 queries with Prisma includes
   - Efficient WHERE clauses

4. **Frontend Optimization**
   - React lazy loading
   - Vite build optimization
   - Tailwind CSS purging
   - Code splitting

---

## 📝 Code Quality

### Backend Structure
```
├── config
│   └── db.ts
├── index.ts
├── middleware
│   └── auth.middleware.ts
└── modules
    ├── authentication
    │   ├── auth.controller.ts
    │   └── auth.routes.ts
    └── task
        ├── task.controller.ts
        └── task.routes.ts

6 directories, 7 files
```

### Frontend Structure
```
├── App.css
├── App.tsx
├── assets
│   └── vite.svg
├── components
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx
│   ├── TaskCard.tsx
│   └── TaskModal.tsx
├── context
│   └── AuthContext.tsx
├── index.css
├── main.tsx
├── pages
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
└── services
    └── api.ts

6 directories, 14 files
```

---

## 🎯 Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Task due dates and reminders
- [ ] Task priority levels
- [ ] Task categories/tags
- [ ] Collaborative tasks (sharing)
- [ ] File attachments
- [ ] Activity log
- [ ] Export tasks (CSV/PDF)
- [ ] Dark mode
- [ ] Mobile app (React Native)

---

## 👤 Author

**Amrut Prasad Patro**
- Email: chamrutprasadpatro@gmail.com
- GitHub: [@Halloloid](https://github.com/Halloloid)
- LinkedIn: [Amrut Prasad Patro](https://www.linkedin.com/in/ch-amrut-prasad-patro-1b4b26329/)

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- Built as a technical assessment for [Company Name]
- Demonstrates full-stack development capabilities
- Production-ready code with security best practices
- Comprehensive documentation for easy setup and maintenance

---

## 📞 Support

For any questions or issues:
1. Check the API documentation above
2. Review the error responses section
3. Check GitHub Issues
4. Contact: chamrutprasadpatro@gmail.com

---

**Last Updated:** March 17, 2026
**Version:** 1.0.0
