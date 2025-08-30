import { useEffect, useState } from "react";   // ✅ MUST have both
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function withAuth(Component) {
  return function Wrapper(props) {
    const [authenticated, setAuthenticated] = useState(null); // 👈 null means "checking"

    useEffect(() => {
      const verifyUser = async () => {
        try {
          const res = await axios.get("https://video-conferencing-app-backend-2ror.onrender.com/api/v1/users/verify", {
            withCredentials: true,
          });
          setAuthenticated(res.data.status);
        } catch (err) {
          setAuthenticated(false);
        }
      };

      verifyUser();
    }, []);

    if (authenticated === null) {
      return <p>Loading...</p>; // 👈 don’t redirect until check is done
    }

    if (!authenticated) {
      return <Navigate to="/auth" replace />;
    }

    return <Component {...props} />;
  };
}
