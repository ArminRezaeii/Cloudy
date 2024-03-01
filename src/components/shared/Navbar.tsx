import { UserButton } from '@clerk/nextjs'
import React from 'react'

function Navbar() {
    return (
        <nav className='border-b py-4 bg-gray-50'>
            <div className=' items-center container mx-auto justify-between flex'>
<h1>Logo</h1>
                <UserButton />
            </div>
        </nav>
    )
}

export default Navbar