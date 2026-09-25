"use client";

import { motion } from "framer-motion";

/** Every top-level page arrives with a slow fade from black. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.3, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
