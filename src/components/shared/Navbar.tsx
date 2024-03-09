'use client'
import { OrganizationSwitcher, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import Link from 'next/link'
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { FileIcon, MenuIcon, StarIcon, TrashIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

function Navbar() {
    const pathname = usePathname()
    return (
        <nav className='border-b  py-4 bg-gray-50 '>


            <div className=' items-center z-10 relative container mx-auto justify-between flex flex-wrap'>
                <Link href="/" className='flex gap-2 items-center text-xl'>
                    < Image className='rounded-[50%]' src="/CloudyLogo.jpg" width={50} height={50} alt='Logo' />Cloudy
                </Link>
                <SignedIn>
                    <Button variant={"outline"}>
                        <Link href="/dashbord/files">Your files</Link>
                    </Button>
                </SignedIn>
                <div className='flex gap-2 items-center justify-center'>
                    <div className='flex max-lg:mt-8 justify-between gap-2 items-center'>
                        <OrganizationSwitcher />
                        <UserButton />
                        <Menubar className='hidden max-md:flex'>
                            <MenubarMenu>
                                <MenubarTrigger><MenuIcon />
                                </MenubarTrigger>
                                <MenubarContent>
                                    <MenubarItem>
                                        <Link href="/dashbord/files">
                                            <Button variant={"link"} className={clsx("flex gap-2", {
                                                "text-black": pathname.includes("/dashbord/files")
                                            })}>
                                                <FileIcon />All Files
                                            </Button>
                                        </Link>
                                    </MenubarItem>
                                    <MenubarSeparator />
                                    <MenubarItem>
                                        <Link href="/dashbord/favorites">
                                            <Button variant={"link"} className={clsx("flex gap-2", {
                                                "text-black": pathname.includes("/dashbord/favorite")
                                            })}>
                                                <StarIcon />Favorites
                                            </Button>
                                        </Link>
                                    </MenubarItem>
                                    <MenubarSeparator />
                                    <MenubarItem>   <Link href="/dashbord/trash">
                                        <Button variant={"link"} className={clsx("flex gap-2", {
                                            "text-black": pathname.includes("/dashbord/trash")
                                        })}>
                                            <TrashIcon />Trash
                                        </Button>
                                    </Link></MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>
                    </div>
                    <SignedOut>
                        <SignInButton>
                            <Button variant={"outline"}>
                                Sign In
                            </Button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </div>
        </nav>
    )
}

export default Navbar