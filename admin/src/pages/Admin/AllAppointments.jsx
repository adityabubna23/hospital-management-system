import React from "react";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        {/* HEADER ROW - Remove grid-flow-col */}
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b font-medium">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>
        
        {/* DATA ROWS - Remove flex classes */}
        {appointments.map((item, index) => (
          <div
            className="sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
            key={index}
          >
            <p>{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={item.userData?.image || "https://via.placeholder.com/32"}
                alt=""
              />
              <p>{item.userData?.name || "Unknown"}</p>
            </div>
            <p>{item.userData?.dob ? calculateAge(item.userData.dob) : "N/A"}</p>
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 h-8 rounded-full object-cover bg-gray-200"
                src={item.docData?.image || "https://via.placeholder.com/32"}
                alt=""
              />
              <p>{item.docData?.name || "Unknown"}</p>
            </div>
            <p>{currency}{item.amount}</p>
            <div>
              {item.cancelled ? (
                <p className="text-red-500 text-xs font-medium">Cancelled</p>
              ) : (
                <img 
                  onClick={() => cancelAppointment(item._id)} 
                  className="w-10 cursor-pointer" 
                  src={assets.cancel_icon} 
                  alt="" 
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;