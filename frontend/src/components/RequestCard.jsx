import React from 'react'
import { Check, MapPinIcon } from 'lucide-react'
import { getCountryFlag } from '../constraints'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { acceptFriendRequest } from '../../lib/api'
import toast from 'react-hot-toast'

const RequestCard = ({ request }) => {
  const queryClient = useQueryClient()
  const user = request.sender

  const { mutate: acceptRequest, isPending: isAccepting } = useMutation({
    mutationFn: () => acceptFriendRequest(request._id),
    onSuccess: () => {
      toast.success(`Accepted request from ${user.fullName}`)
      queryClient.invalidateQueries({ queryKey: ['friendsRequests'] })
      queryClient.invalidateQueries({ queryKey: ['friends'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to accept request')
    }
  })

  return (
    <div className='card bg-base-100 card-sm'>
      <div className='card-body'>
        <div className='flex items-start gap-4'>
          <img src={user.image} alt={user.fullName} className='size-16 rounded-full object-cover shrink-0' />
          <div className='flex-1'>
            <h5 className='mb-1'>{user.fullName}</h5>
            {user.location && (
              <p className='para flex items-center gap-1 mb-2'>
                <MapPinIcon height={14} width={14} />{user.location}
              </p>
            )}
            <p className='para mb-3'>{user.bio}</p>
            <div className='flex flex-wrap gap-2 mb-3'>
              <span className='badge badge-soft badge-secondary text-xs'>
                <img src={getCountryFlag(user.language)} alt={user.language} className='w-4 h-3 object-cover rounded-sm' />
                {user.language}
              </span>
              <span className='badge badge-soft badge-secondary text-xs'>
                {user.skill}
              </span>
            </div>
            <div className='flex gap-2'>
              <button
                onClick={() => acceptRequest()}
                disabled={isAccepting}
                className='btn btn-success btn-sm'
              >
                {isAccepting ? (
                  <span className='loading loading-spinner loading-xs' />
                ) : (
                  <><Check height={16} width={16} /> Accept</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestCard
