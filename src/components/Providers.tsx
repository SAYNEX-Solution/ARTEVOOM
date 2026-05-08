"use client";

import { SessionProvider } from "next-auth/react";
import Cart from "./Cart/Cart";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Cart />
    </SessionProvider>
  );
}
