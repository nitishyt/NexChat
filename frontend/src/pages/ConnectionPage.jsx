import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { getUserFriends } from '../../lib/api'
import NoFriendsFound from '../components/NoFriendsFound'
import UserCard from '../components/UserCard'

const ConnectionPage = () => {

  const {data:friends = [],isLoading:loadingFriends} =useQuery({
    queryKey:['friends'],
    queryFn: getUserFriends
  })

  return (
    <div><section>
        <div className='mb-6'>
          <h3>Learning Friends</h3>
          <p className='para'>Connect with your learning peers and collaborate on projects.</p>
        </div>
        <div className='bg-base-100 border border-base-300 rounded-xl p-4'>
        {loadingFriends ? (
          <div className='flexCenter py-12'>
            <span className='loading loading-spinner loading-lg'/>
          </div>
        ) : friends.length === 0 ?(
          <NoFriendsFound/>
        ):(
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {friends.map((user)=>(
              <UserCard key={user._id} user={user} isConnected />
            ))}
          </div>
        )}
        </div>
      </section></div>
  )
}

export default ConnectionPage