import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import useLogin from '../hooks/useLogin'
import { Link } from 'react-router-dom'

const LoginPage = () => {
  const [formData,setFormData] =useState({
    email:"",
    password:""
  })

  const {loginMutation,isPending,error} =useLogin()

  const handleLogin=(e)=>{
    e.preventDefault()
    loginMutation(formData)
  }
const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }


  return (
    <div className='h-screen w-full flexCenter'>
        <div className='card card-side bg-base-100 card-border border-base-300 card-sm max-w-200 gap-6 p-3'>
          {/*Left side */}
          <div className='card-body w-full'>
            {/* Logo */}
            <div className='flexCenter gap'>
              <img src="logo.jpg" alt="Logo" height={33} width={33} />
              <h3 className='hidden sm:block' ></h3>
            </div>
            {error && <div className='alert alert-error'>{error.response.data.message}
            </div>}
            {/*Form */}
            <form onSubmit={handleLogin} className='mt-6'>
              <h2 className='card-title'>Welcome Back</h2>
              <p className="para">Welcome back to our platform! Please login to continue.</p>
              <div className='my-4 ' >
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend text-sm font-medium">Email</legend>
                  <label className="input validator">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </g>
                    </svg>
                    <input type="email" name="email" placeholder="abc@gmail.com" value={formData.email} onChange={handleChange} required />
                  </label>
                  <div className="validator-hint hidden">Enter valid email address</div>
                </fieldset>

                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend text-sm font-medium">Password</legend>
                  <label className="input validator">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                        ></path>
                        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                      </g>
                    </svg>
                    <input
                      type="password"
                      name="password"
                      required
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      minLength="8"
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                      title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                    />
                  </label>
                  <p className="validator-hint hidden">
                    Must be more than 8 characters, including
                    <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
                  </p>
                </fieldset><br />
                <label type='checkbox'>
                  <input type="checkbox" required />
                  {' '}Remember me
                </label><br /><br />

                <button className="btn btn-primary w-full">{
                  isPending && <span className="loading loading-spinner"></span>
                }Login</button>

                <br /><br />
                <p className='text-sm text-base-content/60'>
                  Don't have an account? <Link to="/signup" className='link link-primary'>Sign up</Link>
                </p>
              </div>
            </form>
          </div>
          {/*Right side */}
          <div className='h-full w-full'>
            <div className='h-full w-full'>
              <img src='/image.jpg' alt="img" className='h-full w-full object-cover' />
            </div>
          </div>
        </div>
      </div>
  )
}

export default LoginPage