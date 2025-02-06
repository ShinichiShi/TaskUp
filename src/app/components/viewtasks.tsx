import React, { useState, useCallback, useEffect } from "react";
import { MdDelete, MdSave } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
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
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<NewTask>({
    title: "",
    status: "Backlog",
    description: "",
    image: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [previewUrl, setPreviewUrl] = useState<string>("");

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

  const saveTaskChanges = async () => {
    if (!editedTask) return;

    try {
      const response = await fetch(`/api/tasks/${editedTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedTask),
      });

      if (!response.ok) throw new Error("Failed to update task");

      setTasks((prev) =>
        prev.map((task) => 
          task._id === editedTask._id ? editedTask : task
        )
      );
      setSelectedTask(editedTask);
      setEditedTask(null);
    } catch (error) {
      console.error("Error saving task changes:", error);
    }
  };
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      // const fileUrl = URL.createObjectURL(file);
      // setPreviewUrl(fileUrl);
    }
  };

  const addTask = async () => {
    try {
      let uploadedImageUrl = newTask.image;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Upload failed");
        }

        const result = await uploadResponse.json();
        uploadedImageUrl = result.imageUrl;
      }

      const taskToSubmit = {
        ...newTask,
        image: uploadedImageUrl,
      };

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskToSubmit),
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
      setSelectedFile(null);
      // setPreviewUrl("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    await fetchTasks(); 
    setSelectedTask(null);
  }; 
  const updateTaskImage = async (file: File) => {
    if (!selectedTask) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      const result = await uploadResponse.json();
      const updatedTask = { ...selectedTask, image: result.imageUrl };

      await fetch(`/api/tasks/${selectedTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      setSelectedTask(updatedTask);
      setTasks((prev) =>
        prev.map((task) => (task._id === selectedTask._id ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error updating task image:", error);
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
                  selectedTask?._id === task._id
                    ? "border-2 border-blue-500"
                    : ""
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Task Details</h2>
                {editedTask && (
                  <Button 
                    onClick={saveTaskChanges}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white flex items-center"
                  >
                    <MdSave className="mr-2" /> Save Changes
                  </Button>
                )}
              </div>

              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                value={editedTask?.title || selectedTask?.title || ""}
                onChange={(e) => {
                  const updatedTask = {
                    ...(editedTask || selectedTask),
                    title: e.target.value
                  };
                  setEditedTask(updatedTask as Task);
                }}
                className="w-full p-2 border rounded-md mb-3"
              />

              <label className="block text-sm font-medium">Status</label>
              <select
                value={editedTask?.status || selectedTask?.status || ""}
                onChange={(e) => {
                  const updatedTask = {
                    ...(editedTask || selectedTask),
                    status: e.target.value as Task['status']
                  };
                  setEditedTask(updatedTask as Task);
                }}
                className="w-full p-2 border rounded-md mb-3"
              >
                <option value="Backlog">Backlog</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>

              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={editedTask?.description || selectedTask?.description || ""}
                onChange={(e) => {
                  const updatedTask = {
                    ...(editedTask || selectedTask),
                    description: e.target.value
                  };
                  setEditedTask(updatedTask as Task);
                }}
                className="w-full p-2 border rounded-md mb-3"
                rows={4}
              />

              <label className="block text-sm font-medium">Task Isdsd   mage</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) updateTaskImage(file);
                }}
                className="w-full p-2 border rounded-md mb-3"
              />
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
              <label className="text-sm font-medium">Task Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
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
            <Button
              onClick={addTask}
              className="bg-green-500 hover:bg-green-600"
            >
              Save Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
