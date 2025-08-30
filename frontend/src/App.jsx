import {BrowserRouter,Route,Routes} from "react-router-dom"
import { ToastContainer } from "react-toastify"
import './App.css'
import LandingPage from "./pages/Landing"
import Authentication from "./pages/Authentications"
import { AuthProvider } from "./contexts/AuthContext"
import VideoMeetComponent from "./pages/VideoMeet"
import HomeComponent from "./pages/Home"
import withAuth from "./utils/withAuth"
import History from "./pages/History"
 


function App() {
   const ProtectedHome = withAuth(HomeComponent);

  return (
    <>
     <BrowserRouter>
    <AuthProvider>
    <Routes>
   
      
    <Route path="/" element={<LandingPage/>}/>
    <Route path="/auth" element={<Authentication/> } />
    <Route path="/home" element={<ProtectedHome/>} />
    <Route path="/history" element={<History/>} /> 
    <Route path="/:url" element={<VideoMeetComponent/>} />
   
    </Routes>

     <ToastContainer/>
    </AuthProvider>
    </BrowserRouter>
    </>
  )
}

export default App
