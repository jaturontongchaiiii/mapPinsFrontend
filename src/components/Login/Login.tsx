import { useRef, useState} from "react";
import LoginIcon from '@mui/icons-material/Login';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from "axios";
import "./Login.css";
 
function Login({ setShowLogin }: any) {

    const [error, setError] = useState(false);
    const emailRef: any = useRef();
    const passwordRef: any = useRef();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const user = {
            email: emailRef.current ? emailRef.current.value: '',
            password: passwordRef.current ? passwordRef.current.value: ''
        }
        try {
            const res = await axios.post("http://localhost:3001/api/users/login", user);
            localStorage.setItem('email', user.email);
            localStorage.setItem('token', res.data.token);
            setShowLogin(false);
        } catch (err) {
            console.log(err);
            setError(true);
        }
    }
    
    return (
      <div className="loginContainer">
            <div className="logo">
                <LoginIcon className="logoIocn"></LoginIcon>
                <span>LamaPin</span>
            </div>
            <form onSubmit={handleSubmit}>
                <input autoFocus placeholder="email" ref={emailRef}></input>
                <input
                    type="password"
                    min="6"
                    placeholder="password"
                    ref={passwordRef}
                    >
                </input>
                <button className="loginBtn" type="submit">
                    Login
                </button>
                {error && <span className="failure">Something went wrong!</span>}
            </form>
            <CancelIcon className="loginCancel" onClick={() => setShowLogin(false)}></CancelIcon>
      </div> 
    )
}
  
export default Login
  