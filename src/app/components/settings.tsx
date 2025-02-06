import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { RingLoader } from "react-spinners";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UserData {
  name: string;
  email: string;
  phone: string;
  profilePic: string;
  clerkId: string;
}

export default function Settings() {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const [user, setUser] = useState<UserData>({
    name: "",
    email: "",
    phone: "",
    profilePic: "",
    clerkId: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const fetchUserData = useCallback(async (clerkId: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/user/${clerkId}`);
      
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setPreviewUrl(data.profilePic);
      } else if (res.status === 404) {
        const initialUserData = {
          name: `${clerkUser?.firstName || ''} ${clerkUser?.lastName || ''}`.trim(),
          email: clerkUser?.primaryEmailAddress?.emailAddress || "",
          phone: clerkUser?.primaryPhoneNumber?.phoneNumber || "",
          profilePic: "",
          clerkId: clerkUser?.id || "",
        };
        
        const createRes = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(initialUserData),
        });

        if (createRes.ok) {
          const newUser = await createRes.json();
          setUser(newUser);
          setPreviewUrl(newUser.profilePic);
          toast.success("Profile created successfully");
        } else {
          throw new Error('Failed to create user');
        }
      }
    } catch (error) {
      toast.error("Failed to setup profile"+error);
    } finally {
      setIsLoading(false);
    }
  }, [clerkUser?.firstName, clerkUser?.id, clerkUser?.lastName, 
      clerkUser?.primaryEmailAddress?.emailAddress, 
      clerkUser?.primaryPhoneNumber?.phoneNumber]);

  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      fetchUserData(clerkUser.id);
    }
  }, [isLoaded, isSignedIn, clerkUser, fetchUserData]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleChange = (field: keyof UserData, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      let updatedProfilePic = user.profilePic;
  
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
  
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
  
        if (!uploadResponse.ok) {
          throw new Error('Upload failed');
        }
  
        const result = await uploadResponse.json();
        updatedProfilePic = result.imageUrl;
      }
  
      const updatedUser = { ...user, profilePic: updatedProfilePic };
  
      const res = await fetch(`/api/user/${user.clerkId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
  
      if (res.ok) {
        const savedUser = await res.json();
        setUser(savedUser);
        setSelectedFile(null);
        toast.success("Changes saved successfully!");
      } else {
        const data = await res.json();
        throw new Error(data.message || "Failed to save changes");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save changes");
    }
  };
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">User Settings</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <RingLoader color="#0000ff" size={60} />
        </div>
      ) : (<div className="p-6 bg-gray-100 text-black max-w-6xl mx-auto rounded-xl flex flex-col md:flex-row justify-between">
          <div className="flex-shrink-0 text-center mb-4 md:mb-0">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src={previewUrl || "/default-avatar.png"}
                alt="Profile"
                fill
                className="rounded-full object-cover shadow-md"
              />
            </div>
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">Max file size: 5MB</p>
          </div>
  
          {/* User Details */}
          <div className="flex-grow md:ml-8">
            <div className="mb-4">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                value={user.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full p-2 border rounded-md mb-3"
              />
            </div>
  
            <div className="mb-4">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={user.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full p-2 border rounded-md mb-3"
              />
            </div>
  
            <div className="mb-4">
              <label className="block text-sm font-medium">Phone</label>
              <input
                type="tel"
                value={user.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full p-2 border rounded-md mb-3"
              />
            </div>
  
            <button
              onClick={handleSaveChanges}
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </>
  );
}