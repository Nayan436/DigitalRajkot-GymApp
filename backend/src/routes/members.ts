import express from 'express';
import { readJSON, writeJSON, uuidv4 } from '../models/storage';
import { Member, Plan } from '../models/storage';

const router = express.Router();

router.get('/', async (req, res) => {
  const members = await readJSON<Member>('members.json');
  const plans = await readJSON<Plan>('plans.json');
  
  const membersWithPlans = members.map(member => ({
    ...member,
    plan: plans.find(p => p.plan_id === member.plan_id)
  }));
  
  res.json(membersWithPlans);
});

router.post('/', async (req, res) => {
  const { name, phone, join_date, plan_id, notes } = req.body;
  
  const newMember: Member = {
    member_id: uuidv4(),
    name,
    phone,
    join_date,
    plan_id,
    status: 'active',
    notes: notes || ''
  };
  
  const members = await readJSON<Member>('members.json');
  members.push(newMember);
  await writeJSON('members.json', members);
  
  res.json(newMember);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const members = await readJSON<Member>('members.json');
  const index = members.findIndex(m => m.member_id === id);
  
  if (index === -1) return res.status(404).json({ error: 'Member not found' });
  
  members[index] = { ...members[index], ...req.body };
  await writeJSON('members.json', members);
  
  res.json(members[index]);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const members = await readJSON<Member>('members.json');
  const filtered = members.filter(m => m.member_id !== id);
  
  if (filtered.length === members.length) return res.status(404).json({ error: 'Member not found' });
  
  await writeJSON('members.json', filtered);
  res.json({ message: 'Member deleted' });
});

export default router;
