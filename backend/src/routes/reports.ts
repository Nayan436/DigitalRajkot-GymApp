import express from 'express';
import { readJSON } from '../models/storage';
import { Member, Plan, Attendance, Expense } from '../models/storage';

const router = express.Router();

router.get('/summary', async (req, res) => {
  const members = await readJSON<Member>('members.json');
  const plans = await readJSON<Plan>('plans.json');
  const expenses = await readJSON<Expense>('expenses.json');
  const attendances = await readJSON<Attendance>('attendance.json');
  
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Active members
  const activeMembers = members.filter(m => m.status === 'active');
  
  // Monthly revenue
  const monthlyRevenue = activeMembers.reduce((sum, member) => {
    const plan = plans.find(p => p.plan_id === member.plan_id);
    return sum + (plan ? plan.price : 0);
  }, 0);
  
  // Monthly expenses
  const monthlyExpenses = expenses
    .filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    })
    .reduce((sum, e) => sum + e.amount, 0);
  
  // Attendance this month
  const monthlyAttendance = attendances.filter(a => {
    const attendanceDate = new Date(a.date);
    return attendanceDate.getMonth() === currentMonth && attendanceDate.getFullYear() === currentYear;
  }).length;
  
  res.json({
    totalActiveMembers: activeMembers.length,
    monthlyRevenue,
    monthlyExpenses,
    netProfit: monthlyRevenue - monthlyExpenses,
    monthlyAttendance
  });
});

export default router;
