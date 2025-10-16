"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { useSignInForm } from "@/hooks/use-signin-form"

interface SignInButtonProps {
  className?: string
  children?: React.ReactNode
}

export const SignInButton: React.FC<SignInButtonProps> = ({ className, children = "Sign in" }) => {
  const { openSignIn } = useSignInForm()

  return (
    <Button variant="default" className={className} onClick={openSignIn}>
      {children}
    </Button>
  )
}
