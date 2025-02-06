import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

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

  const fetchUserData = useCallback(
    async (clerkId: string) => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/user/${clerkId}`);

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else if (res.status === 404) {
          const initialUserData = {
            name: `${clerkUser?.firstName || ""} ${
              clerkUser?.lastName || ""
            }`.trim(),
            email: clerkUser?.primaryEmailAddress?.emailAddress || "",
            phone: clerkUser?.primaryPhoneNumber?.phoneNumber || "",
            profilePic: clerkUser?.imageUrl || "",
            clerkId: clerkUser?.id || "",
          };

          const createRes = await fetch("/api/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(initialUserData),
          });

          if (createRes.ok) {
            const newUser = await createRes.json();
            setUser(newUser);
          } else {
            throw new Error("Failed to create user");
          }
        }
      } catch (error) {
        console.error("Error fetching/creating user data:", error);
        alert("An error occurred while setting up your profile.");
      } finally {
        setIsLoading(false);
      }
    },
    [
      clerkUser?.firstName,
      clerkUser?.id,
      clerkUser?.imageUrl,
      clerkUser?.lastName,
      clerkUser?.primaryEmailAddress?.emailAddress,
      clerkUser?.primaryPhoneNumber?.phoneNumber,
    ]
  );
  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      fetchUserData(clerkUser.id);
    }
  }, [isLoaded, isSignedIn, clerkUser, fetchUserData]);

  const handleChange = (field: keyof UserData, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const res = await fetch(`/api/user/${user.clerkId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        alert("Changes saved successfully!");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to save changes");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("An error occurred while saving changes.");
    }
  };

  if (!isLoaded || !isSignedIn || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">User Settings</h2>
      <div className="p-6 bg-gray-100 text-black max-w-6xl mx-auto flex justify-around">
        <div className="flex-shrink-0 text-center">
          <Image
            src={
              user.profilePic ||
              "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1738829048~exp=1738832648~hmac=758c25f3b8fb17a0b74e149a7d9110c66173f510b3b57ba280dcd8b234799113&w=826"
            }
            alt="Profile"
            width={150}
            height={150}
            className="w-32 h-32 rounded-full mx-auto shadow-md"
          />
          <input
            type="text"
            value={user.profilePic || ""}
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
    </>
  );
}
