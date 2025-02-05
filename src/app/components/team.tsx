'use client';

import React, { useState } from 'react';

type TaskMap = {
  [key: string]: string[];
};

const teamMembers: string[] = ['Alice', 'Bob', 'Charlie', 'David'];
const daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function TeamCalendar() {
  const [tasks, setTasks] = useState<TaskMap>({});
  
  const addTask = (member: string, day: string) => {
    const task = prompt(`Enter task for ${member} on ${day}:`);
    if (task) {
      setTasks((prev) => {
        const key = `${member}-${day}`;
        return {
          ...prev,
          [key]: prev[key] ? [...prev[key], task] : [task],
        };
      });
    }
  };

  const removeTask = (member: string, day: string, index: number) => {
    setTasks((prev) => {
      const key = `${member}-${day}`;
      if (!prev[key]) return prev;
      const updatedTasks = [...prev[key]];
      updatedTasks.splice(index, 1);
      return updatedTasks.length ? { ...prev, [key]: updatedTasks } : (() => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      })();
    });
  };

  return (
    <div className="p-6 bg-gray-100 text-black">
      <h2 className="text-2xl font-semibold mb-4">Team Weekly Calendar</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-200">Team Member</th>
              {daysOfWeek.map((day) => (
                <th key={day} className="border p-2 bg-gray-200">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => (
              <tr key={member}>
                <td className="border p-2 bg-gray-50 font-bold">{member}</td>
                {daysOfWeek.map((day) => (
                  <td key={day} className="border p-2 relative h-20">
                    {tasks[`${member}-${day}`] && tasks[`${member}-${day}`].length > 0 ? (
                      <div className="space-y-2">
                        {tasks[`${member}-${day}`].map((task, index) => (
                          <div key={index} className="p-1 bg-blue-500 text-white rounded flex justify-between">
                            {task}
                            <button
                              onClick={() => removeTask(member, day, index)}
                              className="ml-2 text-xs text-red-200 hover:text-red-500"
                            >
                              ✖
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <button
                        onClick={() => addTask(member, day)}
                        className="text-blue-500 hover:underline"
                      >
                        + Add Task
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
