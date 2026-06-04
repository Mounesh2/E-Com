import { useState } from 'react';
import { API_BASE_URL } from '../config';

export default function AuthPage({ onLoginSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Gmail validation
        if (!isLogin && !email.endsWith('@gmail.com')) {
            setError('Email must be a Gmail address (@gmail.com)');
            return;
        }

        if (!isLogin && (!fullName || !phone || !address)) {
            setError('All fields are required for signup');
            return;
        }

        setLoading(true);
        const endpoint = isLogin ? '/api/login' : '/api/signup';
        const requestBody = isLogin 
            ? { email, password } 
            : { email, password, fullName, phone, address };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                if (isLogin) {
                    onLoginSuccess(data.token, email);
                } else {
                    alert(data.message);
                    setIsLogin(true);
                    // Reset signup form fields
                    setFullName('');
                    setPhone('');
                    setAddress('');
                }
            } else {
                setError(data.error || 'Request failed');
            }
        } catch (err) {
            console.error('Auth error:', err);
            setLoading(false);
            setError('Network error connecting to the server');
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container glass-panel">
                <h2 className="auth-title">{isLogin ? 'Login' : 'Sign Up'}</h2>
                
                {error && (
                    <div style={{
                        background: '#fed7d7',
                        color: '#9b2c2c',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        border: '1px solid #f5c6cb'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                    
                    {!isLogin && (
                        <>
                            <input 
                                type="text" 
                                placeholder="Full Name" 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required 
                            />
                            <input 
                                type="tel" 
                                placeholder="Phone Number" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required 
                            />
                            <input 
                                type="text" 
                                placeholder="Address" 
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required 
                            />
                        </>
                    )}

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </form>

                <p className="auth-toggle-text">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span 
                        className="auth-toggle-link" 
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                    >
                        {isLogin ? 'Sign up' : 'Login'}
                    </span>
                </p>
            </div>
        </div>
    );
}
