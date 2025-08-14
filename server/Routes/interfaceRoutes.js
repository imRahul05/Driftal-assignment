import express from 'express';
import {
  getInterfaceLogs,
  getInterfaceNames,
  getIntegrationKeys
} from '../controllers/dashboardController.js';

const router = express.Router();

// Interface-specific endpoints
router.get('/logs', getInterfaceLogs);
router.get('/names', getInterfaceNames);
router.get('/keys', getIntegrationKeys);

export default router;
