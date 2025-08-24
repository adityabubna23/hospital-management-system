import { createContext } from "react";
import { useState } from "react";
export const AdminContext = createContext();
import axios from "axios";
import { toast } from "react-toastify";


const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("atoken") ? localStorage.getItem("atoken") : ""
  );

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/all-doctors",
        {},
        { headers: { aToken } }
      );
      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
const changeAvailability = async (docId) => {
  try {
    const {data} = await axios.post(backendUrl+'/api/admin/change-availability',{docId},{headers:{aToken}});
    if(data.success)
    {
      toast.success(data.message);
      getAllDoctors();
    }
    else{
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
}
  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors, changeAvailability
  };
  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};
export default AdminContextProvider;
