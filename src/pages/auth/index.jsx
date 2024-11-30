import { auth } from "../../config/firebase-config";
import { provider } from "../../config/firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useNavigate ,Navigate} from "react-router-dom";
import useGetUserInfo from "../../hooks/useGetUserInfo";
import "./styles.css";

const Auth = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {isAuth}=useGetUserInfo();

    const SignInWithGoogle = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const authInfo = {
                userId: result.user.uid,
                userName: result.user.displayName,
                profilePhoto: result.user.photoURL, // Corrected reference to user.photoURL
                isAuth: true,
            };
            localStorage.setItem("auth", JSON.stringify(authInfo));
            navigate("/Expense-Tracker/expense-tracker");
        } catch (err) {
            console.error("Sign-in failed", err);
            // Consider adding error handling, e.g., setError("Failed to sign in. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    if(isAuth){
        return <Navigate to="/expense-tracker"/>
    }
    return (
        <div className="login-page">
            <p>Sign In With Google to Continue</p>
            <button 
                className="login-with-google-button" 
                onClick={SignInWithGoogle} 
                disabled={loading}
            >
                {loading ? "Signing In..." : "Sign In With Google"}
            </button>
        </div>
    );
};

export default Auth;
