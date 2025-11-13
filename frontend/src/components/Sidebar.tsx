import { NavLink } from 'react-router-dom';
import { HomeIcon, UsersIcon, ClipboardDocumentListIcon, CalendarDaysIcon, BanknotesIcon, ChartBarIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const navItems = [
    { path: '/', icon: HomeIcon, label: 'Dashboard' },
    { path: '/members', icon: UsersIcon, label: 'Members' },
    { path: '/plans', icon: ClipboardDocumentListIcon, label: 'Plans' },
    { path: '/attendance', icon: CalendarDaysIcon, label: 'Attendance' },
    { path: '/expenses', icon: BanknotesIcon, label: 'Expenses' },
    { path: '/reports', icon: ChartBarIcon, label: 'Reports' },
    { path: '/settings', icon: Cog6ToothIcon, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-white h-screen shadow-lg fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">GymPro</h1>
      </div>
      <nav className="mt-6">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 ${
                isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
              }`
            }
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
