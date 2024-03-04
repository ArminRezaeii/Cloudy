import { OrganizationSwitcher, SignInButton, SignOutButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import React from 'react'
import { Button } from '../ui/button'

function Navbar() {
    return (
        <nav className='border-b py-4 bg-gray-50'>
            <div className=' items-center container mx-auto justify-between flex'>
                <h1>Logo</h1>
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