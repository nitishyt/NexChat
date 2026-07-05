import React from 'react'
import { UserCheck, Clock } from 'lucide-react'
import { formatNotificationTimeAgo, getNotificationMessage } from '../utils/notificationUtils'

const NotificationCard = ({ request, currentUserId }) => {
  const isAccepted = request.status === 'accepted'
  const isOutgoing = currentUserId ? request.sender?._id === currentUserId : false
  const otherUser = isOutgoing ? request.recipient : request.sender
  const message = getNotificationMessage(request, currentUserId)

  return (
    <div className={`card bg-base-100 card-sm ${!isAccepted ? 'opacity-60' : ''}`}>
      <div className='card-body'>
        <div className='flex items-start gap-3'>
          <div className={`size-10 rounded-full flexCenter shrink-0 ${isAccepted ? 'bg-success/10' : 'bg-warning/10'}`}>
            {isAccepted ? (
              <UserCheck className='size-5 text-success' />
            ) : (
              <Clock className='size-5 text-warning' />
            )}
          </div>
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-1'>
              <img src={otherUser?.image} alt={otherUser?.fullName} className='size-8 rounded-full object-cover' />
              <h6 className='font-semibold'>{otherUser?.fullName}</h6>
            </div>
            <p className='para text-sm'>
              {message}
            </p>
            <p className='text-xs opacity-50 mt-2'>
              {formatNotificationTimeAgo(request.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationCard
