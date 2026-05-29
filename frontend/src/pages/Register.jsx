import React, {useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import apiFetch from '../utils/apiFetch';
import {
    isAllowedEmailDomain,
    INVALID_EMAIL_DOMAIN_MESSAGE,
} from '../utils/emailDomainValidator';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { notify } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedEmail = email.trim();

        if (!isAllowedEmailDomain(trimmedEmail)) {
            notify.error(INVALID_EMAIL_DOMAIN_MESSAGE);
            return;
        }

        try {
            const res = await apiFetch('/api/v1/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({name, email: trimmedEmail, password}),
                loaderMessage: 'Creating your account...',
            });

            const data = await res.json();
            if (res.ok) {
                notify.success(data.message || 'OTP sent to your email. Please verify to continue.');
                navigate('/verify-otp', { state: { email: data.email, name: data.name } });
            } else {
                notify.error(data.message || 'Registration failed. Please try again.');
            }
        } catch(error) {
            console.log("Registration Failed ", error);
            notify.error('Unable to register right now. Please try again.');
        }
    }

    return (
        <div className='auth-container'>
            <form onSubmit={handleSubmit} className='auth-form'> 
                <h2>Register</h2>
                <input type='text' placeholder='Full Name' value={name} onChange={(e) => setName(e.target.value)} required/>
                <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                <button type='submit' className='btn'>Register</button>  
                <p>Already have an account? <Link to='/login'>Login</Link></p>
            </form>

        </div>
    )
}

export default Register;