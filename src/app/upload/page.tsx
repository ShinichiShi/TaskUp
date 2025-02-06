"use client";

import { useState } from 'react';
import Image from 'next/image';

export default function ImageUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!preview) return;

    try {
      setUploading(true);
      
      // Convert data URL to File
      const response = await fetch(preview);
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: blob.type });

      // Create FormData
      const formData = new FormData();
      formData.append('image', file);

      // Upload to server
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const result = await uploadResponse.json();
      setUploadedImageUrl(result.imageUrl);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange}
        className="mb-4"
      />

      {preview && (
        <div className="mb-4">
          <h3>Preview:</h3>
          <Image 
            src={preview} 
            alt="Preview" 
            width={300} 
            height={300} 
            className="object-cover"
          />
        </div>
      )}

      {preview && !uploading && (
        <button 
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload Image
        </button>
      )}

      {uploading && <p>Uploading...</p>}

      {uploadedImageUrl && (
        <div className="mt-4">
          <h3>Uploaded Image:</h3>
          <Image 
            src={uploadedImageUrl} 
            alt="Uploaded" 
            width={300} 
            height={300} 
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}