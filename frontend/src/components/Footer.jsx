import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            
            <div>
{/*-------------Left Section------------------ */}
            <img className='mb-5 w-40' src= {assets.logo} alt="" />
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>Your trusted partner in health. Prescripto offers state-of-the-art medical care with a focus on your well-being and recovery. Here you can explore our services, find a doctor, and access valuable patient resources. For emergencies, please call 7205762904. We are here for our community around the clock.</p>
            </div>
            {/*-------------Centre Section------------------ */}
            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Contact us</li>
                    <li>Privacy policy</li>
                </ul>
            </div>
            {/*-------------Right Section------------------ */}
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>7205762904</li>
                    <li>adityabubna123@gmail.com</li>
                </ul>
            </div>
        </div>
        {/*--------------Copyright Text ---------------- */}
        <div>
        <hr />
        <p className='py-5 text-center text-sm'>Copyright © 2024 Prescripto - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer