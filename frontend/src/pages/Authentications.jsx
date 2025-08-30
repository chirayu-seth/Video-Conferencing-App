import { FaLock } from "react-icons/fa";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";

export default function Authentication(){

    const [username, setUsername]=useState();
    const [password, setPasword]=useState();
    const [name, setName]= useState()
    const [error, setError]=useState()
    const [message, setMessage]=useState()

    const [formState, setFormState]=useState(0);

    const [open, setOpen]=useState(false)

    const {handleRegister, handleLogin}= useContext(AuthContext)

    let handleAuth =async(e)=>{
       e.preventDefault()
        try{
            if(formState===0){
                let result=await handleLogin(username, password)
                
                 
                setUsername("")
                 
                 setPasword("")
                
              
                toast.success("signin Successfully")

                
              
                 
             } 

        }catch(err){
                
                toast.error("invalid login credentials")
                }
          try{
            if(formState===1){
        
        if (!name || !username || !password) {
        toast.error("All fields are required");
        return;
    }

            let result= await handleRegister(name, username, password);
            console.log(result)
            setUsername("")
            setMessage(result)
            setOpen(true)
            setError("")
            setFormState(0)
            setPasword("")
            toast.success("Signup Successfully")
            
            } 
          }catch(err){
            
            let message=(err.response.data.message)
            setError(message)
            
        }
    }

    return(
        <>
        <div className="MainContainer">
        <div className="LeftContainer"></div>
        <div className="RightContainer"> 
            <FaLock className="lock" />
            <div>
            <Button variant={formState===0 ? "contained":""} onClick={()=>{setFormState(0); setError(""); setMessage(""); setUsername(""); setPasword("")} }>Sign in</Button>
            <Button variant={formState===1 ? "contained":""} onClick={()=>{setFormState(1); setError(""); setMessage(""); setName("")}}> Sign up</Button>
            </div>
            
            <form>
            <div className="textfield">
            
             {formState===1 ?  <TextField  label="Full Name" variant="outlined" onChange={(e)=>setName(e.target.value)} value={name} />   : <></>}
              
            <TextField  label="Username" variant="outlined" onChange={(e)=>setUsername(e.target.value)} value={username}/>
             <TextField  label="Password" variant="outlined" type="password" onChange={(e)=>setPasword(e.target.value)} value={password} />
             </div>

             <p style={{color:"red"}}>{error}</p>
            <Button  onClick={handleAuth}className="btn" variant="contained"> {formState===0 ? "Login" : "Register"}</Button>
            </form>

        </div>
        
        </div>
        
        


        </>
    )
}