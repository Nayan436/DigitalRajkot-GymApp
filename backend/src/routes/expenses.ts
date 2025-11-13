import express from 'express';
import { readJSON, writeJSON, uuidv4 } from '../models/storage';
import { Expense } from '../models/storage';

const router = express.Router();

router.get('/', async (req, res) => {
  const expenses = await readJSON<Expense>('expenses.json');
  res.json(expenses);
});

router.post('/', async (req, res) => {
  const expense: Expense = {
    id: uuidv4(),
    ...req.body
  };
  
  const expenses = await readJSON<Expense>('expenses.json');
  expenses.push(expense);
  await writeJSON('expenses.json', expenses);
  
  res.json(expense);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const expenses = await readJSON<Expense>('expenses.json');
  const filtered = expenses.filter(e => e.id !== id);
  
  if (filtered.length === expenses.length) return res.status(404).json({ error: 'Expense not found' });
  
  await writeJSON('expenses.json', filtered);
  res.json({ message: 'Expense deleted' });
});

export default router;
