"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function Navbar() {
  const router = useRouter();

  return (
    <div className="bg-white h-10 w-full my-2 flex justify-around p-4 rounded-2xl text-stone-800">
      <div className="flex justify-center items-center">tasks</div>
      <div className="flex w-40 items-center">
        <button onClick={() => router.push("/login")} className="px-4 py-2 bg-blue-500 text-white rounded-md">
          Login
        </button>
      </div>
    </div>
  );
}
