import User from "../models/user.model.js"
import httpstatus from "http-status"
import bcrypt from "bcrypt"
import createSecretToken from "../utils/SecretToken.js"
import { Meeting } from "../models/meeting.model.js"
import jwt from "jsonwebtoken";




const login = async(req,res,next)=>{
     const {username,password}=req.body;
       if(!username || !password ){
      return res.status(400).json({message:'All fields are required'})
    }

     try{
        const existingUser= await User.findOne({username})
        if(!existingUser){
            return res.status(httpstatus.NOT_FOUND).json({message:"User not found "})
        }
     const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) return res.status(httpstatus.FAILED_DEPENDENCY).json({ message: "Invalid Password" });
    const token = createSecretToken(existingUser._id);
         res.cookie("token", token, {
          httpOnly: true,
        secure: false,  
         sameSite: "lax",
         
         maxAge:3 * 24 * 60 * 60 * 1000
    });
    res.status(httpstatus.OK).json({message:"LoggedIn", success:true, user: existingUser});
    

    }catch (e){
    res.json({message:`something went wrong ${e}`})
    }
}



const register=async(req,res,next)=>{
    const {name, username, password}=req.body;
    
    try{
        const existingUser= await User.findOne({username})
        if(existingUser){
            return res.status(httpstatus.FOUND).json({message:"User already exists"})
        }

        const hashedPassword=await bcrypt.hash(password,10)
        const newUser= await User.create({
            name:name,
            username:username,
            password:hashedPassword
        })

        const token = createSecretToken(newUser._id);
         res.cookie("token", token, {
         httpOnly: true,
          secure: false, 
            sameSite: "lax",
         maxAge:3 * 24 * 60 * 60 * 1000
    });
    res.status(httpstatus.CREATED).json({message:"User Registerd", success:true, user: newUser});
    

    }catch (e){
    res.json({message:`something went wrong ${e}`})
    }
}


 const logout = (req, res) => {
 try{
res.clearCookie("token")
return res.status(200).json({ message: "Logged out successfully" });
  }catch(err){
return res.status(500).json({ message: err.message });
}
  
};



const getUserHistory = async (req, res) => {
  try {
    const token = req.cookies.token; // 👈 read cookie
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // verify and decode JWT
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const meetings = await Meeting.find({ user_id: user.username });
    return res.json(meetings);
  } catch (e) {
    return res.status(500).json({ message: `Something went wrong: ${e}` });
  }
};

const addToHistory = async (req, res) => {
  try {
    const token = req.cookies.token; // 👈 read cookie
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { meeting_code } = req.body;
    if (!meeting_code) {
      return res.status(400).json({ message: "Meeting code is required" });
    }

    const newMeeting = new Meeting({    
      user_id: user.username,
      meetingCode: meeting_code
    });

    await newMeeting.save();

    return res.status(201).json({ message: "Added code to history" });
  } catch (e) {
    return res.status(500).json({ message: `Something went wrong: ${e}` });
  }
};


export  {register, login, logout,getUserHistory, addToHistory}


