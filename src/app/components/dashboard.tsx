import React, { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Task = {
  id: string;
  title: string;
};

type Status = "Backlog" | "Ongoing" | "Completed";
type Tasks = Record<Status, Task[]>;

function TaskColumn({
  status,
  tasks,
  moveTask,
  isLoading,
}: {
  status: Status;
  tasks: Task[];
  moveTask: (task: Task, from: Status, to: Status) => Promise<void>;
  isLoading: boolean;
}) {
  const [movingTaskId, setMovingTaskId] = useState<string | null>(null);

  const getNextStatus = (current: Status): Status => {
    if (current === "Backlog") return "Ongoing";
    if (current === "Ongoing") return "Completed";
    return "Backlog";
  };

  const handleMove = async (task: Task) => {
    setMovingTaskId(task.id);
    try {
      await moveTask(task, status, getNextStatus(status));
    } finally {
      setMovingTaskId(null);
    }
  };

  return (
    <div className="w-full md:w-1/3 bg-gray-100 p-4 text-black rounded-lg shadow-md min-h-[400px]">
      <h2 className="text-lg font-semibold mb-3 text-center">{status.toUpperCase()}</h2>
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-12 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-gray-500 py-4">No tasks</div>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id} 
              className="p-3 bg-white rounded-md shadow hover:shadow-lg transition-shadow flex justify-between items-center"
            >
              <span className="font-medium">{task.title}</span>
              <button
                onClick={() => handleMove(task)}
                disabled={movingTaskId === task.id}
                className={`px-3 py-1 rounded-md transition-colors ${
                  movingTaskId === task.id
                    ? "bg-gray-100 text-gray-400"
                    : status === "Backlog"
                    ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    : status === "Ongoing"
                    ? "bg-green-50 text-green-600 hover:bg-green-100"
                    : "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                }`}
              >
                {movingTaskId === task.id ? (
                  <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                ) : status === "Backlog" ? (
                  "Start"
                ) : status === "Ongoing" ? (
                  "Complete"
                ) : (
                  "Undo"
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Tasks>({
    Backlog: [],
    Ongoing: [],
    Completed: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch("/api/tasks");
        if (!res.ok) throw new Error("Failed to fetch tasks");

        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid API response format");
        }

        const formattedTasks: Tasks = {
          Backlog: [],
          Ongoing: [],
          Completed: [],
        };

        data.forEach((task) => {
          if (
            task &&
            typeof task.title === "string" &&
            typeof task._id === "string" &&
            ["Backlog", "Ongoing", "Completed"].includes(task.status)
          ) {
            formattedTasks[task.status as Status].push({
              id: task._id,
              title: task.title,
            });
          }
        });

        setTasks(formattedTasks);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const moveTask = async (task: Task, from: Status, to: Status) => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: to }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      setTasks((prev) => {
        const newTasks = { ...prev };
        newTasks[from] = newTasks[from].filter((t) => t.id !== task.id);
        newTasks[to] = [...newTasks[to], task];
        return newTasks;
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to move task");
      // Revert the optimistic update
      setTasks((prev) => ({ ...prev }));
    }
  };

  return (
    <div className="p-6 space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col md:flex-row gap-4">
        {(Object.keys(tasks) as Status[]).map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks[status]}
            moveTask={moveTask}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
}