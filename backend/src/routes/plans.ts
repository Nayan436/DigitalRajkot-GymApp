import express from 'express';
import { readJSON, writeJSON, uuidv4 } from '../models/storage';
import { Plan } from '../models/storage';

const router = express.Router();

router.get('/', async (req, res) => {
  const plans = await readJSON<Plan>('plans.json');
  res.json(plans);
});

router.post('/', async (req, res) => {
  const newPlan: Plan = {
    plan_id: uuidv4(),
    ...req.body
  };
  
  const plans = await readJSON<Plan>('plans.json');
  plans.push(newPlan);
  await writeJSON('plans.json', plans);
  
  res.json(newPlan);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const plans = await readJSON<Plan>('plans.json');
  const index = plans.findIndex(p => p.plan_id === id);
  
  if (index === -1) return res.status(404).json({ error: 'Plan not found' });
  
  plans[index] = { ...plans[index], ...req.body };
  await writeJSON('plans.json', plans);
  
  res.json(plans[index]);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const plans = await readJSON<Plan>('plans.json');
  const filtered = plans.filter(p => p.plan_id !== id);
  
  if (filtered.length === plans.length) return res.status(404).json({ error: 'Plan not found' });
  
  await writeJSON('plans.json', filtered);
  res.json({ message: 'Plan deleted' });
});

export default router;
