'use server';
import connectDB from '@/lib/db';
// import Task from '@/models/Task';

// Create Task
export const createTask = async (formData) => {
  try {
    await connectDB();
    const task = new Task({
      title: formData.get('title'),
      description: formData.get('description'),
      dueDate: formData.get('dueDate'),
    });
    await task.save();
    return { success: true, message: 'Task created successfully' };
  } catch (e) {
    return { success: false, message: 'Failed to create task'+e };
  }
};

// Read Tasks
export const getTasks = async () => {
  try {
    await connectDB();
    const tasks = await Task.find().sort({ dueDate: 1 });
    return tasks;
  } catch (e) {
    return [e];
  }
};

// Update Task
export const updateTask = async (id, formData) => {
  try {
    await connectDB();
    await Task.findByIdAndUpdate(id, {
      title: formData.get('title'),
      description: formData.get('description'),
      dueDate: formData.get('dueDate'),
      isCompleted: formData.get('isCompleted') === 'on',
    });
    return { success: true, message: 'Task updated successfully' };
  } catch (e) {
    return { success: false, message: 'Failed to update task'+e };
  }
};

// Delete Task
export const deleteTask = async (id) => {
  try {
    await connectDB();
    await Task.findByIdAndDelete(id);
    return { success: true, message: 'Task deleted successfully' };
  } catch (e) {
    return { success: false, message: 'Failed to delete task'+e };
  }
};