import { NextRequest, NextResponse } from "next/server";
import { dbconnect } from "@/lib/db";
import { Task } from "@/models/task";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params; 
  await dbconnect();
  try {
    const task = await Task.findByIdAndDelete(id);
    
    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await dbconnect();
  
  const { id } = await params;
  const updates = await req.json(); 

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, updates, { 
      new: true, 
      runValidators: true, 
    });

    if (!updatedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
