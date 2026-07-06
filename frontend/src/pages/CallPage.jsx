import React, { useEffect, useRef, useState } from 'react'
import {
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useNavigate, useParams } from 'react-router-dom';
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../../lib/api';
import LoadingPage from '../components/LoadingPage';
import toast from 'react-hot-toast';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY


const CallPage = () => {
  console.log("Rendering CallPage");

  const { id: callId } = useParams()

  const [client, setClient] = useState(null)
  const [call, setCall] = useState(null)
  const [isConnecting, setIsConnecting] = useState(true)

  // Use a ref so cleanup always has access to the live client instance,
  // not a stale closure value.
  const clientRef = useRef(null)

  const { authenticatedUser, isLoading } = useAuthUser()

  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!authenticatedUser,
  })

  useEffect(() => {
    let cancelled = false

    const initCall = async () => {
      if (!tokenData?.token || !authenticatedUser?._id || !callId) return
      try {
        console.log('Initializing stream video client...')

        const user = {
          id: authenticatedUser._id,
          name: authenticatedUser.fullName,
          image: authenticatedUser.image,
        }

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        })

        clientRef.current = videoClient

        const callInstance = videoClient.call('default', callId)
        await callInstance.join({ create: true })

        console.log('joined call successfully')

        if (!cancelled) {
          setClient(videoClient)
          setCall(callInstance)
        }
      } catch (err) {
        console.error('Error initializing call:', err)
        toast.error('Failed to join the call. Please try again later.')
      } finally {
        if (!cancelled) setIsConnecting(false)
      }
    }

    initCall()

    return () => {
      cancelled = true
      // Disconnect the real client stored in the ref, not the stale closure
      clientRef.current?.disconnectUser().catch(console.error)
      clientRef.current = null
    }
  }, [tokenData?.token, authenticatedUser?._id, callId])

  if (isLoading || isConnecting) {
    return <LoadingPage />
  }
  return (
    <div className='h-screen flexCenter flex-col'>
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className='flex items-center justify-center h-full'>
            <p>Could not initialize the call. Please try again later.</p>
          </div>
        )}
      </div>
    </div>
  )
}

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/");
    }
  }, [callingState, navigate]);

  if (callingState !== CallingState.JOINED) {
    return <div>Joining call...</div>;
  }

  return (
    <StreamTheme>
      <SpeakerLayout participantsBarPosition="bottom" />
      <CallControls />
    </StreamTheme>
  );
};
export default CallPage
