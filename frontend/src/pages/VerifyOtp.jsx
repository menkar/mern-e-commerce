import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import apiFetch from '../utils/apiFetch';

const OTP_LENGTH = 6;

const VerifyOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const { notify } = useNotification();

    const [email, setEmail] = useState(location.state?.email || '');
    const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
    const [isResending, setIsResending] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        }
    }, [location.state?.email]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const otpValue = digits.join('');

    const handleDigitChange = (index, value) => {
        const sanitized = value.replace(/\D/g, '').slice(-1);
        const nextDigits = [...digits];
        nextDigits[index] = sanitized;
        setDigits(nextDigits);

        if (sanitized && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (event) => {
        event.preventDefault();
        const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);

        if (!pasted) return;

        const nextDigits = Array(OTP_LENGTH).fill('');
        pasted.split('').forEach((char, index) => {
            nextDigits[index] = char;
        });
        setDigits(nextDigits);

        const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
        inputRefs.current[focusIndex]?.focus();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email.trim()) {
            notify.error('Please enter your email address.');
            return;
        }

        if (otpValue.length !== OTP_LENGTH) {
            notify.error('Please enter the complete 6-digit OTP.');
            return;
        }

        try {
            const res = await apiFetch('/api/v1/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), otp: otpValue }),
                loaderMessage: 'Verifying your OTP...',
            });

            const data = await res.json();

            if (res.ok) {
                login(data);
                notify.success(data.message || 'Email verified successfully!');
                navigate('/');
                return;
            }

            notify.error(data.message || 'OTP verification failed. Please try again.');
        } catch (error) {
            console.error('OTP verification failed', error);
            notify.error('Unable to verify OTP right now. Please try again.');
        }
    };

    const handleResend = async () => {
        if (!email.trim()) {
            notify.error('Please enter your email address.');
            return;
        }

        setIsResending(true);

        try {
            const res = await apiFetch('/api/v1/auth/resend-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
                loaderMessage: 'Sending a new OTP...',
            });

            const data = await res.json();

            if (res.ok) {
                notify.success(data.message || 'A new OTP has been sent to your email.');
                setDigits(Array(OTP_LENGTH).fill(''));
                inputRefs.current[0]?.focus();
            } else {
                notify.error(data.message || 'Unable to resend OTP. Please try again.');
            }
        } catch (error) {
            console.error('Resend OTP failed', error);
            notify.error('Unable to resend OTP right now. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form auth-form--otp">
                <h2>Verify Email</h2>
                <p className="auth-form__subtitle">
                    Enter the 6-digit code sent to your email to complete registration.
                </p>

                {!location.state?.email && (
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                )}

                {location.state?.email && (
                    <p className="auth-form__email-hint">
                        Code sent to <strong>{email}</strong>
                    </p>
                )}

                <div className="otp-input-group" onPaste={handlePaste}>
                    {digits.map((digit, index) => (
                        <input
                            key={index}
                            ref={(element) => {
                                inputRefs.current[index] = element;
                            }}
                            type="text"
                            inputMode="numeric"
                            autoComplete={index === 0 ? 'one-time-code' : 'off'}
                            maxLength={1}
                            className="otp-input"
                            value={digit}
                            onChange={(event) => handleDigitChange(index, event.target.value)}
                            onKeyDown={(event) => handleKeyDown(index, event)}
                            aria-label={`OTP digit ${index + 1}`}
                        />
                    ))}
                </div>

                <button type="submit" className="btn" disabled={otpValue.length !== OTP_LENGTH}>
                    Verify &amp; Continue
                </button>

                <p className="auth-form__resend">
                    Didn&apos;t receive the code?{' '}
                    <button
                        type="button"
                        className="auth-form__link-btn"
                        onClick={handleResend}
                        disabled={isResending}
                    >
                        {isResending ? 'Sending...' : 'Resend OTP'}
                    </button>
                </p>

                <p>
                    Wrong email? <Link to="/register">Register again</Link>
                </p>
                <p>
                    Already verified? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default VerifyOtp;
