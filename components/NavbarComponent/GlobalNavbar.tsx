"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import SignInForm from "./SigninForm"
import { useSignInForm } from "@/hooks/use-signin-form"

const GloablNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isOpen: signInOpen, openSignIn, closeSignIn } = useSignInForm()
  const pathname = usePathname()

  const toggleMenu = () => {
    closeSignIn() // Close sign in form if open
    setMenuOpen((prev) => !prev)
  }

  const closeMenu = () => setMenuOpen(false)

  // Close menu when clicking escape key and handle body scroll
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (menuOpen) closeMenu()
        if (signInOpen) closeSignIn()
      }
    }

    // Lock body scroll when menu is open
    if (menuOpen || signInOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    window.addEventListener("keydown", handleEscKey)
    return () => {
      window.removeEventListener("keydown", handleEscKey)
      document.body.style.overflow = ""
    }
  }, [menuOpen, signInOpen, closeSignIn])

  const NavMenuItem = ({
    href,
    children,
    onClick,
  }: { href: string; children: React.ReactNode; onClick?: () => void }) => {
    const isActive = pathname === href

    const handleClick = (e: React.MouseEvent) => {
      if (onClick) {
        e.preventDefault()
        onClick()
      }
      closeMenu()
    }

    return (
      <Link
        href={href}
        onClick={handleClick}
        className={cn(
          "text-[28px] md:text-[36px] font-medium relative group transition-all duration-200",
          isActive ? "text-[#00e0ca]" : "text-white hover:text-[#00e0ca]",
        )}
      >
        <span className="relative">
          {children}
          <span
            className={cn(
              "absolute -bottom-1 left-0 w-0 h-[2px] bg-[#00e0ca] transition-all duration-300 group-hover:w-full",
              isActive && "w-full",
            )}
          ></span>
        </span>
      </Link>
    )
  }

  const NavSocial = () => (
    <div className="flex flex-col gap-3 max-md:mt-6">
      <p className="mb-2 text-sm">Social Media</p>
      <div className="flex gap-6">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-[#00e0ca] transition-colors duration-200 flex items-center gap-1"
        >
          <span className="text-sm underline">Instagram</span>
        </a>

        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-[#00e0ca] transition-colors duration-200 flex items-center gap-1"
        >
          <span className="text-sm underline">Facebook</span>
        </a>
      </div>
    </div>
  )

  return (
    <>
      <div className="md:mx-3 mx-0">
        <nav className="max-w-7xl md:mx-auto max-md:mx-3 flex items-center justify-between p-4 bg-background/10 backdrop-blur-md rounded-3xl max-md:rounded-2xl mt-4 z-40 relative">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-foreground flex items-center gap-2">
              <Image src="/logo.svg" alt="Epiclinx" width={24} height={24} className="w-6 h-6" />
              <span className="sm:inline text-white">Epiclinx</span>
            </Link>
          </div>

          <div className="flex items-center gap-10">
            <Button
              variant="default"
              className="hidden md:flex rounded-full bg-[#00e0ca] hover:bg-[#00c4b1] text-black px-6 py-2 transition-all"
              onClick={() => {
                closeMenu()
                openSignIn()
              }}
            >
              Sign in
            </Button>

            <Menu onClick={toggleMenu} className="h-6 w-6 cursor-pointer text-white" />
          </div>
        </nav>
      </div>

      {/* Backdrop overlay for menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Side drawer menu */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full bg-[#3c3c3c] text-white flex flex-col p-6 transition-transform duration-300 ease-in-out",
          "overflow-y-auto w-full md:w-1/2",
          menuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Menu header */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-gray-400"></span>
          <X onClick={closeMenu} className="h-6 w-6 cursor-pointer" />
        </div>

        {/* Menu content */}
        <div className="flex flex-col justify-between h-full">
          {/* Nav links */}
          <div className="flex flex-col gap-8 mt-16 px-4">
            <span className="text-sm text-gray-400">Menu</span>
            <NavMenuItem href="#" onClick={openSignIn}>
              Sign In
            </NavMenuItem>
            <NavMenuItem href="/">Home</NavMenuItem>
            <NavMenuItem href="/brand">I'm Brand</NavMenuItem>
            <NavMenuItem href="/creator">I'm Creator</NavMenuItem>
            <NavMenuItem href="#">Messages</NavMenuItem>
          </div>

          {/* Contact section */}
          <div className="mt-auto mb-8 flex flex-col md:flex-row justify-between gap-6 px-4">
            <div className="flex flex-col gap-3">
              <p className="mb-2 text-sm">Get in Touch</p>
              <a href="mailto:help@epiclinx.com" className="text-[#00e0ca] underline transition-all">
                help@epiclinx.com
              </a>
            </div>

            <NavSocial />
          </div>
        </div>
      </div>

      {/* Sign In Form */}
      <SignInForm isOpen={signInOpen} onClose={closeSignIn} />
    </>
  )
}

export default GloablNavbar
