import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import cloudinary from "@/lib/cloudinary";
import { dbconnect } from "@/lib/db";
import { Image } from "@/models/image";

export async function POST(req: Request) {
  try {
    await dbconnect();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the form data
    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert File to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Upload to Cloudinary
    const uploadResponse = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload(
        `data:${file.type};base64,${base64Image}`,
        {
          folder: 'imgs', // Optional: organize uploads
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    // Save image link to MongoDB
    const image = await Image.create({
      userId,
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      originalName: file.name,
    });

    return NextResponse.json({ 
      imageUrl: uploadResponse.secure_url,
      imageId: image._id 
    }, { status: 201 });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}