import { VideoIcon } from 'lucide-react'
import React from 'react'

const CallButton = ({handleVideoCall}) => {
  return (
    <button onClick={handleVideoCall} className='btn btn-success btn-sm text-white'>
      <VideoIcon className='size-5' /> Video
    </button>
  )
}

export default CallButton
