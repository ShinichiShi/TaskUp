'use client';
import { useState } from 'react';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import ViewTasks from './components/viewtasks';
import Dashboard from './components/dashboard';
import Settings from './components/settings';
import TeamCalendar from './components/team';
export default function TaskForm() {
  const [activeSection, setActiveSection] = useState('Dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'Dashboard':
        return <Dashboard/>;
      case 'View Tasks':
        return <ViewTasks/>
      case 'Team':
        return <TeamCalendar/>
      case 'Settings':
        return <Settings/>
      default:
        return <div>Select an option from the sidebar.</div>;
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-full flex h-screen">
        <Sidebar setActiveSection={setActiveSection} />
        <div className="flex-grow p-4 bg-slate-400 rounded-lg shadow-md">
          {renderContent()}
        </div>
      </div>
    </>
  );
}
