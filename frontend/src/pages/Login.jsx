import React, {useState, useContext} from 'react';
import {useNavigate, Link}  from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import apiFetch from '../utils/apiFetch';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();
    const { notify } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await apiFetch('/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json'},
                body: JSON.stringify({email, password}),
                loaderMessage: 'Signing you in...',
            });

            const data = await res.json();
            if (res.ok) {
                login(data);
                notify.success('Welcome back! You are now logged in.');
                navigate('/');
            } else if (res.status === 403 && data.requiresVerification) {
                notify.info(data.message || 'Please verify your email to continue.');
                navigate('/verify-otp', { state: { email: data.email } });
            } else {
                notify.error(data.message || 'Login failed. Please check your credentials.');
            }

        } catch(error) {    
            console.error('Failed to login ', error);
            notify.error('Unable to login right now. Please try again.');
        }
    };

   

    return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="btn">Login</button>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
};

export default Login;