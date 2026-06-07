// src/pages/EditListingPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import './AuthPages.css'; // Reusing form styling

const categories = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Vehicles', 'Other'];

const EditListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    imageUrl: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Handle Ctrl+V / Cmd+V globally for this page
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          setImageFile(file);
          setImagePreview(URL.createObjectURL(file));
          setFormData(prev => ({ ...prev, imageUrl: '' }));
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await api.get(`/api/listings/${id}`);
        const listing = response.data.listing;
        
        // Verify ownership
        if (listing.seller._id !== user.id && listing.seller !== user.id) {
          navigate('/');
          return;
        }

        setFormData({
          title: listing.title,
          description: listing.description,
          price: listing.price,
          category: listing.category,
          imageUrl: listing.imageUrl || ''
        });
        
        if (listing.imageUrl) {
          setImagePreview(listing.imageUrl);
        }
      } catch (err) {
        setError('Failed to fetch listing details.');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, imageUrl: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', Number(formData.price));
      data.append('category', formData.category);
      if (formData.imageUrl) data.append('imageUrl', formData.imageUrl);
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      await api.put(`/api/listings/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(`/listings/${id}`); // Go back to listing details
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update listing');
      setSaving(false);
    }
  };

  if (loading) return <div className="page-container container text-center">Loading...</div>;

  return (
    <div className="page-container container">
      <div className="auth-card card animate-fade-in" style={{ margin: '0 auto', maxWidth: '600px' }}>
        <h2 className="auth-title">Edit Listing</h2>
        <p className="auth-subtitle">Update your item's details. Tip: You can Ctrl+V to paste a new image!</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">Title</label>
            <input 
              type="text" 
              id="title" name="title" 
              className="form-input" 
              value={formData.title} onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="price">Price ($)</label>
            <input 
              type="number" 
              id="price" name="price" 
              className="form-input" 
              value={formData.price} onChange={handleChange}
              required 
              min="0" step="0.01"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="category">Category</label>
            <select 
              id="category" name="category" 
              className="form-input" 
              value={formData.category} onChange={handleChange}
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea 
              id="description" name="description" 
              className="form-input" 
              value={formData.description} onChange={handleChange}
              required 
              rows="5"
            ></textarea>
          </div>

          <div className="form-group" style={{ padding: '16px', border: '2px dashed var(--border-color)', borderRadius: '8px', marginBottom: '24px' }}>
            <label className="form-label" style={{ marginBottom: '12px' }}>Item Image</label>
            
            {imagePreview ? (
              <div style={{ marginBottom: '16px', position: 'relative' }}>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }} />
                <button 
                  type="button" 
                  onClick={() => { setImageFile(null); setImagePreview(''); setFormData(prev => ({...prev, imageUrl: ''})); }}
                  style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px' }}>
                Click below to upload a new image, or Paste (Ctrl+V).
              </p>
            )}

            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              style={{ marginBottom: '12px', width: '100%' }}
            />

            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', margin: '8px 0' }}>OR</div>

            <input 
              type="url" 
              id="imageUrl" name="imageUrl" 
              className="form-input" 
              value={formData.imageUrl} 
              onChange={handleChange}
              placeholder="Paste image URL (https://...)"
              disabled={!!imageFile}
            />
          </div>

          <div className="flex gap-4 mt-4" style={{ display: 'flex', gap: '16px' }}>
            <button 
              type="button" 
              className="btn btn-outline flex-1" 
              style={{ flex: 1 }}
              onClick={() => navigate(`/listings/${id}`)}
              disabled={saving}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary flex-1" 
              style={{ flex: 1 }}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListingPage;
