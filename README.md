# Vaccine Information Lookup Application

A comprehensive web application that provides accurate, FDA-sourced vaccine information including clinical trial data, adverse effects, and approval timelines. Built with React/TypeScript frontend and Node.js/Express backend with PostgreSQL database.

## 🎯 Features

- **FDA-Sourced Data**: All vaccine information retrieved directly from FDA databases
- **Comprehensive Information**: Clinical trials, adverse effects, approval dates, manufacturers
- **Modern UI**: Responsive design with professional styling and smooth animations
- **Real-time Search**: Dynamic vaccine lookup with dropdown selection
- **Mobile-Ready**: Architecture designed for future mobile app development
- **Error Handling**: Robust error handling with user-friendly messages
- **Performance Optimized**: Caching, lazy loading, and optimized database queries

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vaccine-lookup
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up the database**
   
   Create a PostgreSQL database:
   ```sql
   createdb vaccine_lookup
   ```

4. **Configure environment variables**
   
   Copy the example environment file:
   ```bash
   cp backend/env.example backend/.env
   ```
   
   Edit `backend/.env` with your database credentials:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://username:password@localhost:5432/vaccine_lookup
   NODE_ENV=development
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=vaccine_lookup
   DB_USER=your_username
   DB_PASSWORD=your_password
   
   # API Configuration
   FDA_BASE_URL=https://www.fda.gov
   API_RATE_LIMIT=100
   CACHE_DURATION=3600000
   ```

5. **Initialize the database**
   ```bash
   cd backend
   npm run setup-db
   cd ..
   ```

6. **Start the application**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
vaccine-lookup/
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic and FDA integration
│   │   ├── scripts/           # Database setup scripts
│   │   └── server.js          # Express server setup
│   ├── package.json
│   └── env.example
├── frontend/                   # React/TypeScript frontend
│   ├── public/                # Static files
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/             # Page components
│   │   ├── context/           # React context for state management
│   │   ├── services/          # API service layer
│   │   ├── types/             # TypeScript type definitions
│   │   ├── utils/             # Utility functions
│   │   └── styles/            # Global styles
│   ├── package.json
│   └── tsconfig.json
├── package.json               # Root package.json for scripts
└── README.md
```

## 🛠 Development

### Available Scripts

From the root directory:
- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend development server
- `npm run build` - Build the frontend for production
- `npm run install-all` - Install dependencies for all packages

### Backend Scripts

From the `backend/` directory:
- `npm run dev` - Start server with nodemon (auto-restart)
- `npm start` - Start server in production mode
- `npm run setup-db` - Initialize database schema and sample data

### Frontend Scripts

From the `frontend/` directory:
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🗄 Database Schema

### Tables

1. **vaccines** - Core vaccine information
   - id, name, manufacturer, fda_approved_date, childhood_schedule_date, description, fda_url

2. **manufacturers** - Vaccine manufacturer details
   - id, name, website

3. **clinical_trials** - Clinical trial data
   - id, vaccine_id, trial_phase, duration_months, participant_count, age_range_min, age_range_max, start_date, end_date, trial_identifier, description

4. **adverse_effects** - Reported adverse effects
   - id, vaccine_id, effect_name, severity, occurrence_rate, description, reported_cases

## 🌐 API Endpoints

### Vaccines

- `GET /api/vaccines` - Get all vaccines
- `GET /api/vaccines/:id` - Get vaccine details with clinical trials and adverse effects
- `GET /api/vaccines/search/:name` - Search vaccines by name
- `GET /api/vaccines/stats/overview` - Get vaccine statistics
- `POST /api/vaccines/refresh-fda-data` - Refresh data from FDA (admin)

### Health Check

- `GET /api/health` - Application health status

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
PORT=5000                      # Server port
DATABASE_URL=postgresql://...  # Full database connection string
NODE_ENV=development           # Environment (development/production)

# Database Configuration
DB_HOST=localhost              # Database host
DB_PORT=5432                   # Database port
DB_NAME=vaccine_lookup         # Database name
DB_USER=username               # Database username
DB_PASSWORD=password           # Database password

# API Configuration
FDA_BASE_URL=https://www.fda.gov  # FDA base URL
API_RATE_LIMIT=100                # API rate limit
CACHE_DURATION=3600000            # Cache duration in milliseconds
```

**Frontend (.env - optional)**
```env
REACT_APP_API_URL=http://localhost:5000/api  # Backend API URL
```

## 🚀 Deployment

### Production Build

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Set environment to production**
   ```bash
   export NODE_ENV=production
   ```

3. **Start the backend**
   ```bash
   cd backend
   npm start
   ```

### Docker Deployment (Optional)

Create a `Dockerfile` for containerized deployment:

```dockerfile
# Frontend build stage
FROM node:16-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Backend stage
FROM node:16-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --only=production
COPY backend/ ./
COPY --from=frontend-build /app/frontend/build ./public

EXPOSE 5000
CMD ["npm", "start"]
```

### Environment-Specific Considerations

**Development**
- CORS enabled for localhost:3000
- Detailed error messages
- Development logging

**Production**
- CORS restricted to production domains
- Error messages sanitized
- Production logging and monitoring
- SSL/HTTPS required
- Database connection pooling optimized

## 📚 Technology Stack

### Frontend
- **React 18** - Component-based UI library
- **TypeScript** - Type safety and better development experience
- **Styled Components** - CSS-in-JS for component styling
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Toastify** - User notifications
- **React Loading Skeleton** - Loading states

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **Axios** - HTTP client for FDA data fetching
- **Cheerio** - Server-side HTML parsing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Compression** - Response compression

### Development Tools
- **Nodemon** - Development server auto-restart
- **Concurrently** - Run multiple scripts simultaneously
- **ESLint** - Code linting
- **Prettier** - Code formatting (recommended)

## 🔐 Security Considerations

- **Input Validation** - All user inputs validated and sanitized
- **SQL Injection Prevention** - Parameterized queries used throughout
- **CORS Configuration** - Properly configured for production domains
- **Rate Limiting** - API rate limiting implemented
- **Helmet Security** - Security headers applied
- **Environment Variables** - Sensitive data stored in environment variables

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test  # Run backend unit tests
```

### Frontend Testing
```bash
cd frontend
npm test  # Run frontend component tests
```

### Integration Testing
- API endpoint testing with Postman collections
- Database migration testing
- FDA data fetching integration tests

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check database credentials in .env file
   - Ensure database exists

2. **Port Already in Use**
   - Change PORT in backend/.env
   - Kill process using the port: `lsof -ti:5000 | xargs kill -9`

3. **FDA Data Fetching Issues**
   - Check internet connection
   - Verify FDA website is accessible
   - Review rate limiting settings

4. **Frontend Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
   - Check TypeScript errors: `npx tsc --noEmit`

### Logging

- Backend logs are output to console
- Frontend errors logged to browser console
- Database query logging enabled in development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and test thoroughly
4. Commit with descriptive messages
5. Push to your fork and create a pull request

### Development Guidelines

- Follow TypeScript best practices
- Maintain consistent code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **FDA** - For providing comprehensive vaccine data and documentation
- **React Team** - For the excellent frontend framework
- **Node.js Community** - For the robust backend ecosystem
- **PostgreSQL Team** - For the reliable database system

## 📞 Support

For questions, issues, or contributions:
- Create an issue in the repository
- Check existing documentation
- Review troubleshooting section

---

**Disclaimer**: This application provides informational content sourced from FDA databases. It is not intended to replace professional medical advice. Always consult with qualified healthcare professionals regarding vaccine decisions.

