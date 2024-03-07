import FileData from '@/components/shared/FileData'
import React from 'react'

function Trash() {
  return (
    <div>
      <FileData title="Your Files" deletedOnly />
    </div>
  )
}

export default Trash