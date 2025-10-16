"use client"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Ellipsis } from "lucide-react"

export function ActionMenu({ detailLink, deleteLink }: { detailLink: string, deleteLink: string }) {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-white bg-white/20 rounded-full p-2 hover:bg-white/10 transition-all duration-300">
          <Ellipsis size={20} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32 bg-white text-black rounded-md border border-gray-700">
        <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer" onClick={() => router.push(detailLink)}>
          Details
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:!text-red-600 cursor-pointer text-red-600" onClick={() => router.push(deleteLink)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
