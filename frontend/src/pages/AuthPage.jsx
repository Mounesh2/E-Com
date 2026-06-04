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
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

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
                    alert('Account created! Please log in.');
                    setIsLogin(true);
                    setFullName(''); setPhone(''); setAddress('');
                }
            } else {
                setError(data.error || 'Request failed. Please try again.');
            }
        } catch (err) {
            setLoading(false);
            setError('Network error. Please check your connection.');
        }
    };

    /* ── Styles ── */
    const S = {
        page: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #ff3f6c 0%, #ff8c42 40%, #ffd36e 100%)',
            padding: '24px',
            fontFamily: "'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
        card: {
            width: '100%',
            maxWidth: '440px',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            boxShadow: '0 25px 60px rgba(255,63,108,0.25), 0 8px 30px rgba(0,0,0,0.12)',
            overflow: 'hidden',
        },
        cardTop: {
            background: 'linear-gradient(135deg, #ff3f6c, #ff6b35)',
            padding: '36px 40px 32px',
            textAlign: 'center',
            position: 'relative',
        },
        logo: {
            fontSize: '2.8rem',
            marginBottom: '8px',
        },
        brandName: {
            color: '#ffffff',
            fontSize: '2rem',
            fontWeight: 800,
            letterSpacing: '-1px',
            margin: 0,
        },
        tagline: {
            color: 'rgba(255,255,255,0.85)',
            fontSize: '0.9rem',
            marginTop: '4px',
            fontWeight: 500,
        },
        tabRow: {
            display: 'flex',
            borderBottom: '1px solid #eaeaec',
        },
        tab: (active) => ({
            flex: 1,
            padding: '14px',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            border: 'none',
            background: active ? '#fff' : '#f9f9fb',
            color: active ? '#ff3f6c' : '#535766',
            borderBottom: active ? '3px solid #ff3f6c' : '3px solid transparent',
            transition: 'all 0.2s',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
        }),
        body: {
            padding: '32px 40px 36px',
        },
        errorBox: {
            background: '#fff0f3',
            border: '1px solid #ffb3c1',
            color: '#c0392b',
            padding: '12px 16px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '0.88rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        fieldGroup: {
            marginBottom: '16px',
        },
        label: {
            display: 'block',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#535766',
            marginBottom: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
        },
        input: {
            width: '100%',
            padding: '13px 16px',
            border: '1.5px solid #eaeaec',
            borderRadius: '10px',
            fontSize: '0.95rem',
            fontFamily: 'inherit',
            color: '#282c3f',
            background: '#fafafa',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxSizing: 'border-box',
        },
        passWrapper: {
            position: 'relative',
        },
        eyeBtn: {
            position: 'absolute',
            right: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.1rem',
            color: '#7e818c',
            padding: 0,
        },
        submitBtn: {
            width: '100%',
            padding: '15px',
            background: 'linear-gradient(135deg, #ff3f6c, #ff6b35)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginTop: '8px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            boxShadow: '0 6px 20px rgba(255,63,108,0.35)',
            transition: 'transform 0.15s, box-shadow 0.15s',
            fontFamily: 'inherit',
        },
        toggleRow: {
            textAlign: 'center',
            marginTop: '22px',
            fontSize: '0.9rem',
            color: '#535766',
        },
        toggleLink: {
            color: '#ff3f6c',
            fontWeight: 700,
            cursor: 'pointer',
            textDecoration: 'underline',
            background: 'none',
            border: 'none',
            fontFamily: 'inherit',
            fontSize: 'inherit',
        },
        divider: {
            textAlign: 'center',
            color: '#7e818c',
            fontSize: '0.8rem',
            margin: '20px 0',
            position: 'relative',
        },
    };

    const inputFocusStyle = `
        .auth-input:focus {
            border-color: #ff3f6c !important;
            box-shadow: 0 0 0 3px rgba(255,63,108,0.12) !important;
            background: #fff !important;
        }
        .auth-submit-btn:hover:not(:disabled) {
            transform: translateY(-2px) !important;
            box-shadow: 0 10px 28px rgba(255,63,108,0.45) !important;
        }
    `;

    return (
        <>
            <style>{inputFocusStyle}</style>
            <div style={S.page}>
                <div style={S.card}>

                    {/* Top Brand Header */}
                    <div style={S.cardTop}>
                        <div style={S.logo}>🛍️</div>
                        <h1 style={S.brandName}>Trendify</h1>
                        <p style={S.tagline}>Your Premium Fashion Destination</p>
                    </div>

                    {/* Login / Sign Up Tabs */}
                    <div style={S.tabRow}>
                        <button style={S.tab(isLogin)} onClick={() => { setIsLogin(true); setError(''); }}>
                            Login
                        </button>
                        <button style={S.tab(!isLogin)} onClick={() => { setIsLogin(false); setError(''); }}>
                            Sign Up
                        </button>
                    </div>

                    {/* Form Body */}
                    <div style={S.body}>

                        {/* Error Message */}
                        {error && (
                            <div style={S.errorBox}>
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>

                            {/* Email */}
                            <div style={S.fieldGroup}>
                                <label style={S.label}>📧 Email Address</label>
                                <input
                                    className="auth-input"
                                    type="email"
                                    placeholder="you@gmail.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    style={S.input}
                                />
                            </div>

                            {/* Password */}
                            <div style={S.fieldGroup}>
                                <label style={S.label}>🔒 Password</label>
                                <div style={S.passWrapper}>
                                    <input
                                        className="auth-input"
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        style={{ ...S.input, paddingRight: '44px' }}
                                    />
                                    <button
                                        type="button"
                                        style={S.eyeBtn}
                                        onClick={() => setShowPass(!showPass)}
                                    >
                                        {showPass ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            {/* Signup Extra Fields */}
                            {!isLogin && (
                                <>
                                    <div style={S.fieldGroup}>
                                        <label style={S.label}>👤 Full Name</label>
                                        <input
                                            className="auth-input"
                                            type="text"
                                            placeholder="John Doe"
                                            value={fullName}
                                            onChange={e => setFullName(e.target.value)}
                                            required
                                            style={S.input}
                                        />
                                    </div>
                                    <div style={S.fieldGroup}>
                                        <label style={S.label}>📱 Phone Number</label>
                                        <input
                                            className="auth-input"
                                            type="tel"
                                            placeholder="9999999999"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            required
                                            style={S.input}
                                        />
                                    </div>
                                    <div style={S.fieldGroup}>
                                        <label style={S.label}>📍 Delivery Address</label>
                                        <input
                                            className="auth-input"
                                            type="text"
                                            placeholder="123 Main Street, City"
                                            value={address}
                                            onChange={e => setAddress(e.target.value)}
                                            required
                                            style={S.input}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="auth-submit-btn"
                                disabled={loading}
                                style={S.submitBtn}
                            >
                                {loading
                                    ? '⏳ Processing...'
                                    : isLogin ? '🚀 Login to Trendify' : '✨ Create My Account'
                                }
                            </button>
                        </form>

                        {/* Toggle Link */}
                        <p style={S.toggleRow}>
                            {isLogin ? "New to Trendify? " : "Already have an account? "}
                            <button
                                style={S.toggleLink}
                                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            >
                                {isLogin ? 'Create a free account' : 'Log in here'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
