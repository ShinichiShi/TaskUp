"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

import Link from "next/link";

export default function Home() {
  useEffect(() => {
    const vantaEffect = NET({
      el: "#vanta-bg",
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0xd0d7e1,
      shininess: 53.0,
      waveHeight: 26.5,
      waveSpeed: 0.9,
      zoom: 0.74,
    });
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return (
    <div
      id="vanta-bg"
      className="min-h-screen w-full flex flex-col items-center justify-center"
    >
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <main className="container mx-auto px-6 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-3xl md:text-6xl font-bold tracking-tight">
            <TextGenerateEffect words={"Welcome To TaskUp "} />
          </h1>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5, type: "tween" }}
          className="text-center space-y-6"
        >
          <br />
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            TaskUp is a task management tool designed to help users organize and
            prioritize their daily tasks efficiently. It offers a user-friendly
            interface to track progress and collaborate on projects.
          </p>
        </motion.div>
        <div className="flex gap-4 justify-center mt-8">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.8 }}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 2 } }}
          >
            <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl={'/home'}>
            <Button variant="outline" size="lg">
            Sign In
          </Button>
              </SignInButton>
      </SignedOut>
      <SignedIn>
      <Link href="/home">
        <Button variant="outline" size="lg">
          Go to Dashboard 
        </Button>
      </Link>
      </SignedIn>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
