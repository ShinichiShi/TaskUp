import React, { useState } from "react";
import { FaBars, FaHome, FaTasks, FaCog } from "react-icons/fa";

export default function Sidebar({ setActiveSection }: { setActiveSection: (section: string) => void }) {
  const [activeSection, setActive] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(false);

  const handleSectionClick = (section: string) => {
    setActive(section);
    setActiveSection(section);
    setIsOpen(false);
  };

  const menuItems = [
    { label: "Dashboard", icon: <FaHome /> },
    { label: "View Tasks", icon: <FaTasks /> },
    { label: "Settings", icon: <FaCog /> },
  ];

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-white bg-blue-500 rounded-lg m-2">
        <FaBars />
      </button>

      <div className={`fixed md:relative top-0 left-0 w-64 bg-white shadow-md h-full transition-transform transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <h2 className="text-xl font-semibold p-4">Task Manager</h2>
        <nav className="flex flex-col gap-4 p-4">
          {menuItems.map((item) => (
            <div
              key={item.label}
              onClick={() => handleSectionClick(item.label)}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${activeSection === item.label ? "bg-blue-500 text-white" : "hover:bg-blue-100 hover:text-black"}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
