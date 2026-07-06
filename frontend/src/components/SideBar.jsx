import React from 'react'
import { NavLink } from 'react-router-dom'
import useAuthUser from '../hooks/useAuthUser'
import useLogout from '../hooks/useLogout'
import { useQuery } from '@tanstack/react-query'
import { getfriendsRequests } from '../../lib/api'

const SideBar = ({ isOpen }) => {
    const { authenticatedUser, isLoading } = useAuthUser()
    const { logoutMutation } = useLogout()
    const { data: friendRequests = {} } = useQuery({
        queryKey: ['friendsRequests'],
        queryFn: getfriendsRequests,
        refetchInterval: 10000
    })
    const pendingCount = friendRequests?.incomingRequests?.length || 0
    const navbarItems = [
        {
            path: "/",
            label: "Dashboard",
            icon: "🏠︎ ", className: "opacity-50"
        }, {
            path: "/connection",
            label: "Connections",
            icon: "✉", className: "opacity-50"
        }, {
            path: "/notifications",
            label: "Notifications",
            icon: "🔔"
        }

    ]
    return (
        <div className="flex min-h-full flex-col items-start bg-base-100 overflow-hidden is-drawer-close:w-14 is-drawer-open:w-64">
            {/* Logo */}
            <div className='flexCenter gap-3 w-full py-4 px-4 border-b border-base-300'>
                <img src="/logo.jpg" alt="Logo" className='size-10 rounded-full object-cover shrink-0' />
                <span className={`font-bold text-lg tracking-wide ${isOpen ? 'block' : 'hidden'}`}>MyApp</span>
            </div>
            {/* Sidebar content here */}
            <ul className="menu w-full grow space-y-3 pt-10">
                {/* List item */}
                {navbarItems.map((link) => (
                    <li key={link.path} >
                        <NavLink to={link.path} end={link.path === '/'} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-base-200 text-info' : 'hover:bg-base-200'}`} data-tip={link.label}>
                            <span className='text-lg'>{link.icon}</span>
                            <span className='is-drawer-close:hidden font-semibold'>{link.label}</span>
                            {link.path === '/notifications' && pendingCount > 0 && (
                                <span className='badge badge-primary badge-xs ml-auto'>{pendingCount}</span>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>
            {/* User Profile */}
            <div className="dropdown dropdown-hover dropdown-top border border-base-300 bg-base-200 w-full">
                <div tabIndex={0} role="button" className="btn m-1 w-full">
                    <img src={authenticatedUser?.image} alt="User" height={43} width={43} className='rounded-full object-cover shrink-0' />
                    <span className='is-drawer-close:hidden truncate'>{authenticatedUser?.fullName}</span>
                </div>
                <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-[99] w-full p-2 shadow-sm">
                    <li className='disabled capitalize font-bold'><a className='truncate'>{authenticatedUser?.fullName}</a></li>
                    <li><a onClick={logoutMutation}>Logout ⏻️</a></li>
                </ul>
            </div>
        </div>
    )
}

export default SideBar