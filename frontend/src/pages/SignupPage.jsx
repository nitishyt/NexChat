import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useSignup from '../hooks/useSignup'

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  })

  const { signupMutation, isPending, error } = useSignup()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSignup = (e) => {
    e.preventDefault()
    console.log('Sending:', formData)
    signupMutation(formData)
  }


  return (
    <>
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
            <form onSubmit={handleSignup} className='mt-6'>
              <h2 className='card-title'>Get Started</h2>
              <p className="para">Welcome to our platform! Please fill in the details below to get started.</p>
              <div className='my-4 ' >
                <fieldset className="fieldset mt-2">
                  <legend className="fieldset-legend">Full Name</legend>
                  <label className="input validator">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </g>
                    </svg>
                    <input
                      type="text"
                      required
                      name="fullName"

                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                      pattern="[A-Za-z][A-Za-z0-9\-]*"
                      minLength="3"
                      maxLength="30"
                      title="Only letters, numbers or dash"
                    />
                  </label>
                  <p className="validator-hint hidden">
                    Must be 3 to 30 characters
                    <br />containing only letters, numbers or dash
                  </p>
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Email</legend>
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

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Password</legend>
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
                  {' '}I agree to the Terms and Conditions
                </label><br /><br />

                <button className="btn btn-primary w-full">{
                  isPending && <span className="loading loading-spinner"></span>
                }Create Account</button>

                <br /><br />
                <p className='text-sm text-base-content/60'>
                  Already have an account? <Link to="/login" className='link link-primary'>Login</Link>
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
    </>
  )
}

export default SignupPage