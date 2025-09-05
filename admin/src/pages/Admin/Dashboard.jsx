import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'
const Dashboard = () => {
  const {aToken, dashData,getDashData,cancelAppointment} = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);
  
  
  return dashData && (
    <div>
      <div>
        <div>
          <img src= {assets.doctor_icon} alt="" />
        </div>
      </div>

    </div>
  )
}

export default Dashboard