# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# ConnexView - Interface Monitoring Dashboard

A modern, real-time interface monitoring dashboard for HR integrations built with React and styled-components.

## 🎯 Project Overview

ConnexView is a web-based Interface Monitoring Dashboard designed to help users visualize the health and history of data replication interfaces between systems like SAP SuccessFactors and downstream applications (SAP ECP, 3rd party apps).

## ✨ Key Features

### 📊 Homepage Dashboard (Summary View)
- **Metrics Display**: Success vs. failure counts with visual indicators
- **Time Range Filters**: Last Hour, 24 Hours, Week, Month, Custom date range
- **Trend Visualization**: Charts showing interface execution trends
- **System Status**: Real-time health indicators

### 📋 Live Interface Logs Table
- **Comprehensive Fields**: Interface Name, Integration Key, Status, Message, Timestamp
- **Advanced Filtering**: Filter on every column with global search
- **Smart Indicators**: Color-coded status badges and severity levels
- **Pagination**: Efficient handling of large datasets
- **Sorting**: Multi-column sorting capabilities

### 🎛️ Advanced Filters & Controls
- **Dynamic Filtering**: Real-time filter application
- **Preset Filters**: Quick access to common filter combinations
- **Filter Chips**: Visual representation of active filters
- **Time-based Controls**: Flexible time range selection

### 🔔 Real-time Notifications
- **Alert System**: Error, warning, success, and info notifications
- **Categorized Filtering**: Filter notifications by type
- **Auto-dismiss**: Configurable notification timeout
- **Action Buttons**: Quick actions for notification handling

## 🛠️ Technical Architecture

### Frontend Stack
- **React 19**: Latest React with hooks and modern patterns
- **Styled-components**: CSS-in-JS for dynamic styling
- **Vite**: Fast build tool and development server

### Component Structure
```
src/
├── api/
│   └── api.js                 # API service layer with caching
├── components/
│   └── DashBoard/
│       ├── Home.jsx           # Dashboard summary component
│       ├── LogsTable.jsx      # Interface logs table
│       ├── Filters.jsx        # Advanced filtering component
│       ├── Notifications.jsx  # Real-time notifications
│       └── Loader.jsx         # Loading states & skeletons
├── pages/
│   └── DashboardPage.jsx      # Main dashboard page
└── App.jsx                    # Root component with error boundary
```

### Performance Optimizations

#### 🚀 Frontend Optimizations
- **React.memo & useMemo**: Prevent unnecessary re-renders
- **Debounced Search**: Optimized search input handling
- **Virtual Scrolling Ready**: Prepared for infinite scroll implementation
- **Lazy Loading**: Component-level code splitting
- **Caching Strategy**: API response caching with TTL

#### 📡 API Layer Features
- **Request Caching**: 5-minute cache for GET requests
- **Error Handling**: Comprehensive error management
- **Retry Logic**: Automatic retry for failed requests
- **Performance Monitoring**: Request timing and metrics

### UI/UX Design Principles

#### 🎨 Visual Design
- **Glassmorphism**: Modern frosted glass effect with backdrop blur
- **Gradient Backgrounds**: Dynamic color schemes
- **Responsive Grid**: Flexible layout for all screen sizes
- **Dark Theme**: Professional dark interface optimized for monitoring

#### ⚡ User Experience
- **Real-time Updates**: Auto-refresh every 30 seconds
- **Loading States**: Progressive loading with skeletons
- **Error Recovery**: Graceful error handling with retry options
- **Accessibility**: Focus management and keyboard navigation

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=ConnexView
VITE_REFRESH_INTERVAL=30000
```

## 🔌 Backend Integration

### Expected API Endpoints

#### Dashboard Summary
```
GET /api/dashboard/summary?timeRange={timeRange}
Response: {
  summary: {
    totalExecutions: number,
    successfulExecutions: number,
    failedExecutions: number
  },
  trends: {
    totalChange: number,
    successChange: number,
    failureChange: number,
    successRateChange: number
  }
}
```

#### Interface Logs
```
GET /api/interfaces/logs?page={page}&limit={limit}&timeRange={timeRange}&status={status}&interfaceName={name}&integrationKey={key}&sortBy={field}&sortOrder={order}
Response: {
  logs: Array<{
    id: string,
    interfaceName: string,
    integrationKey: string,
    status: 'success' | 'failed' | 'pending' | 'warning',
    message: string,
    timestamp: string
  }>,
  totalPages: number,
  currentPage: number,
  totalCount: number
}
```

### Performance Requirements
- **Scalability**: Handles 500,000+ interface records
- **Response Time**: < 2 seconds for filtered queries
- **Pagination**: Efficient offset/cursor-based pagination
- **Caching**: Redis/in-memory caching for frequently accessed data

## 📈 Performance Features

### Optimization Strategies
- **Component Memoization**: React.memo and useMemo for performance
- **API Caching**: Built-in request caching with TTL
- **Lazy Loading**: Code splitting and dynamic imports
- **Virtual Scrolling Ready**: Prepared for large dataset handling

## 🚀 Deployment

### Build Optimization
```bash
# Production build
npm run build
```

### Deployment Targets
- **Vercel**: Zero-config deployment
- **Netlify**: JAMstack optimized
- **AWS S3 + CloudFront**: Enterprise-grade CDN

## 🤝 Contributing

### Development Workflow
1. Feature branch from `main`
2. Implement changes with tests
3. Submit pull request
4. Code review and merge

## 📝 Future Enhancements

- **WebSocket Integration**: Real-time updates without polling
- **Chart Library**: Interactive data visualizations
- **Export Functionality**: CSV/PDF report generation
- **Mobile Responsive**: Enhanced mobile experience

---

**Live Demo**: [ConnexView Dashboard](http://localhost:5173)  
**Challenge**: Interface Monitoring Dashboard for HR Integrations
