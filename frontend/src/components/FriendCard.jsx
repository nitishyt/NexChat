import React from 'react'
import { MapPinIcon, MessageCircle, Video } from 'lucide-react'
import { getCountryFlag } from '../constraints'
import { useNavigate } from 'react-router-dom'

const FriendCard = ({ friend }) => {
  const navigate = useNavigate()


  return (
    <div className='card bg-base-100 card-sm'>
      <div className='card-body'>
        <div className='flex items-start gap-4'>
          <img src={friend.image} alt={friend.fullName} className='size-16 rounded-full object-cover shrink-0' />
          <div className='flex-1'>
            <h5 className='mb-1'>{friend.fullName}</h5>
            {friend.location && (
              <p className='para flex items-center gap-1 mb-2'>
                <MapPinIcon height={14} width={14} />{friend.location}
              </p>
            )}
            <div className='flex flex-wrap gap-2 mb-3'>
              {friend.language && (
                <span className='badge badge-soft badge-secondary text-xs'>
                  <img src={getCountryFlag(friend.language)} alt={friend.language} className='w-4 h-3 object-cover rounded-sm' />
                  {friend.language}
                </span>
              )}
              {friend.skill && (
                <span className='badge badge-soft badge-secondary text-xs'>
                  {friend.skill}
                </span>
              )}
            </div>
            <div className='flex gap-2 flex-wrap'>
              <button type='button' onClick={() => navigate(`/chat/${friend._id}`)} className='btn btn-info btn-sm btn-soft'>
                <MessageCircle height={16} width={16} /> Chat
              </button>
              <button type='button' onClick={() => navigate(`/call/${friend._id}`)} className='btn btn-success btn-sm btn-soft'>
                <Video height={16} width={16} /> Call
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FriendCard
