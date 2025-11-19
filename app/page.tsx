"use client";

import { motion } from "framer-motion";
import Scene from "@/app/components/Scene";

export default function HomePage() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0"
      >
        <Scene />
      </motion.div>
    </main>
  );
}
