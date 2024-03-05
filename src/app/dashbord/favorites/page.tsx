'use client'
import FileData from '@/components/shared/FileData'
import { useQuery } from 'convex/react'
import React from 'react'
import { api } from '../../../../convex/_generated/api'

function Favorite() {
  return (
    <div> 
     <FileData title="Favorites" favorite/>
    </div>
  )
}

export default Favorite