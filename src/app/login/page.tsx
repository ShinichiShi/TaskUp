'use client';

import { SignIn, SignUp, UserButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import React from 'react';

export default function Page() {
  const { isSignedIn } = useUser();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Welcome to the Task Manager</h2>
      {isSignedIn ? (
        <div className="text-center">
          <UserButton afterSignOutUrl="/" />
          <p className="mt-4">You are signed in!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <SignIn afterSignInUrl="/" mode="modal" />
          <SignUp afterSignUpUrl="/" mode="modal" />
        </div>
      )}
    </div>
  );
}
