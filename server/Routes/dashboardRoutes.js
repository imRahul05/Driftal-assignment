import express from 'express';
import {
  getDashboardSummary,
  getInterfaceLogs,
  getInterfaceNames,
  getIntegrationKeys,
  getRealTimeMetrics,
  getPerformanceMetrics,
  getHealthCheck
} from '../controllers/dashboardController.js';

const router = express.Router();

// Dashboard summary endpoint
router.get('/summary', getDashboardSummary);

// Interface logs endpoints
router.get('/logs', getInterfaceLogs);
router.get('/names', getInterfaceNames);
router.get('/keys', getIntegrationKeys);

// Real-time and performance metrics
router.get('/realtime', getRealTimeMetrics);
router.get('/performance', getPerformanceMetrics);

// Health check
router.get('/health', getHealthCheck);

export default router;
