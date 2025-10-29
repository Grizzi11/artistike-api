# Artistike API

Backend authentication API for the Artistike platform. Built with Node.js, Express, TypeScript, MongoDB, and JWT.

## 🚀 Features

- **JWT Authentication**: Secure token-based authentication
- **User Management**: Registration, login, and profile endpoints
- **MongoDB Integration**: User data persistence with Mongoose
- **TypeScript**: Full type safety and modern ES6+ features
- **CORS Support**: Configurable cross-origin resource sharing
- **Input Validation**: Secure data validation and sanitization
- **Production Ready**: Optimized for deployment on Render

## 📋 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login user | ❌ |
| `GET` | `/api/auth/me` | Get current user profile | ✅ |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | API health status |

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.1
- **Language**: TypeScript 5.0
- **Database**: MongoDB with Mongoose 8.19
- **Authentication**: JWT + bcryptjs
- **Validation**: Built-in Express validators
- **Dev Tools**: Nodemon, ts-node

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- MongoDB Atlas account (or local MongoDB)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Grizzli1/artistike-api.git
   cd artistike-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your values:
   ```env
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   CORS_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app
   PORT=8080
   NODE_ENV=development
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 🌐 API Usage Examples

### Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Login User
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Get Profile (with JWT)
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📦 Project Structure

```
artistike-api/
├── src/
│   ├── index.ts          # Main server file
│   ├── models/
│   │   └── User.ts       # User MongoDB schema
│   ├── routes/
│   │   └── auth.ts       # Authentication routes
│   ├── middleware/
│   │   └── auth.ts       # JWT authentication middleware
│   └── utils/
│       └── jwt.ts        # JWT utility functions
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── .env.example          # Environment variables template
└── README.md             # Project documentation
```

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Secure token generation and validation
- **Input Sanitization**: Protection against injection attacks
- **CORS Protection**: Configurable origin restrictions
- **Error Handling**: Secure error responses

## 🚀 Deployment

### Render Deployment

1. **Connect GitHub Repository**
   - Link your GitHub account to Render
   - Select this repository

2. **Environment Variables**
   Set in Render dashboard:
   ```
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-jwt-secret
   CORS_ORIGINS=https://your-frontend-domain.com
   NODE_ENV=production
   ```

3. **Build Settings**
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Node Version: 18

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🔗 Links

- **Frontend**: [Artistike Frontend](https://github.com/Grizzli1/artistike-frontend)
- **Live API**: [https://artistike-api.onrender.com](https://artistike-api.onrender.com)
- **Documentation**: This README

---

Built with ❤️ for the Artistike platform