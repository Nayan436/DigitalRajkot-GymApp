import { useEffect, useState } from 'react';
import API from '../services/api';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data } = await API.get('/reports/summary');
    setStats(data);
  };

  const chartData = [
    { name: 'Week 1', visits: 45 },
    { name: 'Week 2', visits: 52 },
    { name: 'Week 3', visits: 48 },
    { name: 'Week 4', visits: stats?.monthlyAttendance || 58 },
  ];

  if (!stats) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Active Members" value={stats.totalActiveMembers} color="blue" />
        <StatCard title="Monthly Revenue" value={`$${stats.monthlyRevenue}`} color="green" />
        <StatCard title="Monthly Expenses" value={`$${stats.monthlyExpenses}`} color="red" />
        <StatCard title="Net Profit" value={`$${stats.netProfit}`} color="purple" />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Monthly Attendance Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="visits" stroke="#3B82F6" fill="#93C5FD" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
