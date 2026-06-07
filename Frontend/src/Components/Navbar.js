import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Navbar(props) {
    const [userName, setUserName] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/user/me', {
                    withCredentials: true,
                });
                setUserName(response.data.firstName + " " + response.data.lastName);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('/logout', {}, { withCredentials: true });
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Logout failed. Please try again.');
        }
    };

    return (
        <nav className="glass-navbar sticky-top" style={{ padding: '0.75rem 2rem', zIndex: 1000 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
                
                {/* Brand / Logo */}
                <Link to="/home" className="navbar-brand fw-bold m-0" style={{ fontSize: '1.5rem', flexShrink: 0 }}>
                    {props.title}
                </Link>

                {/* Navigation Links (Right Aligned) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
                    <Link className="nav-link" to="/home">Home</Link>
                    <Link className="nav-link" to="/profile">Profile</Link>
                    <Link className="nav-link" to="/orders">Orders</Link>
                    <Link className="nav-link" to="/sell">Sell</Link>
                    <Link className="nav-link" to="/deliver">Deliver</Link>
                    <Link className="nav-link" to="/cart">Cart</Link>
                    <Link className="nav-link" to="/chatbot">Chatbot</Link>
                    
                    <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-glass)', margin: '0 0.5rem' }}></div>
                    
                    {userName && (
                        <span className="fw-semibold" style={{ color: 'var(--text-primary)' }}>{userName}</span>
                    )}

                    <button
                        className="btn-outline-premium"
                        onClick={handleLogout}
                        style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}
                    >
                        Logout
                    </button>
                </div>

            </div>
        </nav>
    );
}