import React, { useState } from "react";
import Image from "next/image";

export default function Settings() {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    profilePic: "https://via.placeholder.com/150",
  });

  const handleChange = (field: keyof typeof user, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">User Settings</h2>
      <div className="p-6 bg-gray-100 text-black max-w-6xl mx-auto flex justify-around">
        {/* Profile Section */}
        <div className="flex-shrink-0 text-center">
          <Image
            src={user.profilePic}
            alt="Profile"
            width={150}
            height={150}
            className="w-32 h-32 rounded-full mx-auto shadow-md"
          />
          <input
            type="text"
            value={user.profilePic}
            onChange={(e) => handleChange("profilePic", e.target.value)}
            placeholder="Enter profile image URL..."
            className="mt-2 w-full p-2 border rounded-md"
          />
        </div>

        {/* User Details */}
        <div className="flex-grow ml-8">
          <div className="mb-4">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full p-2 border rounded-md mb-3"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full p-2 border rounded-md mb-3"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="tel"
              value={user.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full p-2 border rounded-md mb-3"
            />
          </div>

          <button className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
