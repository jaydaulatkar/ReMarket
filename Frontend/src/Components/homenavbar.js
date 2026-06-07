import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Homenavbar(props) {
    const [userName, setUserName] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchModal, setShowSearchModal] = useState(false);
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

    // Fetch initial products or search results
    const fetchSearchResults = async (query = '') => {
        try {
            const response = query.length > 0
                ? await axios.get(`/api/products/search`, {
                    params: { q: query }
                })
                : await axios.get(`/api/products/initial`);

            setSearchResults(response.data.slice(0, 18)); // Limit to 18 results
        } catch (error) {
            console.error('Search failed:', error);
            setSearchResults([]);
        }
    };

    // Trigger search on first modal open or when query changes
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        fetchSearchResults(query);
    };

    // Show initial products when search modal is opened
    const handleSearchClick = () => {
        setShowSearchModal(true);
        if (searchResults.length === 0) {
            fetchSearchResults();
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('/logout', {}, { withCredentials: true });
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Logout failed. Please try again.');
        }
    };

    const handleSearchItemClick = (productId) => {
        navigate(`/product/${productId}`);
        setShowSearchModal(false);
        setSearchQuery('');
    };

    return (
        <>
            <nav className="glass-navbar sticky-top" style={{ padding: '0.75rem 2rem', zIndex: 1000 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
                    
                    {/* Brand / Logo */}
                    <Link to="/home" className="navbar-brand fw-bold m-0" style={{ fontSize: '1.5rem', flexShrink: 0 }}>
                        {props.title}
                    </Link>

                    {/* Search Bar (Centered, Expanding) */}
                    <div style={{ flexGrow: 1, maxWidth: '500px' }}>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search products..."
                                value={searchQuery}
                                onClick={handleSearchClick}
                                onChange={handleSearchChange}
                                style={{ 
                                    width: '100%', 
                                    backgroundColor: 'rgba(255,255,255,0.05)', 
                                    color: 'var(--text-primary)', 
                                    border: '1px solid var(--border-glass)',
                                    borderRadius: 'var(--radius-xl)',
                                    padding: '0.6rem 1.2rem',
                                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            />
                        </div>
                    </div>

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

            {/* Search Modal */}
            {showSearchModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 1000,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        paddingTop: '10vh'
                    }}
                    onClick={() => setShowSearchModal(false)}
                >
                    <div
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-glass)',
                            width: '500px',
                            maxHeight: '70vh',
                            overflowY: 'auto',
                            borderRadius: 'var(--radius-lg)',
                            padding: '20px',
                            boxShadow: 'var(--shadow-glass)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {searchResults.length > 0 ? (
                            <div>
                                {searchResults.map((product) => (
                                    <div
                                        key={product._id}
                                        onClick={() => handleSearchItemClick(product._id)}
                                        style={{
                                            cursor: 'pointer',
                                            padding: '10px',
                                            borderBottom: '1px solid var(--border-glass)',
                                            transition: 'background-color 0.3s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-glass-light)'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                    >
                                        {product.name}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-muted">
                                {searchQuery.length > 0
                                    ? 'No products available matching your search'
                                    : 'Start typing to search products'}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}