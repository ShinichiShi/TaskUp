import { NextResponse } from "next/server";
import { dbconnect } from "@/lib/db";
import { Task } from "@/models/task";

export async function GET() {
  try {
    await dbconnect();
    const tasks = await Task.find({});
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error"+error }, { status: 500 },);
  }
}

export async function POST(req: Request) {
  try {
    await dbconnect();
    const body = await req.json();
    const newTask = await Task.create(body);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error"+error }, { status: 500 });
  }
}
