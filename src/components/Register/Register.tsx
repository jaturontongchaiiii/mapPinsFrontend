import { useRef, useState} from 'react';
import LoginIcon from '@mui/icons-material/Login';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from "axios";
import "./Register.css";

function Register({setShowRegister}: any) {

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const usernameRef: any = useRef();
    const emailRef: any = useRef();
    const passwordRef: any = useRef();
    const confirmPasswordRef: any = useRef();

    const handleSubmit = async (e: any) => {
      e.preventDefault();

      const newUser = {
        username: usernameRef.current ? usernameRef.current.value: '',
        email: emailRef.current ? emailRef.current.value: '',
        password: passwordRef.current ? passwordRef.current.value: '',
        confirmPassword: confirmPasswordRef.current ? confirmPasswordRef.current.value: ''
      }

      try {
        const res = await axios.post("http://localhost:3001/api/users/register", newUser);
        setShowRegister(null);
        setError(false);
        setSuccess(true);
      } catch (err) {
        console.log(err);
        setError(false);
      }
    }


    return (
      <div className='registerContainer'>
        <div className='logo'>
          <LoginIcon className='logoIcon'></LoginIcon>
          <span>LamaPin</span>
        </div>
        <form onSubmit={handleSubmit}>
            <input autoFocus placeholder='username' type="text" ref={usernameRef} />
            <input placeholder='email' type="text" ref={emailRef} />
            <input type="password" min="6" placeholder="password" ref={passwordRef}/>
            <input type="password" min="6" placeholder="confirm password" ref={confirmPasswordRef}/>
            <button className='registerBtn' type='submit'>
              Register
            </button>
            {success && (
              <span className='success'>Successful. You can login now!</span>
            )}
            {error && <span className='failure'>Someting went wrong!</span>}
        </form>
        <CancelIcon
          className='registerCancel'
          onClick={() => setShowRegister(false)}
        >
        </CancelIcon>
      </div> 
    )
  }
  
  export default Register
  