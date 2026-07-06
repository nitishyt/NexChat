import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { getStreamToken } from '../../lib/api'
import { useQuery } from '@tanstack/react-query'
import useAuthUser from '../hooks/useAuthUser'
import toast from 'react-hot-toast'
import {
  Chat,
  Channel,
  MessageComposer,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import CallButton from '../components/CallButton'
import LoadingPage from '../components/LoadingPage'
import { StreamChat } from 'stream-chat'


const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

const ChatPage = () => {
  const navigate = useNavigate();
  const { id: targetUserId } = useParams()
  const { authenticatedUser } = useAuthUser()

  const [chatClient, setChatClient] = useState(null)
  const [channel, setChannel] = useState(null)
  const [loading, setLoading] = useState(true)

  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!authenticatedUser,
  })

  useEffect(() => {
    let ignore = false
    let createdChannel = null

    const initChat = async () => {
      if (!tokenData || !authenticatedUser?._id) return
      try {
        const client = StreamChat.getInstance(STREAM_API_KEY)

        // Only connect if not already connected as this user
        if (client.userID !== authenticatedUser._id) {
          await client.connectUser(
            {
              id: authenticatedUser._id,
              name: authenticatedUser.fullName,
              image: authenticatedUser.image,
            },
            tokenData.token
          )
        }

        const channelId = [authenticatedUser._id, targetUserId].sort().join('-')
        const currChannel = client.channel('messaging', channelId, {
          members: [authenticatedUser._id, targetUserId],
        })

        await currChannel.watch()
        currChannel.on('message.new', (event) => {
          console.log('RAW message.new event received:', event)
        })
        client.on('connection.changed', (event) => {
          console.log('WS connection changed, online:', event.online)
        })
        createdChannel = currChannel

        if (!ignore) {
          setChatClient(client)
          setChannel(currChannel)
        }
      } catch (error) {
        console.error('Error initializing chat client:', error)
        toast.error('Failed to initialize chat. Please try again later.')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    initChat()

    return () => {
      ignore = true
      createdChannel?.stopWatching()
    }
  }, [tokenData, authenticatedUser?._id, targetUserId])

  const handleVideoCall = async () => {
  if (!channel) return;

  const callId = channel.id;

  const callLink = `${window.location.origin}/call/${callId}`;

  await channel.sendMessage({
    text: `📞 Join my video call:\n${callLink}`,
  });

  navigate(`/call/${callId}`);
};

  const otherMember = Object.values(channel?.state?.members ?? {}).find(
    (member) => member?.user?.id && member.user.id !== authenticatedUser?._id,
  )?.user
  const memberName = otherMember?.fullName || otherMember?.name || 'Chat'
  const memberImage = otherMember?.image || 'https://ui-avatars.com/api/?name=Chat'
  const memberCount = channel?.data?.member_count ?? Object.keys(channel?.state?.members ?? {}).length
  const onlineCount = channel?.state?.watcher_count ?? 0
  const statusText = `${memberCount} members, ${onlineCount} online`

  if (loading || !chatClient || !channel) {
    return <LoadingPage />
  }

  return (
    <Chat client={chatClient}>
      <Channel channel={channel}>
        <Window>
          <div className='flex items-center justify-between gap-3 border-b border-base-300 bg-base-100 px-4 py-2 text-base-content'>
            <div className='flex min-w-0 items-center gap-3'>
              <div className='avatar shrink-0'>
                <div className='w-10 rounded-full'>
                  <img src={memberImage} alt={memberName} />
                </div>
              </div>
              <div className='min-w-0 text-left leading-tight'>
                <h5 className='truncate text-sm font-semibold text-base-content'>{memberName}</h5>
                <p className='truncate text-xs text-base-content/60'>{statusText}</p>
              </div>
            </div>
            <div className='flex-none'>
              <CallButton handleVideoCall={handleVideoCall} />
            </div>
          </div>
          <MessageList />
          <MessageComposer />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  )
}

export default ChatPage
