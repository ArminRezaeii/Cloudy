'use client'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { FileIcon, StarIcon, TrashIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

function Sidebar() {
  const pathname = usePathname()
  return (
    <div className="w-40 max-md:hidden flex flex-col gap-4 ">
      <Link href="/dashbord/files">
        <Button variant={"link"} className={clsx("flex gap-2", {
          "text-black": pathname.includes("/dashbord/files")
        })}>
          <FileIcon />All Files
        </Button>
      </Link>
      <Link href="/dashbord/favorites">
        <Button variant={"link"} className={clsx("flex gap-2", {
          "text-black": pathname.includes("/dashbord/favorite")
        })}>
          <StarIcon />Favorites
        </Button>
      </Link>
      <Link href="/dashbord/trash">
        <Button variant={"link"} className={clsx("flex gap-2", {
          "text-black": pathname.includes("/dashbord/trash")
        })}>
          <TrashIcon />Trash
        </Button>
      </Link>
    </div>
  )
}

export default Sidebar