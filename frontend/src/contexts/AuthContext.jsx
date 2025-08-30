import axios from "axios"
import httpStatus from "http-status"
import { createContext, useContext, useState} from "react"
import { useNavigate } from "react-router-dom"




export const AuthContext = createContext({})
   const client= axios.create({
    baseURL:"http://localhost:8000/api/v1/users",
       // 👈 always send cookies
    })



export const AuthProvider=({children})=>{
 

    const [userData, setUserData]=useState(null)

    const navigate= useNavigate();

 
 


const handleRegister= async(name, username, password)=>{
   
    try{
         const request= await client.post("/register",{ 
            name, username, password}, {withCredentials:true})

          if(request.status===httpStatus.CREATED){
            return request.data.message;
             
        }
        
    }catch(err){
         throw err;
    }
}


const handleLogin=async(username, password)=>{
    try{
        const request= await client.post("/login",{
            username, password}, {withCredentials:true})

        if(request.status===httpStatus.OK){
            setUserData(request.data.user);  

        const verify = await client.get("/verify", { withCredentials: true });
    
    setTimeout(() => {
      navigate("/home")
    }, 1000)
             
        }
       
    }catch(err){
        throw err
    }
}


    const handleLogout = async () => {
  try {
    await client.post("/logout", {}, {withCredentials: true});  // 👈 will clear cookie on backend
    setUserData(null);
    navigate("/auth");
  } catch (err) {
    throw err;
  }
};



const getHistoryOfUser = async()=>{
    try{
        let request = await client.get("/get_all_activity", {
           withCredentials: true,
        })
        return request.data
    } catch(err){
        throw err
    }
}

const addToUserHistory = async (meetingCode) => {
  try {
    let request = await client.post("/add_to_activity", 
      { meeting_code: meetingCode }, 
      { withCredentials: true }  // ✅ send cookie automatically
    );
    return request;
  } catch (err) {
    throw err;
  }
};


    
    const data={
        userData, setUserData,addToUserHistory, getHistoryOfUser, handleRegister, handleLogin, handleLogout
    }
    return(
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}