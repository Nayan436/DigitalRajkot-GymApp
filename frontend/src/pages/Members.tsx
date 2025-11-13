import { useEffect, useState } from 'react';
import API from '../services/api';
import Modal from '../components/Modal';

const Members = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    join_date: new Date().toISOString().split('T')[0],
    plan_id: '',
    notes: ''
  });
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    fetchMembers();
    fetchPlans();
  }, []);

  const fetchMembers = async () => {
    const { data } = await API.get('/members');
    setMembers(data);
  };

  const fetchPlans = async () => {
    const { data } = await API.get('/plans');
    setPlans(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await API.post('/members', formData);
    setIsModalOpen(false);
    fetchMembers();
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Members</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Member
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.member_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{member.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{member.plan?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Member">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
          <select
            className="w-full px-4 py-2 border rounded-lg"
            onChange={(e) => setFormData({...formData, plan_id: e.target.value})}
            required
          >
            <option value="">Select Plan</option>
            {plans.map(plan => (
              <option key={plan.plan_id} value={plan.plan_id}>{plan.name} - ${plan.price}</option>
            ))}
          </select>
          <textarea
            placeholder="Notes"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Add Member
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Members;
