import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext'

const Login = () => {
  const [state, setState] = useState('Admin')

  const {setAToken,backendUrl} = useContext(AdminContext);
  const {setDToken} = useContext(DoctorContext);
  const[email,setEmail] = useState('');
  const[password,setPassword] = useState('');

const onSubmitHandler = async(event) => {
  event.preventDefault(); 
  try {
    if(state === 'Admin') {
      const {data} = await axios.post(backendUrl+'/api/admin/login', {email, password});
      if(data.success) {
        // Remove doctor token if exists
        localStorage.removeItem('dtoken');
        // Set admin token
        localStorage.setItem('atoken', data.token);
        setAToken(data.token);
        toast.success('Admin login successful');
        // Clear form fields
        setEmail('');
        setPassword('');
      } else {
        toast.error(data.message);
      }
    }
    else {
      const {data} = await axios.post(backendUrl+'/api/doctor/login', {email, password});
      if(data.success) {
        // Remove admin token if exists
        localStorage.removeItem('atoken');
        // Set doctor token
        localStorage.setItem('dtoken', data.token);
        setDToken(data.token);
        toast.success('Doctor login successful');
        // Clear form fields
        setEmail('');
        setPassword('');
      } else {
        toast.error(data.message);
      }
    }
  } catch (error) {
    toast.error(error.message);
  }
}


  return (
    <form onSubmit = {onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5e5e5e] text-sm shadow-lg'>
        
        <p className='text-2xl font-semibold m-auto'>
          <span className='text-primary'>{state}</span> Login
        </p>

        <div className='w-full'>
          <p>Email</p>
          <input 
            type="email" 
            required 
            className='border border-[#dadada] rounded w-full p-2 mt-1' 
            onChange = {(e)=>setEmail(e.target.value)}
            value = {email}
          />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input 
            type="password" 
            required 
            className='border border-[#dadada] rounded w-full p-2 mt-1' 
             onChange = {(e)=>setPassword(e.target.value)}
            value = {password}
          />
        </div>

        <button className='bg-primary text-white w-full py-2 rounded-md text-base'>
          Login
        </button>

        {
          state === 'Admin'
            ? <p>Doctor Login? 
                <span 
                  className='text-primary underline cursor-pointer text-xs ml-1'
                  onClick={() => setState('Doctor')}
                >
                  Click here
                </span>
              </p>
            : <p>Admin Login? 
                <span 
                  className='text-primary underline cursor-pointer text-xs ml-1'
                  onClick={() => setState('Admin')}
                >
                  Click here
                </span>
              </p>
        }

      </div>
    </form>
  )
}

export default Login
