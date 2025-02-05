import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import Image from "next/image";
interface Task {
  title: string;
  status: "Backlog" | "In Progress" | "Completed";
  description: string;
  image?: string;
}

export default function ViewTasks() {
  const [tasks, setTasks] = useState<Task[]>([
    { title: "Task 1", status: "Backlog", description: "This is task 1", image: "" },
    { title: "Task 2", status: "In Progress", description: "This is task 2", image: "" },
    { title: "Task 3", status: "Completed", description: "This is task 3", image: "" }
  ]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(tasks[0]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks((prev) => [
        ...prev,
        { title: newTask, status: "Backlog", description: "New task description", image: "" }
      ]);
      setNewTask("");
    }
  };

  const deleteTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
    setSelectedTask(null);
  };

  const viewTask = (task: Task) => {
    setSelectedTask(task);
  };

  const updateTaskDetails = (field: keyof Task, value: string) => {
    if (!selectedTask) return;
    setSelectedTask({ ...selectedTask, [field]: value });
    setTasks((prev) =>
      prev.map((task) => (task.title === selectedTask.title ? { ...task, [field]: value } : task))
    );
  };

  return (
    <div className="flex p-6 bg-gray-100 h-full text-black gap-6">
      <div className="w-1/3">
        <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add new task title..."
            className="p-2 border rounded-md w-full"
          />
          <button onClick={addTask} className="px-4 py-2 bg-green-500 text-white rounded-md">
            <IoMdAdd />
          </button>
        </div>

        <ul className="space-y-2">
          {tasks.map((task, index) => (
            <li
              key={index}
              className="flex justify-between bg-white p-3 rounded-md shadow-md cursor-pointer hover:bg-gray-200"
              onClick={() => viewTask(task)}
            >
              <span>{task.title}</span>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(index);
                  }}
                  className="px-2 py-1 text-red-500 hover:bg-red-300 rounded-full"
                >
                  <MdDelete />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedTask && (
        <div className="flex-grow p-4 bg-white rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">Task Details</h2>

          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={selectedTask.title}
            onChange={(e) => updateTaskDetails("title", e.target.value)}
            className="w-full p-2 border rounded-md mb-3"
          />

          <label className="block text-sm font-medium">Status</label>
          <select
            value={selectedTask.status}
            onChange={(e) => updateTaskDetails("status", e.target.value)}
            className="w-full p-2 border rounded-md mb-3"
          >
            <option value="Backlog">Backlog</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={selectedTask.description}
            onChange={(e) => updateTaskDetails("description", e.target.value)}
            className="w-full p-2 border rounded-md mb-3"
            rows={4}
          />

          <label className="block text-sm font-medium">Task Image</label>
          <input
            type="text"
            value={selectedTask.image}
            onChange={(e) => updateTaskDetails("image", e.target.value)}
            placeholder="Paste image URL here..."
            className="w-full p-2 border rounded-md mb-3"
          />

          {selectedTask.image && (
            <Image src={selectedTask.image} alt="Task" className="w-full rounded-md" />
          )}

        </div>
      )}
    </div>
  );
}
