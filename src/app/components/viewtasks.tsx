import React, { useState, useCallback, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Task {
  _id: string;
  title: string;
  status: "Backlog" | "Ongoing" | "Completed";
  description: string;
  image?: string;
}

interface NewTask {
  title: string;
  status: "Backlog" | "Ongoing" | "Completed";
  description: string;
  image?: string;
}

export default function ViewTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<NewTask>({
    title: "",
    status: "Backlog",
    description: "",
    image: "",
  });

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
  
      const data = await res.json();
  
      if (!Array.isArray(data)) throw new Error("Invalid response format");
      const tasksWithStringId = data.map((task: Task) => ({
        ...task,
        _id: task._id.toString(), 
      }));
  
      setTasks(tasksWithStringId);
      if (tasksWithStringId.length > 0 && !selectedTask) {
        setSelectedTask(tasksWithStringId[0]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    }
  }, [selectedTask]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); 

  const addTask = async () => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) throw new Error("Failed to add task");
      await fetchTasks();
      setIsAddModalOpen(false);
      setNewTask({
        title: "",
        status: "Backlog",
        description: "",
        image: "",
      });

    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    await fetchTasks(); 
    setSelectedTask(null);
  };

  const updateTaskDetails = async (field: keyof Task, value: string) => {
    if (!selectedTask) return;

    const updatedTask = { ...selectedTask, [field]: value };
    setSelectedTask(updatedTask);
    setTasks((prev) =>
      prev.map((task) =>
        task._id === selectedTask._id ? updatedTask : task
      )
    );

    try {
      await fetch(`/api/tasks/${selectedTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="flex p-6 bg-gray-100 h-full text-black gap-6">
      <div className="w-1/3">
        <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>
        <div className="flex gap-2 mb-4">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white"
          >
            <IoMdAdd />
          </Button>
        </div>

        <ul className="space-y-2">
          {tasks?.length > 0 ? (
            tasks.map((task) => (
              <li
                key={task._id}
                className={`flex justify-between bg-white p-3 rounded-md shadow-md cursor-pointer hover:bg-gray-200 ${
                  selectedTask?._id === task._id ? "border-2 border-blue-500" : ""
                }`}
                onClick={() => setSelectedTask(task)}
              >
                <span>{task.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task._id);
                  }}
                  className="px-2 py-1 text-red-500 hover:bg-red-300 rounded-full"
                >
                  <MdDelete />
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No tasks available.</p>
          )}
        </ul>
      </div>

      {(selectedTask || tasks.length === 0) && (
        <div className="flex-grow p-4 bg-white rounded-md shadow-md">
          {tasks.length === 0 ? (
            <div className="text-center text-gray-500">
              <h2 className="text-xl font-semibold mb-4">No Tasks</h2>
              <p>Click the + button to add your first task</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Task Details</h2>

              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                value={selectedTask?.title || ""}
                onChange={(e) => updateTaskDetails("title", e.target.value)}
                className="w-full p-2 border rounded-md mb-3"
              />

              <label className="block text-sm font-medium">Status</label>
              <select
                value={selectedTask?.status || ""}
                onChange={(e) => updateTaskDetails("status", e.target.value)}
                className="w-full p-2 border rounded-md mb-3"
              >
                <option value="Backlog">Backlog</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>

              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={selectedTask?.description || ""}
                onChange={(e) => updateTaskDetails("description", e.target.value)}
                className="w-full p-2 border rounded-md mb-3"
                rows={4}
              />

              <label className="block text-sm font-medium">Task Image</label>
              <input
                type="text"
                value={selectedTask?.image || ""}
                onChange={(e) => updateTaskDetails("image", e.target.value)}
                placeholder="Paste image URL here..."
                className="w-full p-2 border rounded-md mb-3"
              />

              {selectedTask?.image && (
                <Image
                  src={selectedTask.image}
                  alt="Task"
                  height={24}
                  width={24}
                  className="w-full rounded-md"
                />
              )}
            </>
          )}
        </div>
      )}

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                value={newTask.status}
                onChange={(e) =>
                  setNewTask((prev) => ({
                    ...prev,
                    status: e.target.value as Task["status"],
                  }))
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="Backlog">Backlog</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) =>
                  setNewTask((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded-md"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Task Image URL</label>
              <input
                type="text"
                value={newTask.image}
                onChange={(e) =>
                  setNewTask((prev) => ({ ...prev, image: e.target.value }))
                }
                placeholder="Paste image URL here..."
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button onClick={addTask} className="bg-green-500 hover:bg-green-600">
              Save Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}