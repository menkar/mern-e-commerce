import React, {useState, useContext} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/v1/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({name, email, password})
            });

            const data = await res.json();
            if (res.ok) {
                alert("Success");
                login(data);
                navigate('/login');
            } else {
                alert(data.message);
            }
        } catch(error) {
            console.log("Registration Failed ", error);
        }
    }

    return (
        <div className='register'>
            <form onSubmit={handleSubmit}> 
                <h2>Register</h2>
                <input type='text' placeholder='Full Name' value={name} onChange={(e) => setName(e.target.value)} required/>
                <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.email)} required/>
                <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.password)} required/>  
                <button type='submit'>Register</button>  
                <p>Already have an account? <Link to='/login'>Login</Link></p>
            </form>

        </div>
    )
}

export default Register;