import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(__dirname, '../../data');

interface User {
  id: string;
  username: string;
  password: string;
}

interface Member {
  member_id: string;
  name: string;
  phone: string;
  join_date: string;
  plan_id: string;
  status: 'active' | 'expired';
  notes?: string;
}

interface Plan {
  plan_id: string;
  name: string;
  price: number;
  duration_days: number;
  description?: string;
}

interface Attendance {
  id: string;
  member_id: string;
  date: string;
  time: string;
  marked_by: string;
}

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  note?: string;
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Generic JSON file operations
async function readJSON<T>(filename: string): Promise<T[]> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(path.join(DATA_DIR, filename), 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeJSON(filename: string, data: any) {
  await ensureDataDir();
  await fs.writeFile(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));
}

// Seed default data
export async function seedData() {
  const users = await readJSON<User>('users.json');
  if (users.length === 0) {
    const hashedPassword = await bcrypt.hash('541999', 10);
    await writeJSON('users.json', [{
      id: uuidv4(),
      username: 'nayan',
      password: hashedPassword
    }]);
  }

  const plans = await readJSON<Plan>('plans.json');
  if (plans.length === 0) {
    await writeJSON('plans.json', [
      {
        plan_id: uuidv4(),
        name: 'Basic Monthly',
        price: 50,
        duration_days: 30,
        description: 'Access to basic facilities'
      },
      {
        plan_id: uuidv4(),
        name: 'Premium Monthly',
        price: 80,
        duration_days: 30,
        description: 'All facilities + personal trainer'
      },
      {
        plan_id: uuidv4(),
        name: 'Quarterly',
        price: 120,
        duration_days: 90,
        description: 'Save with quarterly commitment'
      }
    ]);
  }

  const members = await readJSON<Member>('members.json');
  if (members.length === 0) {
    const samplePlans = await readJSON<Plan>('plans.json');
    await writeJSON('members.json', [
      {
        member_id: uuidv4(),
        name: 'John Doe',
        phone: '555-0101',
        join_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        plan_id: samplePlans[0].plan_id,
        status: 'active',
        notes: 'New member'
      },
      // Add 4 more sample members...
    ]);
  }
}

// Export helpers
export { readJSON, writeJSON, uuidv4 };
export type { User, Member, Plan, Attendance, Expense };
