import user_icon from './assets/person.png';
import email_icon from './assets/email.png';
import password_icon from './assets/password.png';
import './LoginPage.css';
import {  useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
import { getUserByEmail, createUser} from '../../api/UserApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
    const [action, setAction] = useState("Login")
    const { setUser } = useContext(UserContext); // Get setUser function from UserContext
    const navigate = useNavigate(); // Initialize useHistory hook

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => { 
        try {
            if(name.length===0 && password.length===0) {
                toast.error('Invalid email or password!');
            }
            else {
                const userData = await getUserByEmail(email); 
                if(password===userData.password) {
                    setUser({ loggedIn: true });
                    navigate('/projects', { state: { userData } });
                    toast.success(`Welcome ${userData.name}!`);
                }
                else {
                    toast.error("Wrong Password!");
                }
            }
        } catch (error) {
            console.error('Error occurred during login:', error);
        }
    };

    const handleCreateNewAccount = () => {
        setAction('Signup');
        setName("");
        setEmail("");
        setPassword("");
    }

    const handleSignUp = async () => {
        try {
            if(password.length<8) {
                toast.error('Password should be at least 8 characters!');
            }
            else if(!isValidEmail(email)) {
                toast.error('Invalid Email Id!');
            }
            else if(name.length===0){
                toast.error('Name should not be empty!');
            }
            else {
                const newUser = {
                    name: name,
                    email: email,
                    password: password
                };
                const response = await createUser(newUser);
                console.log(response);
                toast.success("Account created successfully!")
                setAction('Login');
            }
        } catch (error) {
            console.error('Error occurred during login:', error);
        }
    }

    const isValidEmail = (email) => {
        // Regular expression pattern for validating email addresses
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
      };

    return (
        <div className='container'>
            <div className='header'>
                <div className='text'>TodoNest</div>
                <div className='underline'></div>
            </div>
            <div className='inputs'>
                { action==='Login' ? <div></div> : <div className='input'>
                    <img src={user_icon} alt=''/>
                    <input type='text' placeholder='Name'value={name}
                        onChange={(e) => setName(e.target.value)}/>
                </div>}
                <div className='input'>
                    <img src={email_icon} alt=''/>
                    <input type='email' placeholder='Email Id'value={email}
                        onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className='input'>
                    <img src={password_icon} alt=''/>
                    <input type='password' placeholder='Password'value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                </div>
            </div>
            {action==='Signup' ? <div></div> : <div className='forgot-password'>Don't have an account? &nbsp;<span onClick={handleCreateNewAccount}>Create one here.</span> </div>}
            <div className='submit-container'>
                {action==='Login' ? <div className='submit' onClick={handleLogin}>Log In</div> : <div className='submit' onClick={handleSignUp}>Sign Up</div>}
                
                
            </div>
        </div>
    )
}

export default LoginPage;