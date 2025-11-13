import express from 'express';
import { readJSON, writeJSON, uuidv4 } from '../models/storage';
import { Attendance, Member } from '../models/storage';

const router = express.Router();

router.get('/', async (req, res) => {
  const { filter = 'daily' } = req.query;
  const attendances = await readJSON<Attendance>('attendance.json');
  const today = new Date().toISOString().split('T')[0];
  
  const filtered = filter === 'daily' 
    ? attendances.filter(a => a.date === today)
    : attendances;
  
  res.json(filtered);
});

router.post('/', async (req, res) => {
  const { member_id } = req.body;
  const now = new Date();
  
  const attendance: Attendance = {
    id: uuidv4(),
    member_id,
    date: now.toISOString().split('T')[0],
    time: now.toTimeString().split(' ')[0],
    marked_by: (req as any).user.username
  };
  
  const attendances = await readJSON<Attendance>('attendance.json');
  attendances.push(attendance);
  await writeJSON('attendance.json', attendances);
  
  res.json(attendance);
});

export default router;
