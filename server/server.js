import express from "express";
import { configDotenv } from "dotenv";
import connectedToDB from "./config/db.js";

// Routes
import dashboardRoutes from './Routes/dashboardRoutes.js';
import interfaceRoutes from './Routes/interfaceRoutes.js';
import dataRoutes from './Routes/dataRoutes.js';

// Middleware
import { corsMiddleware, requestLogger, errorHandler, rateLimiter } from './middleware/common.js';

// Data Seeder
import { seedDatabase } from './utils/dataSeeder.js';

const PORT = process.env.PORT || 8000;
configDotenv();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);
app.use(requestLogger);
app.use(rateLimiter(60000, 1000));

// Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/interfaces', interfaceRoutes);
app.use('/api/data', dataRoutes);

// Root
app.get("/", (req, res) => {
  res.status(200).json({
    message: "ConnexView API Server",
    version: "1.0.0",
    status: "operational"
  });
});

// Test
app.get("/test", (req, res) => {
  res.status(200).json({
    message: "Server is working",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Seed data (manual only)
app.post("/api/seed-data", async (req, res) => {
  try {
    const result = await seedDatabase();
    res.status(200).json({
      success: true,
      message: 'Database seeded successfully',
      ...result
    });
  } catch (error) {
    console.error('Manual seeding failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message
    });
  }
});

// Error handling
app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Invalid route - endpoint not found"
  });
});

const startServer = async () => {
  try {
    await connectedToDB();
    app.listen(PORT, () => {
      console.log(`ConnexView API Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};



// Start
startServer();
