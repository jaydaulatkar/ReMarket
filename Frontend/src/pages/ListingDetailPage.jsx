// src/pages/ListingDetailPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Tag, User as UserIcon, Calendar, MessageSquare, Edit, Trash2, Eye } from 'lucide-react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import './ListingDetailPage.css';

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Inquiry state
  const [inquiryText, setInquiryText] = useState('');
  const [inquiryStatus, setInquiryStatus] = useState(''); // 'sending', 'sent', 'error'

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await api.get(`/api/listings/${id}`);
        setListing(response.data.listing);
      } catch (err) {
        setError('Listing not found or has been removed.');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await api.delete(`/api/listings/${id}`);
        navigate('/profile');
      } catch (err) {
        alert('Failed to delete listing');
      }
    }
  };

  const handleMarkSold = async () => {
    try {
      const response = await api.patch(`/api/listings/${id}/sold`);
      setListing(response.data.listing);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleSendInquiry = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    
    setInquiryStatus('sending');
    try {
      await api.post('/api/inquiries', { listingId: id, message: inquiryText });
      setInquiryStatus('sent');
      setInquiryText('');
    } catch (err) {
      setInquiryStatus('error');
    }
  };

  if (loading) return <div className="page-container container text-center">Loading...</div>;
  if (error || !listing) return <div className="page-container container text-center">{error}</div>;

  const isOwner = user && listing.seller && user.id === listing.seller._id;
  const formattedDate = new Date(listing.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="page-container container animate-fade-in">
      <div className="listing-detail-layout">
        
        {/* Left Column: Image */}
        <div className="listing-image-container glass-panel">
          {listing.isSold && <div className="detail-sold-badge">SOLD</div>}
          <img 
            src={listing.imageUrl || 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=1200'} 
            alt={listing.title} 
            className="listing-hero-image"
          />
        </div>

        {/* Right Column: Info & Actions */}
        <div className="listing-info-container">
          <div className="glass-panel p-4 mb-4">
            <div className="detail-category"><Tag size={14}/> {listing.category}</div>
            <h1 className="detail-title">{listing.title}</h1>
            <div className="detail-price">${listing.price.toLocaleString()}</div>
            
            <div className="detail-meta">
              <div className="meta-item"><UserIcon size={16}/> Sold by {listing.seller?.username}</div>
              <div className="meta-item"><Calendar size={16}/> Listed on {formattedDate}</div>
              <div className="meta-item"><Eye size={16}/> {listing.views} {listing.views === 1 ? 'view' : 'views'}</div>
            </div>

            <div className="detail-description">
              <h3>Description</h3>
              <p>{listing.description}</p>
            </div>
          </div>

          {/* Owner Actions */}
          {isOwner ? (
            <div className="glass-panel p-4 owner-actions">
              <h3>Manage Listing</h3>
              <div className="action-buttons">
                {/* We can build the edit page later, using placeholder path */}
                <Link to={`/edit-listing/${id}`} className="btn btn-outline flex-1">
                  <Edit size={16}/> Edit
                </Link>
                <button onClick={handleMarkSold} className="btn btn-primary flex-1">
                  {listing.isSold ? 'Mark Available' : 'Mark Sold'}
                </button>
                <button onClick={handleDelete} className="btn btn-danger flex-1">
                  <Trash2 size={16}/> Delete
                </button>
              </div>
            </div>
          ) : (
            /* Buyer Contact Form */
            <div className="glass-panel p-4">
              <h3>Contact Seller</h3>
              {!user ? (
                <div className="text-center mt-3">
                  <p className="mb-3 text-secondary">Log in to send a message to the seller.</p>
                  <Link to="/login" className="btn btn-primary">Login to Message</Link>
                </div>
              ) : listing.isSold ? (
                <p className="text-secondary mt-2">This item has been sold and is no longer available.</p>
              ) : inquiryStatus === 'sent' ? (
                <div className="success-message mt-3">
                  Message sent successfully! The seller will see it on their profile.
                </div>
              ) : (
                <form onSubmit={handleSendInquiry} className="mt-3">
                  <textarea 
                    className="form-input mb-3" 
                    rows="4" 
                    placeholder="Hi, is this still available?"
                    value={inquiryText}
                    onChange={(e) => setInquiryText(e.target.value)}
                    required
                  ></textarea>
                  <button type="submit" className="btn btn-primary w-100" disabled={inquiryStatus === 'sending'}>
                    <MessageSquare size={16} style={{marginRight: '8px'}}/> 
                    {inquiryStatus === 'sending' ? 'Sending...' : 'Send Message'}
                  </button>
                  {inquiryStatus === 'error' && <p className="text-danger mt-2">Failed to send message.</p>}
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
