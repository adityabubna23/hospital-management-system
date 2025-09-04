import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import razorpay from "razorpay";
//api to register a user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "PLEASE ENTER A VALID EMAIL",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "PLEASE ENTER A STRONG PASSWORD",
      });
    }
    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found " }); // Added return
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "INCORRECT PASSWORD" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to get user profile data
const getProfile = async (req, res) => {
  try {
    // Use consistent userId from middleware
    const userData = await userModel
      .findById(req.body.userId)
      .select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to update user profile
const updateProfile = async (req, res) => {
  try {
    // Get userId from middleware instead of req.body
    const userId = req.body.userId;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Parse address if it's a string
    let parsedAddress = address;
    if (typeof address === "string") {
      try {
        parsedAddress = JSON.parse(address);
      } catch (e) {
        parsedAddress = address;
      }
    }

    const updateData = {
      name,
      phone,
      address: parsedAddress,
      dob,
      gender,
    };

    // Update user profile
    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.json({ success: false, message: "User not found" });
    }

    if (imageFile) {
      //upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//api to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor is not available" });
    }
    let slots_booked = docData.slots_booked;
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot is already booked" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }
    const userData = await userModel.findById(userId).select("-password");
    delete docData.slots_booked;
    const appointmentData = {
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData,
      amount: docData.fees,
      date: Date.now(),
    };
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: "Appointment Booked Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const listAppointments = async (req, res) => {
  try {
    const {userId} = req.body;
    const appointments = await appointmentModel.find({userId});
    res.json({success:true,appointments});
  } catch (error) {
     console.log(error);
    res.json({ success: false, message: error.message });
  }
}
const cancelAppointment = async (req, res) => {
  try {
    const {userId,appointmentId} = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if(appointmentData.userId !== userId){
      return res.json({success:false,message:"NOT AUTHORIZED"});
    }
    await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true});
//releasing doctor slots
const {docId,slotDate,slotTime} = appointmentData;
const docData = await doctorModel.findById(docId);
let slots_booked = docData.slots_booked;
slots_booked[slotDate] = slots_booked[slotDate].filter((slot) => slot !== slotTime);
await doctorModel.findByIdAndUpdate(docId,{slots_booked});
    res.json({success:true,message:"Appointment Cancelled Successfully"});
  } 
  catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message }); 
  }
}
const razorpayInstance = new razorpay({
  key_id: process.env.Razorpay_key_id,
  key_secret:process.env.Razorpay_key_secret
})

const paymentrazorpay = async (req, res) => {
  try {
      const {appointmentId} = req.body;
  const appointmentData = await appointmentModel.findById(appointmentId);
  if(!appointmentData|| appointmentData.cancelled){
    res.json({success:false,message:"APPOINTMENT CANCELLED OR NOT FOUND"});
  }
  const options = {
    amount: appointmentData.amount * 100,
    currency: process.env.CURRENCY,
    receipt: appointmentId,
  };
  const order = await razorpayInstance.orders.create(options);
  res.json({success:true,order});
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message }); 
  }
  }
const verifyRazorpay = async(req,res) =>{
  try {
    const {razorpay_order_id} = req.body;
   
const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
console.log(orderInfo);

if(orderInfo.status === "paid"){
   await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
   res.json({success:true,message:"Payment Verified Successfully"});
}else{
  res.json({success:false,message:"Payment Failed"});
}
  } catch (error) {
        console.log(error);
    res.json({ success: false, message: error.message }); 
  }
}
export { registerUser, loginUser, getProfile, updateProfile, bookAppointment ,listAppointments,cancelAppointment,paymentrazorpay,verifyRazorpay};
