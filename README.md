# 🚀 MERN Stack Agent Management System

A complete full-stack web application for managing agents and distributing CSV lists among them. Built with modern technologies and best practices.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

## ✨ Features

### 🔐 Authentication System
- Secure admin login with JWT tokens
- Protected routes and automatic token validation
- Session management with localStorage
- Auto-redirect on authentication state changes

### 👥 Agent Management
- Create new agents with comprehensive validation
- View all agents in a clean, organized table
- Form validation for email uniqueness and mobile numbers
- Real-time feedback and error handling

### 📁 File Upload & Distribution
- Drag & drop file upload interface
- Support for CSV, XLSX, and XLS file formats
- Automatic file validation (type, size, format)
- Equal distribution of lists among all available agents
- Sequential distribution for remaining items
- Real-time upload progress and statistics

### 📊 Data Visualization
- Interactive dashboard with agent statistics
- Expandable/collapsible agent list sections
- Advanced search and filtering capabilities
- Responsive data tables with sorting
- Visual distribution breakdown

### 📱 User Experience
- Fully responsive design for all devices
- Modern, clean UI with smooth animations
- Toast notifications for user feedback
- Loading states and progress indicators
- Mobile-friendly navigation with collapsible sidebar

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **React Hook Form** - Efficient form handling
- **React Hot Toast** - Elegant toast notifications
- **Lucide React** - Beautiful icon library

### Backend (Your Existing Setup)
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JSON Web Tokens** - Authentication mechanism
- **Multer** - File upload middleware
- **bcryptjs** - Password hashing

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **MongoDB** database running
- **Git** (optional, for cloning)

## ⚡ Installation & Setup

### 1. Project Setup

```bash
# Create a new directory for your project
mkdir mern-agent-management
cd mern-agent-management

# Create frontend directory
mkdir frontend
cd frontend
```

### 2. Install Dependencies

```bash
# Install all required dependencies
npm install
```

### 3. Environment Configuration

Create a `.env` file in your backend directory with:

```env
MONGO_URI=mongodb://localhost:27017/agent-management
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
PORT=5000
NODE_ENV=development
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm install  # if not already done
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install  # if not already done
npm run dev
```

### 5. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

**Default Admin Credentials:**
- **Email:** admin@example.com
- **Password:** admin123

## 📖 Usage

### 1. Admin Login
1. Navigate to the login page
2. Enter the default credentials or your custom admin credentials
3. Click "Sign in" to access the dashboard

### 2. Managing Agents
1. Go to the "Agents" section from the sidebar
2. Fill in the "Add New Agent" form:
   - Full Name (minimum 2 characters)
   - Valid Email Address
   - Mobile Number with country code (e.g., +1234567890)
   - Password (minimum 6 characters)
3. Click "Add Agent" to create the agent
4. View all agents in the table below

### 3. Uploading and Distributing Lists
1. Navigate to "Upload Lists" section
2. Prepare your file with required columns:
   - **FirstName** (Text)
   - **Phone** (Number)
   - **Notes** (Text, optional)
3. Drag and drop your file or click to browse
4. Supported formats: CSV, XLSX, XLS (max 5MB)
5. Click "Upload & Distribute" to process
6. View distribution statistics and results

### 4. Viewing Agent Lists
1. Go to "Agent Lists" section
2. View distributed lists for each agent
3. Use search functionality to find specific entries
4. Filter by specific agents using the dropdown
5. Click on agent cards to expand and view detailed lists

## 📁 Project Structure

```
mern-agent-management/
├── backend/                     # Your existing backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── frontend/                    # New React frontend
    ├── public/
    ├── src/
    │   ├── components/          # React components
    │   │   ├── AgentLists.jsx      # View distributed lists
    │   │   ├── AgentManagement.jsx # Create & manage agents
    │   │   ├── Dashboard.jsx       # Main dashboard layout
    │   │   ├── ListUpload.jsx      # File upload interface
    │   │   ├── Login.jsx           # Authentication form
    │   │   └── ProtectedRoute.jsx  # Route protection
    │   ├── context/             # React context
    │   │   └── AuthContext.jsx     # Authentication state
    │   ├── services/            # API services
    │   │   └── api.js              # Axios configuration
    │   ├── App.jsx              # Main application component
    │   ├── main.jsx             # Application entry point
    │   └── index.css            # Global styles
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── README.md
```

## 🔗 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - Authenticate admin user

### Agent Management Endpoints
- `GET /api/agents` - Retrieve all agents
- `POST /api/agents` - Create a new agent

### List Management Endpoints
- `POST /api/lists/upload` - Upload and distribute CSV files
- `GET /api/lists` - Retrieve all agent lists

### Request/Response Examples

**Login Request:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Create Agent Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobileNumber": "+1234567890",
  "password": "securepass123"
}
```

## 📸 Screenshots

### Login Page
- Clean, professional login interface
- Form validation with real-time feedback
- Responsive design for all devices

### Dashboard
- Modern sidebar navigation
- Statistics cards showing key metrics
- Quick access to all major features

### Agent Management
- Intuitive agent creation form
- Real-time validation and error handling
- Clean table view of all agents

### File Upload
- Drag & drop interface
- File validation and progress indicators
- Distribution statistics and results

### Agent Lists
- Expandable agent sections
- Advanced search and filtering
- Responsive table design

## 🔍 File Upload Requirements

### Supported File Formats
- **CSV** (.csv) - Comma-separated values
- **Excel** (.xlsx, .xls) - Microsoft Excel formats

### Required CSV Structure
```csv
FirstName,Phone,Notes
John,+1234567890,Important client
Jane,+9876543210,Follow up required
Bob,+1122334455,New lead
```

### File Constraints
- Maximum file size: 5MB
- Required columns: FirstName, Phone
- Optional columns: Notes
- Headers must match exactly (case-sensitive)

### Distribution Logic
- Lists are distributed equally among all available agents
- If total items aren't divisible by agent count, remaining items are distributed sequentially
- Example: 25 items ÷ 5 agents = 5 items each
- Example: 23 items ÷ 5 agents = 5,5,5,4,4 items respectively

## 🛠 Available Scripts

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint linter
```

### Backend Scripts (Your existing setup)
```bash
npm start            # Start production server
npm run dev          # Start development with nodemon
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. **Backend Connection Errors**
```bash
# Check if backend is running
curl http://localhost:5000/api/agents

# Verify proxy configuration in vite.config.js
# Ensure CORS is properly configured in backend
```

#### 2. **Authentication Issues**
```bash
# Clear browser localStorage
localStorage.clear()

# Check JWT secret in backend .env file
# Verify token expiration settings
```

#### 3. **File Upload Failures**
- **File format issues:** Ensure file is CSV, XLSX, or XLS
- **File size:** Must be under 5MB
- **Headers:** Check column names match exactly (FirstName, Phone, Notes)
- **Agents:** Ensure at least one agent exists before uploading

#### 4. **Database Connection Issues**
```bash
# Check MongoDB is running
mongo

# Verify connection string in .env
MONGO_URI=mongodb://localhost:27017/agent-management
```

#### 5. **Build and Dependency Issues**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear browser cache and try again
# Check for any console errors in browser developer tools
```

### Environment Issues
- **Node.js version:** Use version 16 or higher
- **Port conflicts:** Change ports in configuration files if needed
- **Firewall:** Ensure ports 3000 and 5000 are not blocked

## 🚀 Performance Optimizations

### Frontend Optimizations
- **Code splitting** with React lazy loading
- **Bundle optimization** with Vite
- **Efficient re-renders** using React hooks properly
- **Image optimization** for faster loading
- **Caching strategies** for API responses

### Backend Optimizations (Suggestions)
- **Database indexing** on frequently queried fields
- **Request rate limiting** for security
- **Data validation** at multiple levels
- **Error logging** for better debugging
- **Connection pooling** for database efficiency

## 📊 Browser Support

This application is tested and supported on:

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Mobile browsers** (iOS Safari, Chrome Mobile)

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Code Style
- Use consistent indentation (2 spaces)
- Follow React best practices and hooks patterns
- Write descriptive variable and function names
- Add comments for complex logic

### Pull Request Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Add proper error handling for all new features
- Include loading states for async operations
- Ensure responsive design works on all screen sizes
- Update documentation for any new features
- Test thoroughly before submitting

## 📝 License

This project is created for educational and demonstration purposes. Feel free to use it as a learning resource or starting point for your own projects.

## 🆘 Support

If you encounter any issues or have questions:

1. **Check the troubleshooting section** above
2. **Review the console logs** for detailed error messages
3. **Verify your setup** matches the prerequisites
4. **Test with the default credentials** first
5. **Check network connectivity** between frontend and backend

---

**Happy coding!** 🎉 If you found this project helpful, please consider giving it a star ⭐
