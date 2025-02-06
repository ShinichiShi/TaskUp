import { NextRequest, NextResponse } from "next/server";
import { dbconnect } from "@/lib/db";
import { Task } from "@/models/task";
import { auth } from "@clerk/nextjs/server";
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { params } = context;  

  await dbconnect();
  const { userId } = await auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const task = await Task.findOneAndDelete({ _id: params.id, userId });

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  const { params } = context; 
  const { id } = params;

  await dbconnect();
  const { userId } = await auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const updates = await req.json();

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId }, 
      updates,
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
