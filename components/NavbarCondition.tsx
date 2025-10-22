// components/ConditionalNavbar.tsx
"use client"

import { usePathname } from "next/navigation"
import Navbar from "./NavbarComponent/Navbar"

export default function ConditionalNavbar() {
  const pathname = usePathname()

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/brand/post-a-job")) {
    return null
  }

  return <Navbar />
}
