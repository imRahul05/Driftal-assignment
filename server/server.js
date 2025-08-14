import express from "express";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";

// Import routes
import dashboardRoutes from './Routes/dashboardRoutes.js';
import interfaceRoutes from './Routes/interfaceRoutes.js';
import dataRoutes from './Routes/dataRoutes.js';

// Import middleware
import { corsMiddleware, requestLogger, errorHandler, rateLimiter } from './middleware/common.js';

// Import data seeder
import { seedDatabase } from './utils/dataSeeder.js';

configDotenv();

const connectedToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);
app.use(requestLogger);
app.use(rateLimiter(60000, 1000)); // 1000 requests per minute

// API Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/interfaces', interfaceRoutes);
app.use('/api/data', dataRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "🚀 ConnexView API Server",
    version: "1.0.0",
    status: "operational",
    endpoints: {
      dashboard: "/api/dashboard",
      interfaces: "/api/interfaces", 
      data: "/api/data",
      health: "/api/dashboard/health"
    },
    documentation: "https://github.com/your-repo/connexview-api"
  });
});

// Test route
app.get("/test", (req, res) => {
  res.status(200).json({
    message: "Server is working ✅",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Seed data endpoint (for development)
app.post("/api/seed-data", async (req, res) => {
  try {
    console.log('🌱 Manual data seeding triggered...');
    const result = await seedDatabase();
    
    res.status(200).json({
      success: true,
      message: 'Database seeded successfully',
      ...result
    });
  } catch (error) {
    console.error('❌ Manual seeding failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message
    });
  }
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Handle invalid routes (must be after all valid routes)
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: "Invalid route - endpoint not found",
    availableEndpoints: [
      "/api/dashboard/summary",
      "/api/dashboard/logs", 
      "/api/interfaces/logs",
      "/api/data/seed"
    ]
  });
});

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    // Connect to database first
    await connectedToDB();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 ConnexView API Server running at http://localhost:${PORT}`);
      console.log(`📊 Dashboard API: http://localhost:${PORT}/api/dashboard`);
      console.log(`� Interface API: http://localhost:${PORT}/api/interfaces`);
      console.log(`🌱 Seed Data: POST http://localhost:${PORT}/api/seed-data`);
      console.log(`💊 Health Check: http://localhost:${PORT}/api/dashboard/health`);
    });

    // Seed database with sample data if empty
    try {
      const mongoose = require('mongoose').default || require('mongoose');
      const collections = await mongoose.connection.db.listCollections().toArray();
      const hasInterfaceLogs = collections.some(col => col.name === 'interface_logs');
      
      if (!hasInterfaceLogs) {
        console.log('📦 No existing data found. Seeding database...');
        await seedDatabase();
      } else {
        // Check if we have data
        const InterfaceLog = (await import('./models/InterfaceLog.js')).default;
        const count = await InterfaceLog.countDocuments();
        
        if (count === 0) {
          console.log('📦 Empty database detected. Seeding with sample data...');
          await seedDatabase();
        } else {
          console.log(`📊 Found ${count} existing interface log records`);
        }
      }
    } catch (seedError) {
      console.warn('⚠️  Auto-seeding failed (this is okay for production):', seedError.message);
    }

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server gracefully...');
  try {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
startServer();