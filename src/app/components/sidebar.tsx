import React from 'react';
import { FaHome, FaTasks, FaCog, FaUsers } from 'react-icons/fa';

export default function Sidebar({ setActiveSection }: { setActiveSection: (section: string) => void }) {
  const menuItems = [
    { label: 'Dashboard', icon: <FaHome /> },
    { label: 'View Tasks', icon: <FaTasks /> },
    { label: 'Team', icon: <FaUsers /> },
    { label: 'Settings', icon: <FaCog /> },
  ];

  return (
    <div className="flex flex-col h-screen w-1/6 p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Task Manager</h2>
      <nav className="flex flex-col gap-4">
        {menuItems.map((item) => (
          <div
            key={item.label}
            onClick={() => setActiveSection(item.label)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100 hover:text-black cursor-pointer transition"
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}
