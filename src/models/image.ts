import mongoose, { Schema } from 'mongoose';

interface IImage {
  userId: string;
  url: string;
  publicId?: string;
  originalName?: string;
  createdAt?: Date;
}

const imageSchema = new Schema<IImage>({
  userId: { type: String, required: true },
  url: { type: String, required: true },
  publicId: { type: String },
  originalName: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Image = mongoose.models.Image || mongoose.model<IImage>('Image', imageSchema);