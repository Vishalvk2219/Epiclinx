"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { useSignInForm } from "@/hooks/use-signin-form"

interface LinkMeButtonProps {
  className?: string
  children?: React.ReactNode
}

export const LinkMeButton: React.FC<LinkMeButtonProps> = ({ className, children = "Link me" }) => {
  const { openSignIn } = useSignInForm()

  return (
    <Button variant="default" className={className} onClick={openSignIn}>
      {children}
    </Button>
  )
}
