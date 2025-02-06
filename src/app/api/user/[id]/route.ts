// app/api/user/[clerkId]/route.ts
import { NextResponse } from "next/server";
import { dbconnect } from "@/lib/db";
import { User } from "@/models/user";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params:  Promise<{ clerkId: string }> }
) {
  try {
    await dbconnect();
    const { userId } = await auth();
    
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const {clerkId} = await params;
    const user = await User.findOne({ clerkId: clerkId });
    
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error: " + error },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ clerkId: string }> }
) {
  try {
    await dbconnect();
    const { userId } = await auth();
    
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const userData = await request.json()
    const {clerkId} = await params
    const user = await User.create({
      ...userData,
      clerkId: clerkId
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error: " + error },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ clerkId: string }> }
) {
  try {
    await dbconnect();
    const { userId } = await auth();
    const {clerkId} = await params
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const updates = await request.json();
    const user = await User.findOneAndUpdate(
      { clerkId: clerkId },
      { ...updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error: " + error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ clerkId: string }> }
) {
  try {
    await dbconnect();
    const { userId } = await auth();
    const {clerkId} =await params
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const user = await User.findOneAndDelete({ clerkId: clerkId });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error: " + error },
      { status: 500 }
    );
  }
}