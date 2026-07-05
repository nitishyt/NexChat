import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendFriendRequest, acceptFriendRequest } from '../../lib/api'
import toast from 'react-hot-toast'

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outgoingRequests'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send request')
    }
  })
}

export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendsRequests'] })
      queryClient.invalidateQueries({ queryKey: ['friends'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to accept request')
    }
  })
}
