import { NextResponse } from "next/server";
import { dbconnect } from "@/lib/db";
import { Task } from "@/models/task";
import { auth } from "@clerk/nextjs/server";


export async function GET() {
  try {
    await dbconnect();
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }  
    const tasks = await Task.find({userId});
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error"+error }, { status: 500 },);
  }
}
export async function POST(req: Request) {
  try {
    await dbconnect();
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const { title, status, description, image } = await req.json();
    const newTask = await Task.create({ title, status, description, image, userId });

    newTask._id = newTask._id.toString();

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" + error }, { status: 500 });
  }
}