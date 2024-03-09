import { OrganizationSwitcher, SignInButton, SignOutButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import Link from 'next/link'

function Navbar() {
    return (
        <nav className='border-b py-4 bg-gray-50'>
            <div className=' items-center container mx-auto justify-between flex'>
                <Link href="/" className='flex gap-2 items-center text-xl'>
                    < Image className='rounded-[50%]' src="/CloudyLogo.jpg" width={50} height={50} alt='Logo' />Cloudy
                </Link>
                <Button variant={"outline"}>
                    <Link href="/dashbord/files">Your files</Link>
                </Button>
                <div className='flex gap-2'>
                    <OrganizationSwitcher />
                    <UserButton />
                    <SignedOut>
                        <SignInButton></SignInButton>
                    </SignedOut>
                </div>
            </div>
        </nav>
    )
}

export default Navbar