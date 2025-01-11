# User Management System

A modern, full-stack user management system built with the MEAN stack (MongoDB, Express.js, Angular, Node.js) featuring a sleek dark/light theme and glassmorphism design.

## Features

- 🎨 Modern UI with Dark/Light theme
- 🔐 Secure Authentication & Authorization
- 👥 Complete User Management (CRUD)
- 📊 Interactive Dashboard
- ⚡ Real-time Updates
- 🎯 Form Validation
- 🔍 Search & Filter Capabilities
- 📱 Responsive Design

## Tech Stack

### Frontend
- Angular 16+
- Bootstrap 5
- Custom CSS with Glassmorphism effects
- TypeScript

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- Angular CLI

### Installation

1. Clone the repository
```bash
git clone https://github.com/AshishDev-16/Angular-Express
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Running the Application

1. Start Backend Server
```bash
cd backend
npm run dev
```

2. Start Frontend Development Server
```bash
cd frontend
ng serve
```

3. Access the application at `http://localhost:4200`

## Login Credentials

Use these credentials to access the admin panel:

```
Email: admin@example.com
Password: admin123
```

## Environment Setup

1. Create a `.env` file in the backend directory with the following variables:
```env
PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   ├── services/
    │   │   └── models/
    │   └── styles.css
    └── package.json
```

## Key Features Explained

1. **Authentication & Authorization**
   - JWT-based authentication
   - Protected routes
   - Role-based access control

2. **User Management**
   - Create, Read, Update, Delete users
   - User profile management
   - Bulk operations

3. **Dashboard**
   - User statistics
   - Recent activities
   - Interactive charts

4. **Theme Customization**
   - Dark/Light mode toggle
   - Modern glassmorphism design
   - Responsive layout

## API Documentation

The API endpoints are organized around the following resources:

- `/api/auth` - Authentication endpoints
- `/api/users` - User management
- `/api/settings` - Application settings

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Support

For support, email kaduashish15@gmail.com or create an issue in the repository.
