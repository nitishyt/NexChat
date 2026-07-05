export const formatNotificationTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  return `${weeks}w ago`
}

export const getNotificationMessage = (request, currentUserId) => {
  const isAccepted = request.status === 'accepted'
  const isOutgoing = currentUserId ? request.sender?._id === currentUserId : false
  const otherUser = isOutgoing ? request.recipient : request.sender

  if (isAccepted) {
    return isOutgoing
      ? `Accepted your friend request. You are now connected with ${otherUser?.fullName || 'this user'}.`
      : `You accepted ${otherUser?.fullName || 'this user'}'s friend request. You are now connected.`
  }

  return isOutgoing
    ? `Your friend request to ${otherUser?.fullName || 'this user'} is pending approval.`
    : `${otherUser?.fullName || 'This user'} sent you a friend request.`
}