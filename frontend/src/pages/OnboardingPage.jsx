import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { completeOnboarding } from '../../lib/api'
import { LANGUAGES, SKILLS } from '../constraints'

const OnboardingPage = () => {
  const {authenticatedUser, isLoading} =useAuthUser()

  const [formData,setFormData] = useState({
    fullName: authenticatedUser?.fullName || '',
    image: authenticatedUser?.image || '',
    bio: authenticatedUser?.bio || '',
    skill: authenticatedUser?.skill || '',
    language: authenticatedUser?.language || '',
    location: authenticatedUser?.location || '',
  })

  const queryClient = useQueryClient()

  const {mutate:onboardingMutation,isPending} = useMutation({
    mutationFn:completeOnboarding,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['authUser']})
      toast.success('Onboarding completed successfully')
    },
    onError:(error)=>{
      toast.error(error.response.data.message)
    }
  })

  const handleChange =(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }
  const handleonboarding =(e) =>{
    e.preventDefault()
    onboardingMutation(formData)
  }

  const handleRandomAvatar = () =>{
    const idx = Math.floor(Math.random()*1000)+1
    const randomAvatar=`https://api.dicebear.com/10.x/avataaars/svg?seed=${idx}&backgroundColor=00bbff&accessoriesColor=262e33,65c9ff,5199e4,e6e6e6,929598,3c4f5c,b1e2ff,a7ffc4,ffdeb5,ffafb9,ffffb1,ff488e,ff5c5c,ffffff&clothesColor=262e33,5199e4,25557c,e6e6e6,929598,3c4f5c,b1e2ff,a7ffc4,ffafb9,ffffb1,ff5c5c,ffffff&borderRadius=50`
    setFormData({...formData,image:randomAvatar})
    toast.success('Random avatar generated successfully')
  }
  return (
     <div className='min-h-screen w-full flex items-center justify-center bg-base-200'>
      <div className='card bg-base-100 border border-base-300 w-full max-w-lg '>
        <div className='card-body'>
          <form onSubmit={handleonboarding} className='w-full'>
            <div className='flex flex-col items-center gap-4 py-6'>
              <h2 className='card-title text-2xl'>Complete Your Profile</h2>
              <p className='text-base-content/70'>Welcome to our platform! Please fill in the details below to get started.</p>
              {formData.image ? (
                <img src={formData.image} alt='Profile' className=' h-22 object-cover' />
              ):(
                <span className='size-12 text-base-content opacity-40'>📷</span>
              )}
              <button type='button' onClick={handleRandomAvatar} className='btn btn-info btn-xs'>
                Generate Random Avatar
                </button>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">Full Name</legend>
                <label className="input validator w-full">
                  <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input type="text" required name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} minLength="3" maxLength="30" />
                </label>
              </fieldset>
              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">Location</legend>
                <label className="input validator w-full">
                  <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5"/>
                  </svg>
                  <input type="text" required name="location" placeholder="Location" value={formData.location} onChange={handleChange} minLength="3" maxLength="30" />
                </label>
              </fieldset>
              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">Language</legend>
                <select required name="language" value={formData.language} onChange={handleChange} className="select select-bordered w-full">
                  <option value="">Select Language</option>
                  {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>
              </fieldset>
              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">Skill</legend>
                <select required name="skill" value={formData.skill} onChange={handleChange} className="select select-bordered w-full">
                  <option value="">Select Skill</option>
                  {SKILLS.map(skill => <option key={skill} value={skill}>{skill}</option>)}
                </select>
              </fieldset>
              <fieldset className="fieldset col-span-2">
                <legend className="fieldset-legend">Bio</legend>
                <textarea name="bio" className="textarea w-full" placeholder="Bio" value={formData.bio} onChange={handleChange} minLength="3" maxLength="100" />
              </fieldset>
            </div>
            <button type='submit' className={`btn btn-primary w-full mt-4 ${isPending ? 'loading' : ''}`} disabled={isPending}>
              {isPending ? 'Submitting...' : 'Complete Onboarding'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage