import express from 'express';
import { seedData, addMoreData } from '../controllers/dataController.js';

const router = express.Router();

// Data seeding endpoints
router.post('/seed', seedData);
router.post('/add-more', addMoreData);

export default router;
