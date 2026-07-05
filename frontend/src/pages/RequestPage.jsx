import React from 'react'
import { acceptFriendRequest, getfriendsRequests } from '../../lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import UserCard from '../components/UserCard'
import { UserCheckIcon } from 'lucide-react'

const RequestPage = () => {

  const queryClient = useQueryClient()

  const { data: friendRequests = {}, isLoading } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: getfriendsRequests,
    refetchInterval: 10000
  })

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] })
      queryClient.invalidateQueries({ queryKey: ['friends'] })
    }
  })

   const incomingRequests = friendRequests?.incomingRequests || []
  return (
    <div className='p-4 space-y-6'>
      <h2 className='flex items-center gap-2 text-xl font-bold'>
        <UserCheckIcon className='text-primary' />
        Connection Requests
        {incomingRequests.length > 0 && (
          <span className='badge badge-primary badge-sm'>{incomingRequests.length}</span>
        )}
      </h2>

      {isLoading ? (
        <div className='flex justify-center py-12'>
          <span className='loading loading-spinner loading-lg' />
        </div>
      ) : incomingRequests.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {incomingRequests.map((request) => (
            <UserCard
              key={request._id}
              user={request.sender}
              onAccept={() => acceptRequestMutation(request._id)}
              isPendingAccept={isPending}
            />
          ))}
        </div>
      ) : (
        <p className='text-center text-base-content/60 py-12'>No pending connection requests</p>
      )}
    </div>
  )
}

export default RequestPage