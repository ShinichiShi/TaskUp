import { NextResponse } from "next/server";
import { dbconnect } from "@/lib/db";
import { User } from "@/models/user"; // Ensure this model exists

export async function POST(req: Request) {
  try {
    await dbconnect();
    const body = await req.json();
    let user = await User.findOne({ email: body.email });

    if (user) {
      user = await User.findOneAndUpdate({ email: body.email }, body, { new: true });
    } else {
      user = await User.create(body);
    }

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}