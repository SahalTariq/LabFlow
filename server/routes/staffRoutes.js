// server/routes/staffRoutes.js - Express API for staff accounts and login
import express from 'express';
import { StaffModel } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const staff = await StaffModel.find();
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await StaffModel.login(identifier, password);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
