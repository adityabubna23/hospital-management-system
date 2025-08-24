import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  // Safe context consumption with fallback empty object
  const adminCtx = useContext(AdminContext) || {};
  const { aToken = '', setAToken = () => {} } = adminCtx;
  const navigate = useNavigate();

  const logout = () => {
    if (aToken) {
      setAToken('');
      localStorage.removeItem('aToken');
    }
    navigate('/');
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white shadow-sm">
      {/* Left side logo + role */}
      <div className="flex items-center gap-2 text-xs">
        <img 
          className="w-36 sm:w-40 cursor-pointer" 
          src={assets?.admin_logo || ''} 
          alt="Admin Logo" 
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          {aToken ? 'Admin' : 'Doctor'}
        </p>
      </div>

      {/* Right side logout button */}
      <button 
        onClick={logout} 
        className="bg-red-500 hover:bg-red-600 text-white text-sm px-10 py-2 rounded-full transition-all"
      >
        Logout
      </button>
    </div>
  )
}

export default Navbar