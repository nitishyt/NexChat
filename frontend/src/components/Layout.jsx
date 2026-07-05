import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getfriendsRequests } from '../../lib/api'
import ThemeSelector from './ThemeSelector'
import SideBar from './SideBar'

const Layout = () => {

    const [isOpen, setIsOpen] = useState(false)

    const { data: friendsRequests } = useQuery({
      queryKey: ['friendsRequests'],
      queryFn: getfriendsRequests,
      refetchInterval: 30000 // Refetch every 30 seconds
    })

    const requestCount = friendsRequests?.incomingRequests?.length || 0


  return (
        <div className="drawer lg:drawer-open h-screen overflow-hidden">
              <input id="my-drawer-4" type="checkbox" className="drawer-toggle" onChange={(e) => setIsOpen(e.target.checked)} />
                {/* Right Side */}
          <div className="drawer-content flex flex-col h-full min-h-0 overflow-hidden">
                  {/* Navbar */}
            <nav className="navbar sticky top-0 z-30 w-full bg-base-300 flexBetween shrink-0">
                      <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                          {/* Sidebar toggle icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
                      </label>
                      <div className="px-4">
                          <div className='flexCenter gap-3 ml-auto'>
                              <Link to="requests" className='btn btn-sm rounded-2xl'>Requests
                                {requestCount > 0 && (
                                  <div className='badge badge-sm badge-error'>{requestCount}</div>
                                )}
                              </Link>
                              <ThemeSelector/>
                          </div>
                        
                      </div>
                  </nav>
                  {/* Page content here */}
                  <div className="flex-1 min-h-0 overflow-y-auto p-4">
                    <Outlet />
                  </div>
              </div>
                {/* Sidebar */}
              <div className="drawer-side is-drawer-close:overflow-visible">
                  <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                  <SideBar isOpen={isOpen} />
              </div>
          </div>
  )
}

export default Layout