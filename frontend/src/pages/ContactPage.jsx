import { useState } from 'react';

export default function ContactPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleContactSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for your message! We\'ll get back to you soon.');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
    };

    return (
        <div className="page-container">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: '800' }}>Contact Us</h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginTop: '5px' }}>
                    We'd love to hear from you
                </p>
            </div>

            {/* Banner */}
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '300px', marginBottom: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>
                <img 
                    src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                    alt="Contact Us" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.1))',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 5%', color: 'white'
                }}>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Get in Touch</h3>
                    <p style={{ fontSize: '1.1rem', marginTop: '8px', opacity: 0.9 }}>We're here to help and answer any questions you might have</p>
                </div>
            </div>

            {/* Layout for cards and form */}
            <div className="cart-layout">
                {/* Contact cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="glass-panel" style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '6px' }}>📍 Visit Our Store</h3>
                        <p style={{ color: '#4a5568', fontSize: '0.95rem', lineHeight: 1.5 }}>
                            123 Commerce Street<br />Shopping District<br />New York, NY 10001
                        </p>
                    </div>

                    <div className="glass-panel" style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '6px' }}>📞 Call Us</h3>
                        <p style={{ color: '#4a5568', fontSize: '0.95rem', lineHeight: 1.5 }}>
                            Customer Service: <strong>+1 (555) 123-4567</strong><br />
                            Sales: <strong>+1 (555) 987-6543</strong><br />
                            Support: <strong>+1 (555) 456-7890</strong>
                        </p>
                    </div>

                    <div className="glass-panel" style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '6px' }}>✉️ Email Us</h3>
                        <p style={{ color: '#4a5568', fontSize: '0.95rem', lineHeight: 1.5 }}>
                            General: <strong>info@trendify.com</strong><br />
                            Support: <strong>support@trendify.com</strong><br />
                            Sales: <strong>sales@trendify.com</strong>
                        </p>
                    </div>

                    <div className="glass-panel" style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '6px' }}>🕒 Business Hours</h3>
                        <p style={{ color: '#4a5568', fontSize: '0.95rem', lineHeight: 1.5 }}>
                            Monday - Friday: 9:00 AM - 8:00 PM<br />
                            Saturday: 10:00 AM - 6:00 PM<br />
                            Sunday: 12:00 PM - 5:00 PM
                        </p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="glass-panel" style={{ padding: '30px' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                        Send us a Message
                    </h3>
                    <form className="auth-form" onSubmit={handleContactSubmit}>
                        <input 
                            type="text" 
                            placeholder="Your Name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required 
                        />
                        <input 
                            type="email" 
                            placeholder="Your Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                        <input 
                            type="text" 
                            placeholder="Subject" 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required 
                        />
                        <textarea 
                            placeholder="Your Message" 
                            rows="5" 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required 
                            style={{
                                width: '100%', padding: '12px 16px', marginBottom: '16px',
                                border: '1px solid var(--input-border)', borderRadius: '8px',
                                fontFamily: 'var(--font-sans)', fontSize: '0.95rem',
                                background: 'rgba(255, 255, 255, 0.8)', resize: 'vertical'
                            }}
                        ></textarea>
                        
                        <button type="submit" className="checkout-btn">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
