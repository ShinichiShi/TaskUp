import React, { useState } from "react";

function TaskColumn({
    status,
    tasks,
    moveTask,
  }: {
    status: "backlog" | "ongoing" | "completed";
    tasks: string[];
    moveTask: (task: string, from: "backlog" | "ongoing" | "completed", to: "backlog" | "ongoing" | "completed") => void;
  }) {
    const getNextStatus = (current: "backlog" | "ongoing" | "completed") => {
      if (current === "backlog") return "ongoing";
      if (current === "ongoing") return "completed";
      return "backlog";
    };
  
    return (
      <div className="w-1/3 bg-gray-100 p-4 text-black rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-3 text-center">{status.toUpperCase()}</h2>
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <div key={task} className="p-2 bg-white rounded-md shadow flex justify-between">
              <span>{task}</span>
              <button
                onClick={() => moveTask(task, status, getNextStatus(status))}
                className="text-blue-500 hover:underline"
              >
                {status === "backlog" ? "Start" : status === "ongoing" ? "Complete" : "Undo"}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
export default function Dashboard() {
  const [tasks, setTasks] = useState<Record<"backlog" | "ongoing" | "completed", string[]>>({
    backlog: ["Task 1", "Task 2"],
    ongoing: ["Task 3"],
    completed: ["Task 4"],
  });

  const moveTask = (task: string, from: keyof typeof tasks, to: keyof typeof tasks) => {
    setTasks((prev) => {
      const newTasks = { ...prev };
      newTasks[from] = newTasks[from].filter((t) => t !== task);
      newTasks[to] = [...newTasks[to], task];
      return newTasks;
    });
  };

  return (
    <div className="flex gap-4 p-6 ">
      {Object.keys(tasks).map((status) => (
        <TaskColumn
          key={status}
          status={status as keyof typeof tasks}
          tasks={tasks[status as keyof typeof tasks]}
          moveTask={moveTask}
        />
      ))}
    </div>
  );
}
