interface StatCardProps {
  title: string;
  value: string | number;
  color: 'blue' | 'green' | 'red' | 'purple';
}

const colorMap = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
};

const StatCard = ({ title, value, color }: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200">
      <div className={`w-12 h-12 ${colorMap[color]} rounded-lg mb-4`}></div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
};

export default StatCard;
