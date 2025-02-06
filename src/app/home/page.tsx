"use client";
import { useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import ViewTasks from "../components/viewtasks";
import Dashboard from "../components/dashboard";
import Settings from "../components/settings";
export default function TaskForm() {
  const [activeSection, setActiveSection] = useState("Dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "Dashboard":
        return <Dashboard />;
      case "View Tasks":
        return <ViewTasks />;
      case "Settings":
        return <Settings />;
      default:
        return <div>Select an option from the sidebar.</div>;
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-full flex h-[100vh]">
        <Sidebar setActiveSection={setActiveSection} />
        <div className="flex-grow p-4 rounded-lg bg-slate-400 shadow-md">
          {renderContent()}
        </div>
      </div>
    </>
  );
}
